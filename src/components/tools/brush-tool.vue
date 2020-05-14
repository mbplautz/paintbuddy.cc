<script>
import EditButton from '../buttons/edit-button.vue';

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
                    lastY: 0,
                    moved: false
                },
                touch: {},
            }
        },
        extends: EditButton,
        methods: {
            select() {
                console.debug('Brush Tool clicked');
            },
            touchFunction(e) {
                console.debug(e);
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
                    this.mouse.moved = false;
                }
                else if (e.type === 'touchstart') {
                    this.touch = {};
                    let context = this.$root.paint.canvas.activeContext;
                    Array.prototype.forEach.call(e.touches, touch => {
                        let coordinate = {
                            x: touch.clientX - bounds.left,
                            y: touch.clientY - bounds.top,
                            moved: false
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
                console.debug(e);
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
                    this.mouse.moved = true;
                }
                else if (e.type === 'touchmove') {
                    let context = this.$root.paint.canvas.activeContext;
                    Array.prototype.forEach.call(e.touches, touch => {
                        let coordinate = {
                            x: touch.clientX - bounds.left,
                            y: touch.clientY - bounds.top,
                            moved: true
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
                console.debug(e);
                // Check to see if the brush was a touch and a release with no drag
                // If so, moveTo/lineTo won't draw a dot in the same position, so we'll just draw a circle
                if (e.type === 'mouseup') {
                    let context = this.$root.paint.canvas.activeContext;
                    if (!this.mouse.moved) {
                        context.beginPath();
                        context.ellipse(this.mouse.lastX, this.mouse.lastY, this.$root.paint.options.lineWidth / 2, this.$root.paint.options.lineWidth / 2, 0, 0, Math.PI * 2);
                        context.fill();
                    }
                }
                else if (e.type === 'touchend') {
                    let context = this.$root.paint.canvas.activeContext;
                    Array.prototype.forEach.call(e.changedTouches, touch => {
                        let coordinate = this.touch[touch.identifier];
                        if (coordinate && !coordinate.moved) {
                            context.beginPath();
                            context.ellipse(coordinate.x, coordinate.y, this.$root.paint.options.lineWidth / 2, this.$root.paint.options.lineWidth / 2, 0, 0, Math.PI * 2);
                            context.fill();
                        }
                    });
                }
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