<script>
    const saveSelectionSemaphore = 'save-selection';

    export default {
        data() {
            return {
                filename: '',
                selectionArea: {}
            }
        },
        mounted() {
            this.$root.$on('selection-cleared', semaphore => {
                if (semaphore === this.getSaveSelectionSemaphore()) {
                    this.saveContinued(true);
                }
            });
        },
        methods: {
            save(filename, selection) {
                this.filename = filename || 'drawing.png';
                // If we are saving a selection, we need to clear the selection first (commit it to the drawing)
                // and then save
                if (selection && this.$root.paint.state.selection) {
                    this.selectionArea.x = this.$root.paint.state.selection.x;
                    this.selectionArea.y = this.$root.paint.state.selection.y;
                    this.selectionArea.width = this.$root.paint.state.selection.width;
                    this.selectionArea.height = this.$root.paint.state.selection.height;
                    this.$root.$emit('clear-selection', this.getSaveSelectionSemaphore());
                }
                else {
                    this.saveContinued(false);
                }
            },
            saveContinued(selection) {
                // The strategy here is to write either what's in the window or what's selected to the
                // undo canvas, then resize the undo canvas and export it at the desired size (since the
                // canvas.toDataURL method does not accept size as an option).
                let canvasDiv = document.querySelector('div.canvas');
                let bounds = canvasDiv.getBoundingClientRect();
                let drawContext = this.$root.paint.canvas.drawContext;
                let imageData;
                let undoCanvas = this.$root.paint.canvas.undoElement;
                let undoContext = this.$root.paint.canvas.undoContext;
                let restoreWidth = undoCanvas.width;
                let restoreHeight = undoCanvas.height;
                let width, height;
                let dataURL, anchor;
                
                if (selection) {
                    imageData = drawContext.getImageData(
                        this.selectionArea.x,
                        this.selectionArea.y,
                        this.selectionArea.width,
                        this.selectionArea.height,
                    );
                    width = this.selectionArea.width;
                    height = this.selectionArea.height;
                }
                else {
                    imageData = drawContext.getImageData(0, 0, bounds.width, bounds.height);
                    width = bounds.width;
                    height = bounds.height;
                }

                undoCanvas.width = width;
                undoCanvas.height = height;
                undoContext.putImageData(imageData, 0, 0);

                dataURL = undoCanvas.toDataURL();
                anchor = document.createElement('a');
                anchor.href = dataURL;
                anchor.download = this.filename;
                // Initiate the browser download of the file
                anchor.click();
                this.$root.paint.state.dirtySave = false;

                // Restore the undo canvas
                undoCanvas.width = restoreWidth;
                undoCanvas.height = restoreHeight;
                undoContext.stokeStyle = this.$root.paint.options.color;
                undoContext.fillStyle = this.$root.paint.options.color;
                undoContext.lineWidth = this.$root.paint.options.lineWidth;
                undoContext.lineCap = 'round';

                // If there was a selection, restore it
                if (selection) {
                    this.$root.paint.state.selection = {
                        x: this.selectionArea.x,
                        y: this.selectionArea.y,
                        width: this.selectionArea.width,
                        height: this.selectionArea.height
                    };
                    // We need to use a no-op transform (a => a) to ensure the selection border reappears
                    this.$root.$emit('update-selection', a => a);
                }
            },
            getSaveSelectionSemaphore() {
                return `${saveSelectionSemaphore}-${this.name}`;
            }
        }
    };
</script>