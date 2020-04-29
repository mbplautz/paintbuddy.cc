<script>
    import EditTool from './edit-tool.vue';

    const backgroundColor = '#ffffff';
    const edgeColor = '#000000';

    export default {
        props: {
            buttonGroup: {
                type: String,
                default() {
                    return '';
                }
            }
        },
        data() {
            return {
                name: 'eraser',
                icon: 'fas fa-eraser',
                mouse: {
                    lastX: 0,
                    lastY: 0,
                    imageData: null
                },
                touch: {}
            }
        },
        extends: EditTool,
        methods: {
            select() {
                console.log('Eraser Tool clicked');
            },
            touchFunction(e) {
                // TODO: Add the tool canvas, and get rid of this unreliable implementation for using the same canvas for erasing and drawing the tool
                let canvas = this.$root.paint.canvas.activeElement;
                let bounds = canvas.getBoundingClientRect();
                let context = this.$root.paint.canvas.activeContext;
                let options = this.$root.paint.options;
                let eraserLineWidth = this.getEraserLineWidth(options);
                context.lineWidth = eraserLineWidth;
                context.strokeStyle = backgroundColor;
                if (e.type === 'mousedown') {
                    let x = e.clientX - bounds.left;
                    let y = e.clientY - bounds.top;
                    context.beginPath();
                    context.moveTo(x, y);
                    context.lineTo(x, y);
                    context.stroke();
                    this.mouse.lastX = x;
                    this.mouse.lastY = y;
                    this.mouse.imageData = context.getImageData(x - eraserLineWidth, y - eraserLineWidth, eraserLineWidth * 2, eraserLineWidth * 2);
                    this.drawTool(x, y, context, options);
                }
                else if (e.type === 'touchstart') {
                    this.touch = {};
                    Array.prototype.forEach.call(e.touches, (touch, index) => {
                        let coordinate = {
                            x: touch.clientX - bounds.left,
                            y: touch.clientY - bounds.top,
                        };
                        context.beginPath();
                        context.moveTo(coordinate.x, coordinate.y);
                        context.lineTo(coordinate.x, coordinate.y);
                        context.stroke();
                        this.touch[touch.identifier] = coordinate;
                        coordinate.imageData = context.getImageData(coordinate.x - eraserLineWidth, coordinate.y - eraserLineWidth, eraserLineWidth * 2, eraserLineWidth * 2);
                        this.drawTool(coordinate.x, coordinate.y, context, options);
                    });
                }
            },
            dragFunction(e) {
                let canvas = this.$root.paint.canvas.activeElement;
                let bounds = canvas.getBoundingClientRect();
                let context = this.$root.paint.canvas.activeContext;
                let options = this.$root.paint.options;
                let eraserLineWidth = this.getEraserLineWidth(options);
                if (e.type === 'mousemove') {
                    let x = e.clientX - bounds.left;
                    let y = e.clientY - bounds.top;
                    context.putImageData(this.mouse.imageData, this.mouse.lastX - eraserLineWidth, this.mouse.lastY - eraserLineWidth);
                    context.beginPath();
                    context.moveTo(this.mouse.lastX, this.mouse.lastY);
                    context.lineTo(x, y);
                    context.stroke();
                    this.mouse.lastX = x;
                    this.mouse.lastY = y;
                    this.mouse.imageData = context.getImageData(x - eraserLineWidth, y - eraserLineWidth, eraserLineWidth * 2, eraserLineWidth * 2);
                    this.drawTool(x, y, context, options);
                }
                else if (e.type === 'touchmove') {
                    Array.prototype.forEach.call(e.touches, (touch, index) => {
                        let lastCoordinate = this.touch[touch.identifier];
                        let coordinate = {
                            x: touch.clientX - bounds.left,
                            y: touch.clientY - bounds.top
                        };
                        if (lastCoordinate) {
                            context.putImageData(lastCoordinate.imageData, lastCoordinate.x - eraserLineWidth, lastCoordinate.y - eraserLineWidth);
                        }
                        context.beginPath();
                        if (lastCoordinate) {
                            context.moveTo(lastCoordinate.x, lastCoordinate.y);
                        }
                        else {
                            context.moveTo(coordinate.x, coordinate.y);
                        }
                        context.lineTo(coordinate.x, coordinate.y);
                        context.stroke();
                        this.touch[touch.identifier] = coordinate;
                        coordinate.imageData = context.getImageData(coordinate.x - eraserLineWidth, coordinate.y - eraserLineWidth, eraserLineWidth * 2, eraserLineWidth * 2);
                        this.drawTool(coordinate.x, coordinate.y, context, options);
                    });
                }
            },
            releaseFunction(e) {
                let canvas = this.$root.paint.canvas.activeElement;
                let context = this.$root.paint.canvas.activeContext;
                let options = this.$root.paint.options;
                let eraserLineWidth = this.getEraserLineWidth(options);
                if (e.type === 'mouseup') {
                    context.putImageData(this.mouse.imageData, this.mouse.lastX - eraserLineWidth, this.mouse.lastY - eraserLineWidth);
                }
                else if (e.type === 'touchend') {
                    Object.keys(this.touch).forEach(identifier => {
                        let coordinate = this.touch[identifier];
                        context.putImageData(coordinate.imageData, coordinate.x - eraserLineWidth, coordinate.y - eraserLineWidth);
                    });
                }
                let undoContext = this.$root.paint.canvas.undoContext;
                let undoCanvas = this.$root.paint.canvas.undoElement;
                undoContext.clearRect(0, 0, undoElement.width, undoElement.height);
                undoContext.drawImage(canvas, 0, 0);
                this.commitDrawing();
                context.clearRect(0, 0, canvas.width, canvas.height);
                // Restore active canvas' color and line width
                context = this.$root.paint.canvas.activeContext;
                context.strokeStyle = this.$root.paint.options.color;
                context.lineWidth = this.$root.paint.options.lineWidth;
                context.fillStyle = this.$root.paint.options.color;
            },
            drawTool(x, y, context, options) {
                context.fillStyle = backgroundColor;
                context.beginPath();
                context.ellipse(x, y, options.lineWidth, options.lineWidth, 0, 0, Math.PI * 2);
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = edgeColor;
                context.beginPath();
                context.ellipse(x, y, options.lineWidth, options.lineWidth, 0, 0, Math.PI * 2);
                context.stroke();
                context.strokeStyle = backgroundColor;
                context.lineWidth = this.getEraserLineWidth(options);
            },
            getEraserLineWidth(options) {
                return options.lineWidth * 2;
            }
        }
    }
</script>