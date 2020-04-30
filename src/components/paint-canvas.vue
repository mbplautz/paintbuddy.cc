<template>
    <div class="canvas">
        <div class="canvas-child">
            <canvas class="undo-canvas"></canvas>
            <canvas class="draw-canvas"></canvas>
            <canvas class="active-canvas"></canvas>
            <canvas class="tool-canvas"
                @mousedown="touchFunction"
                @touchstart="touchFunction"
                @mousemove="dragFunction"
                @touchmove="dragFunction"
                @mouseup="releaseFunction"
                @touchend="releaseFunction"></canvas>

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
    </div>
</template>

<script>
    export default {
        data() {
            return {
                initialized: false,
                mouseDown: false
            }
        },
        mounted() {
            this.createCanvasSet();
//            this.initialized = true;
            window.addEventListener('resize', this.resizeCanvasHandler);
        },
        methods: {
            createCanvasSet() {
                let canvasDiv = this.getCanvasDiv();
                let clientRect = canvasDiv.getBoundingClientRect();
                ['undo', 'draw', 'active', 'tool'].forEach(name => {
                    let canvas = document.querySelector(`canvas.${name}-canvas`);
                    canvas.width = clientRect.width;
                    canvas.height = clientRect.height;
                    this.$root.paint.canvas[`${name}Element`] = canvas;
                    this.$root.paint.canvas[`${name}Context`] = canvas.getContext('2d');
                    this.$root.paint.canvas[`${name}Context`].lineCap = 'round';
                });
            },
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
            getDrawCanvas() {
                return document.querySelector('.draw-canvas');
            },
            getActiveCanvas() {
                return document.querySelector('.active-canvas');
            },
            getCanvasDiv() {
                return document.querySelector('div.canvas-child');
            },
            touchFunction(e) {
                this.$root.paint.state.drawing = true;
                if (e.type === 'mousedown') {
                    this.mouseDown = true;
                }
                this.$root.paint.function.touch(e);
            },
            dragFunction(e) {
                if (e.type === 'mousemove' && !this.mouseDown) return;
                e.preventDefault();
                this.$root.paint.function.drag(e);
            },
            releaseFunction(e) {
                if (e.type === 'mouseup') {
                    this.mouseDown = false;
                }
                this.$root.paint.function.release(e);
                this.$root.paint.state.drawing = false;
                this.$root.$emit('drawing-released');
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
</style>