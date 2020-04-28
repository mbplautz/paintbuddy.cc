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
                },
                touch: {
                    initialX: 0,
                    initialY: 0,
                    finalX: 0,
                    finalY: 0
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
                let x, y;
                if (e.type === 'mousedown') {
                    this.mouse.initialX = e.clientX - bounds.left;
                    this.mouse.initialY = e.clientY - bounds.top;
                    x = this.mouse.initialX;
                    y = this.mouse.initialY;
                }
                else if (e.type === 'touchstart') {
                    // For the line tool, we only use the first touch if there are multiple touches
                    this.touch.initialX = e.touches[0].clientX - bounds.left;
                    this.touch.initialY = e.touches[0].clientY - bounds.top;
                    x = this.touch.initialX;
                    y = this.touch.initialY;
                }
                let context = this.$root.paint.canvas.activeContext;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(x, y);
                context.stroke();
            },
            dragFunction(e) {
                let canvas = this.$root.paint.canvas.activeElement;
                let bounds = canvas.getBoundingClientRect();
                let initialX, initialY, currentX, currentY;
                if (e.type === 'mousemove') {
                    initialX = this.mouse.initialX;
                    initialY = this.mouse.initialY;
                    currentX = e.clientX - bounds.left;
                    currentY = e.clientY - bounds.top;
                }
                else if (e.type === 'touchmove') {
                    initialX = this.touch.initialX;
                    initialY = this.touch.initialY;
                    currentX = e.touches[0].clientX - bounds.left;
                    currentY = e.touches[0].clientY - bounds.top;
                    this.touch.finalX = currentX;
                    this.touch.finalY = currentY;
                }
                let context = this.$root.paint.canvas.activeContext;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
                context.moveTo(initialX, initialY);
                context.lineTo(currentX, currentY);
                context.stroke();
            },
            releaseFunction(e) {
                let canvas = this.$root.paint.canvas.activeElement;
                let initialX, initialY, finalX, finalY;
                if (e.type === 'mouseup') {
                    let bounds = canvas.getBoundingClientRect();
                    initialX = this.mouse.initialX;
                    initialY = this.mouse.initialY;
                    finalX = e.clientX - bounds.left;
                    finalY = e.clientY - bounds.top;
                }
                else if (e.type === 'touchend') {
                    initialX = this.touch.initialX;
                    initialY = this.touch.initialY;
                    finalX = this.touch.finalX;
                    finalY = this.touch.finalY;
                }
                let context = this.$root.paint.canvas.activeContext;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context = this.$root.paint.canvas.drawContext;
                canvas = this.$root.paint.canvas.drawElement;
                context.beginPath();
                context.moveTo(initialX, initialY);
                context.lineTo(finalX, finalY);
                context.stroke();
            }
        }
    }
</script>

<style>
    i.fas {
        font-size: 80%;
    }
</style>