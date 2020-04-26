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
                name: 'Brush',
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
                if (e.type === 'mousedown') {
                    let context = this.$root.paint.canvas.drawContext;
                    // The next two lines are temporary -- until the initial and user color selection is implemented
                    context.lineWidth = this.$root.paint.options.lineWidth;
                    context.strokeStyle = this.$root.paint.options.color;
                    context.beginPath();
                    context.moveTo(e.offsetX, e.offsetY);
                    context.lineTo(e.offsetX, e.offsetY);
                    context.stroke();
                    this.mouse.lastX = e.offsetX;
                    this.mouse.lastY = e.offsetY;
                }
                else if (e.type === 'touchstart') {
                    this.touch = {};
                    let canvas = this.$root.paint.canvas.drawElement;
                    let bounds = canvas.getBoundingClientRect();
                    let context = this.$root.paint.canvas.drawContext;
                    // The next two lines are temporary -- until the initial and user color selection is implemented
                    context.lineWidth = this.$root.paint.options.lineWidth;
                    context.strokeStyle = this.$root.paint.options.color;
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
                if (e.type === 'mousemove') {
                    let context = this.$root.paint.canvas.drawContext;
                    context.moveTo(this.mouse.lastX, this.mouse.lastY);
                    context.lineTo(e.offsetX, e.offsetY);
                    context.stroke();
                    this.mouse.lastX = e.offsetX;
                    this.mouse.lastY = e.offsetY;
                }
                else if (e.type === 'touchmove') {
                    let canvas = this.$root.paint.canvas.drawElement;
                    let bounds = canvas.getBoundingClientRect();
                    let context = this.$root.paint.canvas.drawContext;
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
            }
        }
    }
</script>