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
                    lastY: 0
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
                this.$root.paint.state.save();
                let canvas = this.$root.paint.canvas.drawElement;
                let bounds = canvas.getBoundingClientRect();
                if (e.type === 'mousedown') {
                    let context = this.$root.paint.canvas.drawContext;
                    context.lineWidth = this.$root.paint.options.lineWidth * 2;
                    context.strokeStyle = backgroundColor;
                    let x = e.clientX - bounds.left;
                    let y = e.clientY - bounds.top;
                    context.beginPath();
                    context.moveTo(x, y);
                    context.lineTo(x, y);
                    context.stroke();
                    this.mouse.lastX = x;
                    this.mouse.lastY = y;
                    this.drawTool(x, y);
                }
                else if (e.type === 'touchstart') {
                    this.touch = {};
                    let context = this.$root.paint.canvas.drawContext;
                    context.lineWidth = this.$root.paint.options.lineWidth * 2;
                    context.strokeStyle = backgroundColor;
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
                        this.drawTool(coordinate.x, coordinate.y, index === 0); // Only clear the active canvas on the first go round
                    });
                }
            },
            dragFunction(e) {
                let canvas = this.$root.paint.canvas.drawElement;
                let bounds = canvas.getBoundingClientRect();
                if (e.type === 'mousemove') {
                    let x = e.clientX - bounds.left;
                    let y = e.clientY - bounds.top;
                    let context = this.$root.paint.canvas.drawContext;
                    context.moveTo(this.mouse.lastX, this.mouse.lastY);
                    context.lineTo(x, y);
                    context.stroke();
                    this.mouse.lastX = x;
                    this.mouse.lastY = y;
                    this.drawTool(x, y);
                }
                else if (e.type === 'touchmove') {
                    let context = this.$root.paint.canvas.drawContext;
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
                        this.drawTool(coordinate.x, coordinate.y, index === 0); // Only clear the active canvas on the first go round
                    });
                }
            },
            releaseFunction(e) {
                let canvas = this.$root.paint.canvas.activeElement;
                let context = this.$root.paint.canvas.activeContext;
                context.clearRect(0, 0, canvas.width, canvas.height);
                // Restore drawing canvas' color and line width
                context = this.$root.paint.canvas.drawContext;
                context.strokeStyle = this.$root.paint.options.color;
                context.lineWidth = this.$root.paint.options.lineWidth;
            },
            drawTool(x, y, clear = true) {
                let canvas = this.$root.paint.canvas.activeElement;
                let context = this.$root.paint.canvas.activeContext;
                let options = this.$root.paint.options;
                if (clear) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                }
                context.fillStyle = backgroundColor;
                context.beginPath();
                context.ellipse(x, y, options.lineWidth, options.lineWidth, 0, 0, Math.PI * 2);
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = edgeColor;
                context.beginPath();
                context.ellipse(x, y, options.lineWidth, options.lineWidth, 0, 0, Math.PI * 2);
                context.stroke();
                // TODO: Decide if I want to set the stroke at the beginning of each tool or upon selection
                // UPDATE: Upon selection seems sufficient - this allows me to better take advantage of Vue binding 
                context.strokeStyle = options.color;
                context.fillStyle = options.color;
                context.lineWidth = options.lineWidth;
            }
        }
    }
</script>