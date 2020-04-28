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
                name: 'Ellipse',
                icon: 'far fa-circle',
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
                console.log('Ellipse Tool clicked');
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
                context.ellipse(x, y, 1, 1, 0, 0, Math.PI * 2);
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
                let radiusX = (currentX - initialX) / 2;
                let radiusY = (currentY - initialY) / 2;
                let x = initialX + radiusX;
                let y = initialY + radiusY;
                // Radii cannot be negative, so I have to flip them if they are
                if (radiusX < 0) {
                    radiusX = -radiusX;
                    x = currentX + radiusX;
                }
                if (radiusY < 0) {
                    radiusY = -radiusY;
                    y = currentY + radiusY;
                }
                context.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
                if (this.$root.paint.options.filledPolygon) {
                    context.fill();
                }
                else {
                    context.stroke();
                }
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
                let radiusX = (finalX - initialX) / 2;
                let radiusY = (finalY - initialY) / 2;
                let x = initialX + radiusX;
                let y = initialY + radiusY;
                if (radiusX < 0) {
                    radiusX = -radiusX;
                    x = finalX + radiusX;
                }
                if (radiusY < 0) {
                    radiusY = -radiusY;
                    y = finalY + radiusY;
                }
                context.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
                if (this.$root.paint.options.filledPolygon) {
                    context.fill();
                }
                else {
                    context.stroke();
                }
            }
        }
    }
</script>