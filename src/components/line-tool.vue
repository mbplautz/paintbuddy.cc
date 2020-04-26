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
                let canvas = this.$root.paint.canvas.activeElement;
                let bounds = canvas.getBoundingClientRect();
                if (e.type === 'mousedown') {
                    this.mouse.initialX = e.clientX - bounds.left;
                    this.mouse.initialY = e.clientY - bounds.top;
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
                let canvas = this.$root.paint.canvas.activeElement;
                let bounds = canvas.getBoundingClientRect();
                if (e.type === 'mousemove') {
                    let currentX = e.clientX - bounds.left;
                    let currentY = e.clientY - bounds.top;
                    let context = this.$root.paint.canvas.activeContext;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.beginPath();
                    context.moveTo(this.mouse.initialX, this.mouse.initialY);
                    context.lineTo(currentX, currentY);
                    context.stroke();
                }
            },
            releaseFunction(e) {
                let canvas = this.$root.paint.canvas.activeElement;
                let bounds = canvas.getBoundingClientRect();
                if (e.type === 'mouseup') {
                    let finalX = e.clientX - bounds.left;
                    let finalY = e.clientY - bounds.top;
                    let context = this.$root.paint.canvas.activeContext;
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