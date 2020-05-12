<script>
    import EditButton from '../buttons/edit-button.vue';
    import floodFill from '../../module/flood-fill';

    const parseColorRegex = /^#?([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})?$/i;

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
                name: 'fill',
                icon: 'fas fa-fill-drip',
                // heavyCoverTimeout: 0
                fillUndoArray: [],
                fillInProgress: false,
                fillEventQueue: []
            }
        },
        mounted() {
            // worker.onmessage = this.completeFill;
        },
        extends: EditButton,
        methods: {
            select() {
                console.debug('Fill Tool clicked');
            },
            touchFunction(e) {

            },
            dragFunction(e) {

            },
            releaseFunction(e) {
                // We will only do one fill at at time
                if (this.fillInProgress) {
                    this.fillEventQueue.push(e);
                    return;
                }
                this.fillInProgress = true;
                let canvas = this.$root.paint.canvas.drawElement;
                let bounds = canvas.getBoundingClientRect();
                let x, y;
                if (e.type === 'mouseup') {
                    x = e.clientX - bounds.left;
                    y = e.clientY - bounds.top;
                }
                else if (e.type === 'touchend') {
                    // For the fill tool, we only use the first touch if there are multiple touches
                    x = e.changedTouches[0].clientX - bounds.left;
                    y = e.changedTouches[0].clientY - bounds.top;
                }

                let context = this.$root.paint.canvas.drawContext;
                // To avoid unwanted side effects, the fill must only apply to the visible viewport, not the entire canvas
                let parentDiv = canvas.parentElement;
                let clientRect = parentDiv.getBoundingClientRect();
                let width = Math.floor(clientRect.width);
                let height = Math.floor(clientRect.height);
                let undoCanvas = this.$root.paint.canvas.undoElement;
                let undoContext = this.$root.paint.canvas.undoContext;

                // For optimization purposes, we copy the draw canvas to the undo canvas before painting,
                // draw to the draw canvas, and during the flood fill, we keep track of the *offsets* (but
                // not their color values) that were painted to, then exit the event.
                undoContext.drawImage(canvas, 0, 0);
                let fillColor = this.parseColor(this.$root.paint.options.color);
                this.fillUndoArray.length = 0;
                floodFill(context, context, x, y, width, height, fillColor[0], fillColor[1], fillColor[2], fillColor[3] || 255, this.fillUndoArray);
                if (this.fillUndoArray.length > 0) { 
                    // This is a reduced version of the usual undo commit
                    // For performance reasons, we let the event complete before calculating the undo
                    setTimeout(() => {
                        let undoData = undoContext.getImageData(0, 0, width, height);
                        let undoWidth = undoCanvas.width;
                        let undoMap = {};
                        let undoDataBinary = undoData.data;
                        let index;
                        let offset, mappedOffset, mappedX, mappedY;
                        let r, g, b, a, val;
                        for (index = 0; index < this.fillUndoArray.length; index++) {
                            offset = this.fillUndoArray[index];
                            r = undoDataBinary[offset];
                            g = undoDataBinary[offset + 1];
                            b = undoDataBinary[offset + 2];
                            a = undoDataBinary[offset + 3];
                            val = a | (b << 8) | (g << 16) | (r << 24);
                            if (!undoMap[val]) {
                                undoMap[val] = [];
                            }
                            offset = offset / 4;
                            mappedX = offset % width;
                            mappedY = Math.floor(offset / width);
                            mappedOffset = 4 * (mappedY * undoWidth + mappedX);
                            undoMap[val].push(mappedOffset);
                        }
                        // Since the fillUndoArray wasn't populated in order, we'll need to sort the undo map before we
                        // try to compress it so we can use ranges where they are found
                        Object.keys(undoMap).forEach(val => {
                            undoMap[val].sort();
                        });
                        // Now compress the undo map since it is sorted
                        let compressedUndoMap = this.compressUndoMap(undoMap);
                        this.$root.paint.state.saveUndoMap(compressedUndoMap);
                        this.fillInProgress = false;
                        if (this.fillEventQueue.length > 0) {
                            setTimeout(() => {
                                this.releaseFunction(this.fillEventQueue.pop());
                            }, 0);
                        }
                     }, 0);
                }
                else {
                    this.fillInProgress = false;
                    if (this.fillEventQueue.length > 0) {
                        setTimeout(() => {
                            this.releaseFunction(this.fillEventQueue.pop());
                        }, 0);
                    }
                }
            },
            parseColor(value) {
                // Try to extract the hex values from the colour string
                let parsed = parseColorRegex.exec(value || '');
                if(!parsed) {
                    throw new Error('Invalid color set');
                }
            
                // Store the value, and the parsed data
                let parsedColor = parsed.slice(1).map(val => { 
                    // Get int from hex
                    var parsedInt = parseInt(val, 16);
                    
                    // Default to 255 if value isn't an int or is out of uint8 range
                    return isNaN(parsedInt) || parsedInt < 0 || parsedInt > 255 ? 255 : parsedInt;
                });

                return parsedColor;
            }
        }
    }
</script>