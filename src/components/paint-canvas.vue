<template>
    <div class="canvas">
        <div class="canvas-child">
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
            this.initialized = true;
        },
        methods: {
            createCanvasSet() {
                if (this.initialized) {
                    this.getCanvasDiv.removeChild(this.getDrawCanvas());
                    this.getCanvasDiv.removeChild(this.getActiveCanvas());
                }
                let canvasDiv = this.getCanvasDiv();
                let clientRect = canvasDiv.getBoundingClientRect();
                // Create the draw canvas - this is where the image is actually drawn to and shown
                let drawCanvas = document.createElement('canvas');
                drawCanvas.className = 'draw-canvas';
                drawCanvas.width = clientRect.width;
                drawCanvas.height = clientRect.height;
                canvasDiv.appendChild(drawCanvas);
                // Create the active canvas - this is where things like actively moving lines and rectanges show until they are complete
                let activeCanvas = document.createElement('canvas');
                activeCanvas.className = 'active-canvas';
                activeCanvas.width = clientRect.width;
                activeCanvas.height = clientRect.height;
                canvasDiv.appendChild(activeCanvas);
                // Create the tool canvas - this is where the tools (like eraser) are drawn while they are being used
                let toolCanvas = document.createElement('canvas');
                toolCanvas.className = 'tool-canvas';
                toolCanvas.width = clientRect.width;
                toolCanvas.height = clientRect.height;
                toolCanvas.addEventListener('mousedown', this.touchFunction);
                toolCanvas.addEventListener('touchstart', this.touchFunction);
                toolCanvas.addEventListener('mousemove', this.dragFunction);
                toolCanvas.addEventListener('touchmove', this.dragFunction);
                toolCanvas.addEventListener('mouseup', this.releaseFunction);
                toolCanvas.addEventListener('touchend', this.releaseFunction);
                canvasDiv.appendChild(toolCanvas);
                // Create the undo canvas - this is the canvas things are drawn to first, so we can provide an undo method
                let undoCanvas = document.createElement('canvas');
                undoCanvas.className = 'undo-canvas';
                undoCanvas.width = clientRect.width;
                undoCanvas.height = clientRect.height
                canvasDiv.appendChild(undoCanvas);
                this.$root.paint.canvas.toolElement = toolCanvas;
                this.$root.paint.canvas.toolContext = toolCanvas.getContext('2d');
                this.$root.paint.canvas.toolContext.lineCap = 'round'; // Set the default upon context creation
                this.$root.paint.canvas.activeElement = activeCanvas;
                this.$root.paint.canvas.activeContext = activeCanvas.getContext('2d');
                this.$root.paint.canvas.activeContext.lineCap = 'round'; // Set the default upon context creation
                this.$root.paint.canvas.drawElement = drawCanvas;
                this.$root.paint.canvas.drawContext = drawCanvas.getContext('2d');
                this.$root.paint.canvas.drawContext.lineCap = 'round'; // Set the default upon context creation
                this.$root.paint.canvas.undoElement = undoCanvas;
                this.$root.paint.canvas.undoContext = undoCanvas.getContext('2d');
                this.$root.paint.canvas.undoContext.lineCap = 'round'; // Set the default upon context creation
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