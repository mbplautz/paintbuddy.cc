<template>
    <div class="canvas">
        <div class="canvas-child">
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
                let drawCanvas = document.createElement('canvas');
                drawCanvas.className = 'draw-canvas';
                drawCanvas.width = clientRect.width;
                drawCanvas.height = clientRect.height;
                canvasDiv.appendChild(drawCanvas);
                let activeCanvas = document.createElement('canvas');
                activeCanvas.className = 'active-canvas';
                activeCanvas.width = clientRect.width;
                activeCanvas.height = clientRect.height;
                activeCanvas.addEventListener('mousedown', this.touchFunction);
                activeCanvas.addEventListener('touchstart', this.touchFunction);
                activeCanvas.addEventListener('mousemove', this.dragFunction);
                activeCanvas.addEventListener('touchmove', this.dragFunction);
                activeCanvas.addEventListener('mouseup', this.releaseFunction);
                activeCanvas.addEventListener('touchend', this.releaseFunction);
                canvasDiv.appendChild(activeCanvas);
                this.$root.paint.canvas.activeElement = activeCanvas;
                this.$root.paint.canvas.activeContext = activeCanvas.getContext('2d');
                this.$root.paint.canvas.drawElement = drawCanvas;
                this.$root.paint.canvas.drawContext = drawCanvas.getContext('2d');
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

    canvas.active-canvas {
        z-index: 1;
    }

    canvas.draw-canvas {
        z-index: 0
    }
</style>