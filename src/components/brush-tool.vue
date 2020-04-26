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
                lastX: 0,
                lastY: 0
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
                    context.lineWidth = this.$root.paint.options.lineWidth;
                    context.strokeStyle = this.$root.paint.options.color;
                    context.beginPath();
                    context.moveTo(e.offsetX, e.offsetY);
                    context.lineTo(e.offsetX, e.offsetY);
                    context.stroke();
                    this.lastX = e.offsetX;
                    this.lastY = e.offsetY;
                }
            },
            dragFunction(e) {
                console.log(e);
                if (e.type === 'mousemove') {
                    let context = this.$root.paint.canvas.drawContext;
                    context.moveTo(this.lastX, this.lastY);
                    context.lineTo(e.offsetX, e.offsetY);
                    context.stroke();
                    this.lastX = e.offsetX;
                    this.lastY = e.offsetY;
                }
            },
            releaseFunction(e) {
                console.log(e);
            }
        }
    }
</script>