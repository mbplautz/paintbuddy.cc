<script>
    export default {
        methods: {
            compressUndoMap(undoMap) {
                let compressedUndoMap = {};
                let keyIndex, key, offset, calcOffset, lowerOffset = null, lastOffset = null, index, array, compressedArray;
                let undoMapKeys = Object.keys(undoMap);
                for (keyIndex in undoMapKeys) {
                    key = undoMapKeys[keyIndex];
                    compressedArray = [];
                    compressedUndoMap[key] = compressedArray;
                    array = undoMap[key];
                    // Reset our state
                    lowerOffset = null;
                    lastOffset = null;
                    calcOffset = null;
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
                            else if (lastOffset !== null) {
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
                }
                return compressedUndoMap;
            }
        }
    };
</script>