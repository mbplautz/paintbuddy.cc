<script>
    import EditTool from './edit-tool.vue';

    const floodFillSteps = [[1, 0], [0, 1], [0, -1], [-1, 0]];
    const floodFillWays = floodFillSteps.length;
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
                name: 'Fill',
                icon: 'fas fa-fill-drip'
            }
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
                let target = target = imageData.data.slice(targetOffset, targetOffset + 4);
                let parsedColor = this.parseColor(this.$root.paint.options.color);

                if(this.toleranceEqual(target, 0, parsedColor, 10)) {
                    // Trying to fill something which is (essentially) the fill colour
                    return;
                }

                this.floodFill(
                    imageData.data, 
                    this.$root.paint.canvas.getPointOffset,
                    { x, y },
                    parsedColor,
                    target,
                    10,
                    imageData.width,
                    imageData.height
                );

                context.putImageData(imageData, 0, 0);
            },
            // The next two functions are from a flood fill algorithm implementaiton
            // from https://bl.ocks.org/jon-hall/2fc30039629ef22bc95c
            // "canvas flood fill implementation and a simple demo app"
            // Adapted for code consistency
            // Released under the The MIT License.

            // Compare subsection of arrayOne's values to arrayTwo's values, with an optional tolerance
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

            // The actual flood fill implementation
            floodFill(imageData, getPointOffset, point, colour, target, tolerance, width, height) {
                let points = [point],
                    seen = {},
                    steps = floodFillSteps,
                    key,
                    x,
                    y,
                    offset,
                    i,
                    x2,
                    y2;
                
                // Keep going while we have points to walk
                while(!!(point = points.pop())) {
                    x = point.x;
                    y = point.y;
                    offset = getPointOffset(x, y);
                    
                    // Move to next point if this pixel isn't within tolerance of the colour being filled
                    if(!this.toleranceEqual(imageData, offset, target, tolerance)) {
                        continue;
                    }
                    
                    // Update the pixel to the fill colour and add neighbours onto stack to traverse 
                    // the fill area
                    i = floodFillWays;
                    while(i--) {
                        // Use the same loop for setting RGBA as for checking the neighbouring pixels
                        if(i < 4) {
                            imageData[offset + i] = colour[i];
                        }
                    
                        // Get the new coordinate by adjusting x and y based on current step
                        x2 = x + steps[i][0];
                        y2 = y + steps[i][1];
                        key = x2 + ',' + y2;
                        
                        // If new coordinate is out of bounds, or we've already added it, then skip to 
                        // trying the next neighbour without adding this one
                        if(x2 < 0 || y2 < 0 || x2 >= width || y2 >= height || seen[key]) {
                            continue;
                        }
                        
                        // Push neighbour onto points array to be processed, and tag as seen
                        points.push({ x: x2, y: y2 });
                        seen[key] = true;
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