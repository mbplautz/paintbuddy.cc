<template>
    <div class="canvas">
        <div class="canvas-child" ref="canvas-div">
            <canvas class="undo-canvas"></canvas>
            <canvas class="draw-canvas"></canvas>
            <canvas class="active-canvas"></canvas>
            <canvas class="tool-canvas"
                @mousedown="touchFunction"
                @touchstart="touchFunction"
                @mousemove="dragFunction"
                @touchmove="dragFunction"
                @mouseup="releaseFunction"
                @touchend="releaseFunction">
            </canvas>
        </div>
        <div class="paint-cover-light">
        </div>
        <div class="paint-cover-heavy">
            <div class="outer">
                <div class="inner-cover"></div>
                <div class="inner-container">
                    <i class="fas fa-hourglass-half"></i>
                </div>
            </div>
        </div>
        <div class="selection"
            @mousedown="moveTouchFunction"
            @touchstart="moveTouchFunction"
            @mousemove="moveDragFunction"
            @touchmove="moveDragFunction"
            @mouseup="moveReleaseFunction"
            @touchend="moveReleaseFunction"
            :style="$root.paint.state.selection | selectionFilter">
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                mouseDown: false,
                moveMouseDown: false,
                selectionMoving: false // This prevents quick drag off from the selection acting as dragging on the canvas
            }
        },
        mounted() {
            this.createCanvasSet();
        },
        methods: {
            createCanvasSet() {
                let canvasDiv = this.getCanvasDiv();
                let maxScreenDimension = Math.max(window.screen.width, window.screen.height);
                ['undo', 'draw', 'active', 'tool'].forEach(name => {
                    let canvas = document.querySelector(`canvas.${name}-canvas`);
                    canvas.width = maxScreenDimension;
                    canvas.height = maxScreenDimension;
                    this.$root.paint.canvas[`${name}Element`] = canvas;
                    this.$root.paint.canvas[`${name}Context`] = canvas.getContext('2d');
                    this.$root.paint.canvas[`${name}Context`].lineCap = 'round';
                });
            },
            // This method is now vestigial and may be used in the future when resizing the canvas is supported again,
            // but for now, the canvas is just set to be the size of the screen as a square. This has a few implications:
            //
            // - Assuming the screen resolution never changes, the window can grow and shrink to whatever size and the 
            // canvas never needs to be reevaluated
            // - Also assuming the screen resolution never changes, the orientation can change (like on a tablet or a 
            // touchscreen device) and there is no need for the canvas to grow
            // - The maximum betwene screen width and screen height is taken and set as both the width and height for the
            // canvas. This allows the screen orientation to be able to change without reevaluating the canvas
            // - If the screen resolution does change (i.e. grow), the canvas will not grow with it (since there is no
            // resize handler)
            // - Resizing the canvas has an impact on the undo/redo change set queue, as those buffers are based on offsets
            // calculated by the current canvas size. If the canvas size grows, each of those offsets must be recalculated.
            // - Putting those recalculations within a window resize handler could be very costly. Though there are remedies
            // for this issue, preventing resize of the canvas eliminates complexity for the time being
            // - Getting the pixel data before resize and redrawing after resize did not prove to be 100% effective. There
            // would often be a section clipped.
            resizeCanvasHandler() {
                let canvasDiv = this.getCanvasDiv();
                let clientRect = canvasDiv.getBoundingClientRect();
                let drawCanvas = this.$root.paint.canvas.drawElement;
                // Only resize if it has grown - we never want to shrink!
                if (clientRect.width > drawCanvas.width || clientRect.height > drawCanvas.height) {
                    console.log('resized');
                    let drawContext = this.$root.paint.canvas.drawContext;
                    let imageData = drawContext.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
                    ['undo', 'draw', 'active', 'tool'].forEach(name => {
                        let canvas = document.querySelector(`canvas.${name}-canvas`);
                        canvas.width = clientRect.width;
                        canvas.height = clientRect.height;
                        canvas.getContext('2d').lineCap = 'round';
                    });
                    drawContext.fillStyle = '#ffffff'; // TODO: Centralize bacgkround color
                    drawContext.beginPath();
                    drawContext.rect(0, 0, clientRect.width, clientRect.height);
                    drawContext.fill();
                    this.$root.paint.state.setColor(this.$root.paint.options.color);
                    this.$root.paint.state.setLineWidth(this.$root.paint.options.lineWidth);
                    drawContext.putImageData(imageData, 0, 0);
                    // The alternative to this is to not resize the canvases, but make them large squares, 
                    // both sides the length of the longer device dimension, length or width
                }
            },
            getCanvasDiv() {
                return this.$refs['canvas-div'];
            },
            touchFunction(e) {
                if (this.selectionMoving) return;
                this.$root.$emit('drawing-started');
                this.$root.paint.state.drawing = true;
                if (e.type === 'mousedown') {
                    this.mouseDown = true;
                }
                this.$root.paint.function.touch(e);
            },
            dragFunction(e) {
                if (this.selectionMoving) return; 
                if (e.type === 'mousemove' && !this.mouseDown) return;
                e.preventDefault();
                this.$root.paint.function.drag(e);
            },
            releaseFunction(e) {
                if (this.selectionMoving) {
                    this.moveReleaseFunction(e);
                }
                else {
                    if (e.type === 'mouseup') {
                        this.mouseDown = false;
                    }
                    this.$root.paint.function.release(e);
                    this.$root.paint.state.drawing = false;
                    this.$root.$emit('drawing-released');
                }
            },
            moveTouchFunction(e) {
                if (e.type === 'mousedown') {
                    this.mouseDown = true;
                }
                this.selectionMoving = true;
                this.$root.paint.function.moveTouch(e);
            },
            moveDragFunction(e) {
                if (e.type === 'mousemove' && !this.mouseDown) return;
                e.preventDefault();
                this.$root.paint.function.moveDrag(e);
            },
            moveReleaseFunction(e) {
                if (e.type === 'mouseup') {
                    this.mouseDown = false;
                }
                this.selectionMoving = false;
                this.$root.paint.function.moveRelease(e);
            }
        },
        filters: {
            selectionFilter(val) {
                if (val) {
                    return `left: ${val.x}px; top: ${val.y}px; width: ${val.width}px; height: ${val.height}px;`
                }
                else {
                    return '';
                }
            }
        }
    }
</script>

<style>
    div.canvas, div.canvas-child {
        height: 100%;
    }

    div.canvas-child {
        position: relative;
    }

    canvas {
        position: absolute;
        top: 0;
        left: 0;
    }

    canvas.tool-canvas {
        z-index: 2;
    }

    canvas.active-canvas {
        z-index: 1;
    }

    canvas.draw-canvas {
        z-index: 0;
    }

    canvas.undo-canvas {
        z-index: -2;
    }

    div.paint-cover-light {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: -5;
    }

    div.paint-cover-heavy {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: -5;
    }

    div.paint-cover-heavy div.outer {
        position: relative;
        width: 100%;
        height: 100%;
    }

    div.paint-cover-heavy div.outer div.inner-cover {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #bbbbbb;
        opacity: 0.5;
    }

    div.paint-cover-heavy div.outer div.inner-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
    }

    div.paint-cover-heavy div.outer div.inner-container i {
        font-size: 72px;
        margin: 0 auto;
    }

    div.canvas div.selection {
        position: absolute;
        z-index: 3;
        cursor: move;
    }
</style>