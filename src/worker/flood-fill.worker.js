const floodFillSteps = [[1, 0], [0, 1], [0, -1], [-1, 0]];
const floodFillWays = floodFillSteps.length;

let getPointOffset = null;
let getPointOffsetWidth = null;

// The next two functions are from a flood fill algorithm implementaiton
// from https://bl.ocks.org/jon-hall/2fc30039629ef22bc95c
// "canvas flood fill implementation and a simple demo app"
// Adapted for code consistency
// Released under the The MIT License.

// The actual flood fill implementation
const floodFill = (imageData, getPointOffset, point, colour, target, tolerance, width, height) => {
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
        if(!toleranceEqual(imageData, offset, target, tolerance)) {
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
};

// Compare subsection of arrayOne's values to arrayTwo's values, with an optional tolerance
const toleranceEqual = (arrayOne, offset, arrayTwo, tolerance) => {
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
};

// This is a performance enhancement - removing the width reference and hardcoding it instead 
// reduces cycles. We set it here, every time the width of the canvas changes
const getGetPointOffsetFunction = (width) => {
    if (width !== getPointOffsetWidth) {
        getPointOffsetWidth = width;
        getPointOffset = new Function('x', 'y', 'return 4 * (y * ' + width + ' + x)');
    }
    return getPointOffset;
}

onmessage = (oEvent) => {
    let d = oEvent.data;
    let getPointOffsetFn = getGetPointOffsetFunction(d.width);
    floodFill(
        d.data, 
        getPointOffsetFn,
        { x: d.x, y: d.y },
        d.parsedColor,
        d.target,
        d.tolerance,
        d.width,
        d.height
    );
    postMessage(d.data);
};
