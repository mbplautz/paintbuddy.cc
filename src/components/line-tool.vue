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
                name: 'Line',
                icon: 'fas fa-slash',
                mouse: {
                    initialX: 0,
                    initialY: 0
                }
            }
        },
        extends: EditTool,
        methods: {
            select() {
                console.log('Line Tool clicked');
            },
            touchFunction(e) {
                if (e.type === 'mousedown') {
                    this.mouse.initialX = e.offsetX;
                    this.mouse.initialY = e.offsetY;
                    let context = this.$root.paint.canvas.activeContext;
                    let canvas = this.$root.paint.canvas.activeElement;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    // The next two lines are temporary -- until the initial and user color selection is implemented
                    context.lineWidth = this.$root.paint.options.lineWidth;
                    context.strokeStyle = this.$root.paint.options.color;
                    context.beginPath();
                    context.moveTo(this.mouse.initialX, this.mouse.initialY);
                    context.lineTo(this.mouse.initialX, this.mouse.initialY);
                    context.stroke();
                }
            },
            dragFunction(e) {
                if (e.type === 'mousemove') {
                    let currentX = e.offsetX;
                    let currentY = e.offsetY;
                    let context = this.$root.paint.canvas.activeContext;
                    let canvas = this.$root.paint.canvas.activeElement;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.beginPath();
                    context.moveTo(this.mouse.initialX, this.mouse.initialY);
                    context.lineTo(currentX, currentY);
                    context.stroke();
                }
            },
            releaseFunction(e) {
                if (e.type === 'mouseup') {
                    let finalX = e.offsetX;
                    let finalY = e.offsetY;
                    let context = this.$root.paint.canvas.activeContext;
                    let canvas = this.$root.paint.canvas.activeElement;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context = this.$root.paint.canvas.drawContext;
                    canvas = this.$root.paint.canvas.drawElement;
                    context.beginPath();
                    context.moveTo(this.mouse.initialX, this.mouse.initialY);
                    context.lineTo(finalX, finalY);
                    context.stroke();
                }
            }
        }
    }
</script>