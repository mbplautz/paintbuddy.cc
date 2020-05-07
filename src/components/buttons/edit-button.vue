<script>
    import ToolbarButton from '../buttons/toolbar-button.vue';
    import UndoCalc from '../../mixins/undo-calc.vue';

    export default {
        data() {
            return {
                icon: '',
                selected: false
            }
        },
        extends: ToolbarButton,
        mixins: [UndoCalc],
        mounted() {
            this.$root.$on('deselect', this.deselect);
            this.$root.paint.tool[`${this.name}Select`] = this.click;
        },
        methods: {
            click() {
                if (this.isEnabled()) {
                    this.$root.$emit('deselect', this.buttonGroup)
                    this.selected = true;
                    this.$root.paint.state.setTouchFunctions(
                        this.touchFunction,
                        this.dragFunction,
                        this.releaseFunction
                    );
                    this.select();
                }
            },
            deselect(buttonGroup) {
                if (buttonGroup === this.buttonGroup) {
                     this.selected = false;
                     console.log(`${this.name} has been deselected`);
                    if (this.childDeselect) {
                        this.childDeselect();
                    }
                }
            },
            clearUndoCanvas() {
                let canvas = this.$root.paint.canvas.undoElement;
                let context = this.$root.paint.canvas.undoContext;
                context.clearRect(0, 0, canvas.width, canvas.height);
            },
            commitDrawing() {
                let canvas = this.$root.paint.canvas.drawElement;
                let drawData = this.$root.paint.canvas.drawContext.getImageData(0, 0, canvas.width, canvas.height);
                let undoData = this.$root.paint.canvas.undoContext.getImageData(0, 0, canvas.width, canvas.height);
                let undoMap = {};
                let drawDataBinary = drawData.data;
                let undoDataBinary = undoData.data;
                let upperBounds = drawDataBinary.length;
                let offset;
                let r, g, b, a, val;
                for (offset = 0; offset < upperBounds; offset += 4) {
                    r = undoDataBinary[offset];
                    g = undoDataBinary[offset + 1];
                    b = undoDataBinary[offset + 2];
                    a = undoDataBinary[offset + 3];
                    // Determine if there is a pixel drawn at this location
                    if (r || g || b || a) {
                        // If so, save it to the map
                        r = drawDataBinary[offset];
                        g = drawDataBinary[offset + 1];
                        b = drawDataBinary[offset + 2];
                        a = drawDataBinary[offset + 3];
                        val = a | (b << 8) | (g << 16) | (r << 24);
                        if (!undoMap[val]) {
                            undoMap[val] = [];
                        }
                        undoMap[val].push(offset);
                    }
                }
                // Try to compress the undo map using ranges where they are found
                let compressedUndoMap = this.compressUndoMap(undoMap);
                this.$root.paint.state.saveUndoMap(compressedUndoMap);
                canvas = this.$root.paint.canvas.undoElement;
                this.$root.paint.canvas.drawContext.drawImage(canvas, 0, 0);
            }
        }
    };
</script>