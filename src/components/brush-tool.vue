<script>
import EditTool from './edit-tool.vue';

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
                name: 'brush',
                icon: 'fas fa-paint-brush',
                mouse: {
                    lastX: 0,
                    lastY: 0
                },
                touch: {}
            }
        },
        extends: EditTool,
        methods: {
            select() {
                console.log('Brush Tool clicked');
            },
            touchFunction(e) {
                console.log(e);
                let canvas = this.$root.paint.canvas.activeElement;
                let bounds = canvas.getBoundingClientRect();
                if (e.type === 'mousedown') {
                    let context = this.$root.paint.canvas.activeContext;
                   let x = e.clientX - bounds.left;
                    let y = e.clientY - bounds.top;
                    context.beginPath();
                    context.moveTo(x, y);
                    context.lineTo(x, y);
                    context.stroke();
                    this.mouse.lastX = x;
                    this.mouse.lastY = y;
                }
                else if (e.type === 'touchstart') {
                    this.touch = {};
                    let context = this.$root.paint.canvas.activeContext;
                    Array.prototype.forEach.call(e.touches, touch => {
                        let coordinate = {
                            x: touch.clientX - bounds.left,
                            y: touch.clientY - bounds.top
                        };
                        context.beginPath();
                        context.moveTo(coordinate.x, coordinate.y);
                        context.lineTo(coordinate.x, coordinate.y);
                        context.stroke();
                        this.touch[touch.identifier] = coordinate;
                    });
                }
            },
            dragFunction(e) {
                console.log(e);
                let canvas = this.$root.paint.canvas.activeElement;
                let bounds = canvas.getBoundingClientRect();
                if (e.type === 'mousemove') {
                    let x = e.clientX - bounds.left;
                    let y = e.clientY - bounds.top;
                    let context = this.$root.paint.canvas.activeContext;
                    context.moveTo(this.mouse.lastX, this.mouse.lastY);
                    context.lineTo(x, y);
                    context.stroke();
                    this.mouse.lastX = x;
                    this.mouse.lastY = y;
                }
                else if (e.type === 'touchmove') {
                    let context = this.$root.paint.canvas.activeContext;
                    Array.prototype.forEach.call(e.touches, touch => {
                        let coordinate = {
                            x: touch.clientX - bounds.left,
                            y: touch.clientY - bounds.top
                        };
                        context.beginPath();
                        context.moveTo(this.touch[touch.identifier].x, this.touch[touch.identifier].y);
                        context.lineTo(coordinate.x, coordinate.y);
                        context.stroke();
                        this.touch[touch.identifier] = coordinate;
                    });
                }
            },
            releaseFunction(e) {
                console.log(e);
                // For the brush tool, copy what was on the active canvas to the undo canvas
                let canvas = this.$root.paint.canvas.activeElement;
                let activeContext = this.$root.paint.canvas.activeContext;
                let undoContext = this.$root.paint.canvas.undoContext;
                undoContext.clearRect(0, 0, canvas.width, canvas.height); // Make sure the undo canvas is clean first
                undoContext.drawImage(canvas, 0, 0); // Now draw to the undo canvas
                activeContext.clearRect(0, 0, canvas.width, canvas.height); // Don't forget to clean up the active canvas
                this.commitDrawing();
            }
        }
    }
</script>