<script>
    import ToolbarButton from './toolbar-button.vue';

    export default {
        data() {
            return {
                icon: '',
                selected: false
            }
        },
        extends: ToolbarButton,
        mounted() {
            this.$root.$on('deselect', this.deselect);
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
                let compressedUndoMap = {};
                let keyIndex, key, calcOffset, lowerOffset = null, lastOffset = null, index, array, compressedArray;
                let undoMapKeys = Object.keys(undoMap);
                for (keyIndex in undoMapKeys) {
                    key = undoMapKeys[keyIndex];
                    compressedArray = [];
                    compressedUndoMap[key] = compressedArray;
                    array = undoMap[key];
                    for (index = 0; index < array.length; index++) {
                        offset = array[index];
                        if (offset === calcOffset) { // A range is found
                            if (lowerOffset === null) { // If this is the start of the range ...
                                lowerOffset = lastOffset; // ... then mark the start
                            }
                        }
                        else { // Not the continuation of a range
                            if (lowerOffset !== null) { // If we just finished iterating through a range ...
                                compressedArray.push([lowerOffset, lastOffset]); // ... then add the range
                                lowerOffset = null;
                            }
                            else {
                                compressedArray.push(lastOffset); // Otherwise just add the last offset
                            }
                        }
                        lastOffset = offset;
                        calcOffset = offset + 4;
                    }
                    // Now we have to check the very last point
                    if (lowerOffset !== null) { // If we were already in a range ...
                        compressedArray.push([lowerOffset, offset]); // ... close it up
                    }
                    else {
                        compressedArray.push(offset); // Otherwise just add the single value
                    }
                };
                this.$root.paint.state.saveUndoMap(compressedUndoMap);
                canvas = this.$root.paint.canvas.undoElement;
                this.$root.paint.canvas.drawContext.drawImage(canvas, 0, 0);
            }
        }
    }
</script>