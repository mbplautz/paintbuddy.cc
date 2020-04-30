<script>
    import EditTool from './edit-tool.vue';
    import Worker from '../worker/flood-fill.worker.js';

    const parseColorRegex = /^#?([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})?$/i;

    // So the flood fill is a heavily intensive processing operation for a web browser. Every other
    // tool that is used can be processed on the event thread because it is relatively so light. So
    // to improve the fill tool's user experience, and to compensate for the fact that it is often
    // going to take one or two whole seconds to fill the requested area, there are page covers
    // that appear when the paint tool is used:
    //   - a light cover that shows up immediately after the paint operation has started
    //   - a heavy cover that is more in-your-face and informative that this operation is taking time
    // The heavy cover only shows up if the operation has taken over a second, as defined by this
    // number below. If the operation completes before one second, then the user never sees the heavy
    // cover. This is intended to create a more seemless and less jarring user experience for the fill
    // tool.
    const heavyCoverDelay = 1000;

    const worker = new Worker();
    window.floodFillWorker = worker;

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
                heavyCoverTimeout: 0
            }
        },
        mounted() {
            worker.onmessage = this.completeFill;
        },
        extends: EditTool,
        methods: {
            select() {
                console.log('Fill Tool clicked');
            },
            touchFunction(e) {

            },
            dragFunction(e) {

            },
            releaseFunction(e) {
                let canvas = this.$root.paint.canvas.drawElement;
                let bounds = canvas.getBoundingClientRect();
                let x, y;
                if (e.type === 'mouseup') {
                    x = e.clientX - bounds.left;
                    y = e.clientY - bounds.top;
                }
                else if (e.type === 'touchend') {
                    // For the line tool, we only use the first touch if there are multiple touches
                    x = e.touches[0].clientX - bounds.left;
                    y = e.touches[0].clientY - bounds.top;
                }
                let context = this.$root.paint.canvas.drawContext;
                let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                let targetOffset = this.$root.paint.canvas.getPointOffset(x, y);
                let target = imageData.data.slice(targetOffset, targetOffset + 4);
                let parsedColor = this.parseColor(this.$root.paint.options.color);

                if(this.toleranceEqual(target, 0, parsedColor, 10)) {
                    // Trying to fill something which is (essentially) the fill colour
                    return;
                }

                this.showLightPaintCover();
                this.heavyCoverTimeout = setTimeout(this.showHeavyPaintCover, heavyCoverDelay);
                // Submit this to the flood fill worker and wait for it to complete this heavy calculation
                worker.postMessage({
                    data: imageData.data,
                    x,
                    y,
                    parsedColor,
                    target,
                    tolerance: 10,
                    width: imageData.width,
                    height: imageData.height
                });
            },
            completeFill(oEvent) {
                let context = this.$root.paint.canvas.undoContext;
                let canvas = this.$root.paint.canvas.undoElement;
                context.clearRect(0, 0, canvas.width, canvas.height);
                let imageData = new ImageData(oEvent.data, canvas.width, canvas.height);
                context.putImageData(imageData, 0, 0);
                this.commitDrawing();
                clearTimeout(this.heavyCoverTimeout);
                this.hidePaintCovers();
            },
            toleranceEqual(arrayOne, offset, arrayTwo, tolerance) {
                let length = arrayTwo.length,
                start = offset + length;
                
                tolerance = tolerance || 0;
                
                // Iterate (in reverse) the items being compared in each array, checking their values are 
                // within tolerance of each other
                while(start-- && length--) {
                    if(Math.abs(arrayOne[start] - arrayTwo[length]) > tolerance) {
                        return false;
                    }
                }
                
                return true;
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
            },
            showLightPaintCover() {
                document.querySelector('div.paint-cover-light').style.zIndex = 5;
            },
            showHeavyPaintCover() {
                document.querySelector('div.paint-cover-heavy').style.zIndex = 5;
            },
            hidePaintCovers() {
                document.querySelector('div.paint-cover-light').style.zIndex = '';
                document.querySelector('div.paint-cover-heavy').style.zIndex = '';
            }
        }
    }
</script>