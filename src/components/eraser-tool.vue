<script>
    import EditTool from './edit-tool.vue';

    const backgroundColor = '#ffffff';
    const edgeColor = '#000000';

    const eraserToolContextRestoreDelay = 500;

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
                    lastY: 0
                },
                touch: {},
                contextRestoreTimeoutArray: []
            }
        },
        extends: EditTool,
        methods: {
            select() {
                console.log('Eraser Tool clicked');
            },
            touchFunction(e) {
                this.contextRestoreTimeoutArray.forEach(timeout => clearTimeout(timeout));
                this.contextRestoreTimeoutArray.length = 0;
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
                    this.drawTool(x, y, eraserLineWidth);
                }
                else if (e.type === 'touchstart') {
                    this.touch = {};
                    Array.prototype.forEach.call(e.touches, (touch, index) => {
                        let coordinate = {
                            x: touch.clientX - bounds.left,
                            y: touch.clientY - bounds.top
                        };
                        context.beginPath();
                        context.moveTo(coordinate.x, coordinate.y);
                        context.lineTo(coordinate.x, coordinate.y);
                        context.stroke();
                        this.touch[touch.identifier] = coordinate;
                        this.drawTool(coordinate.x, coordinate.y, eraserLineWidth, index === 0); // Only clear the active canvas on the first go round
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
                    context.moveTo(this.mouse.lastX, this.mouse.lastY);
                    context.lineTo(x, y);
                    context.stroke();
                    this.mouse.lastX = x;
                    this.mouse.lastY = y;
                    this.drawTool(x, y, eraserLineWidth);
                }
                else if (e.type === 'touchmove') {
                    Array.prototype.forEach.call(e.touches, (touch, index) => {
                        let coordinate = {
                            x: touch.clientX - bounds.left,
                            y: touch.clientY - bounds.top
                        };
                        context.beginPath();
                        context.moveTo(this.touch[touch.identifier].x, this.touch[touch.identifier].y);
                        context.lineTo(coordinate.x, coordinate.y);
                        context.stroke();
                        this.touch[touch.identifier] = coordinate;
                        this.drawTool(coordinate.x, coordinate.y, eraserLineWidth, index === 0); // Only clear the active canvas on the first go round
                    });
                }
            },
            releaseFunction(e) {
                // For the brush tool, copy what was on the active canvas to the undo canvas
                let canvas = this.$root.paint.canvas.activeElement;
                let activeContext = this.$root.paint.canvas.activeContext;
                let undoContext = this.$root.paint.canvas.undoContext;
                let toolContext = this.$root.paint.canvas.toolContext;
                undoContext.clearRect(0, 0, canvas.width, canvas.height); // Make sure the undo canvas is clean first
                undoContext.drawImage(canvas, 0, 0); // Now draw to the undo canvas - use drawImage instead of putImageData to preserve opacity
                activeContext.clearRect(0, 0, canvas.width, canvas.height); // Don't forget to clean up the active canvas
                toolContext.clearRect(0, 0, canvas.width, canvas.height); // Erase any trace of the tool
                this.commitDrawing();

                // Wait to restore contextso we don't create a race condition
                this.contextRestoreTimeoutArray.push(setTimeout(() => {
                    // Restore drawing canvas' color and line width
                    activeContext = this.$root.paint.canvas.activeContext;
                    activeContext.strokeStyle = this.$root.paint.options.color;
                    activeContext.lineWidth = this.$root.paint.options.lineWidth;
                }, eraserToolContextRestoreDelay));

            },
            drawTool(x, y, lineWidth, clear = true) {
                let canvas = this.$root.paint.canvas.toolElement;
                let context = this.$root.paint.canvas.toolContext;
                let options = this.$root.paint.options;
                if (clear) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                }
                lineWidth = lineWidth / 2;
                context.fillStyle = backgroundColor;
                context.beginPath();
                context.ellipse(x, y, lineWidth, lineWidth, 0, 0, Math.PI * 2);
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = edgeColor;
                context.beginPath();
                context.ellipse(x, y, lineWidth, lineWidth, 0, 0, Math.PI * 2);
                context.stroke();
            },
            getEraserLineWidth(options) {
                return options.lineWidth * 3;
            }
        }
    }
</script>