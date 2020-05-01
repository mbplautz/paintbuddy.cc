<template>
    <div id="app">
        <paint-toolbar />
        <paint-canvas />
    </div>
</template>

<script>
import PaintToolbar from './components/paint-toolbar.vue';
import PaintCanvas from './components/paint-canvas.vue';

import Shape from './module/shape';

export default {
    data() {
        return {};
    },
    created() {
        this.$root.paint = {
            function: {
                touch: () => {},
                drag: () => {},
                release: () => {}
            },
            options: {
                color: '#000000',
                lineWidth: 3.0,
                transparentSelection: false,
                filledPolygon: false,
                selectedShape: Object.keys(Shape)[0] // The default is the first one
            },
            canvas: {
                toolElement: null,
                toolContext: null,
                activeElement: null,
                activeContext: null,
                drawElement: null,
                drawContext: null,
                undoElement: null,
                undoContext: null,
            },
            state: {
                setColor: (color) => {
                    if (!this.$root.paint.state.drawing) {
                        this.$root.paint.state._colorTo = null;
                        this.$root.paint.options.color = color;
                        let canvas = this.$root.paint.canvas;
                        canvas.drawContext.strokeStyle = color;
                        canvas.drawContext.fillStyle = color;
                        canvas.activeContext.strokeStyle = color;
                        canvas.activeContext.fillStyle = color;
                        canvas.undoContext.strokeStyle = color;
                        canvas.undoContext.fillStyle = color;
                    }
                    else {
                        this.$root.paint.state._colorTo = color;
                    }
                },
                setLineWidth: (lineWidth) => {
                    if (!this.$root.paint.state.drawing) {
                        this.$root.paint.state._lineWidthTo = null;
                        this.$root.paint.options.lineWidth = lineWidth;
                        let canvas = this.$root.paint.canvas;
                        canvas.drawContext.lineWidth = lineWidth;
                        canvas.activeContext.lineWidth = lineWidth;
                        canvas.undoContext.lineWidth = lineWidth;
                    }
                    else {
                        this.$root.paint.state._lineWidthTo = lineWidth;
                    }
                },
                setTouchFunctions: (touchFunction, dragFunction, releaseFunction) => {
                    if (!this.$root.paint.state.drawing) {
                        this.$root.paint.state._touchFunctionsTo = null;
                        this.$root.paint.function.touch = touchFunction;
                        this.$root.paint.function.drag =  dragFunction;
                        this.$root.paint.function.release = releaseFunction;
                    }
                    else {
                        this.$root.paint.state._touchFunctionsTo = {
                            touchFunction,
                            dragFunction,
                            releaseFunction
                        };
                    }
                },
                saveUndoMap: (undoMap) => {
                    this.$root.paint.state.dirty = true;
                    this.$root.paint.state.canRedo = false;
                    this.$root.paint.state._redoQueue.length = 0;
                    this.$root.paint.state._undoQueue.push(undoMap);
                },
                undo: () => {
                    if (this.$root.paint.state._undoQueue.length > 0) {
                        let canvas = this.$root.paint.canvas.drawElement;
                        let context = this.$root.paint.canvas.drawContext;
                        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                        let undoMap = this.$root.paint.state._undoQueue.pop();
                        let redoMap = {};
                        let data = imageData.data;
                        let r, g, b, a, redoR, redoG, redoB, redoA, val, upperOffset;
                        // We can use fancy consolidated syntax since this operation is used less frequently
                        Object.keys(undoMap).forEach(key => {
                            a = key & 0xFF;
                            b = key & 0xFF00;
                            g = key & 0xFF0000;
                            r = key & 0xFF000000;
                            b >>= 8;
                            g >>= 16;
                            r >>= 24;
                            // 24 bit right shift in a 32-bit word may retain the sign
                            if (r < 0) {
                                // if so, roll the overflow
                                r = 255 + r;
                            }
                            let offsetArray = undoMap[key];
                            offsetArray.forEach(offset => {
                                if (Array.isArray(offset)) { // If this is a range ...
                                    upperOffset = offset[1]; // ... then determine the boundaries
                                    offset = offset[0];
                                }
                                else {
                                    upperOffset = offset;
                                }
                                // Either process the one offset or the whole range
                                do {
                                    redoR = data[offset];
                                    redoG = data[offset + 1];
                                    redoB = data[offset + 2];
                                    redoA = data[offset + 3];
                                    data[offset] = r;
                                    data[offset + 1] = g;
                                    data[offset + 2] = b;
                                    data[offset + 3] = a;
                                    val = redoA | (redoB << 8) | (redoG << 16) | (redoR << 24);
                                    if (!redoMap[val]) {
                                        redoMap[val] = [];
                                    }
                                    redoMap[val].push(offset);
                                    offset += 4;
                                } while (offset <= upperOffset);
                            });
                        });
                        context.putImageData(imageData, 0, 0);
                        this.$root.paint.state._redoQueue.push(redoMap);
                        this.$root.paint.state.canRedo = true;
                        this.$root.paint.state.dirty = this.$root.paint.state._undoQueue.length > 0;
                    }
                },
                redo: () => {
                    if (this.$root.paint.state._redoQueue.length > 0) {
                        let canvas = this.$root.paint.canvas.drawElement;
                        let context = this.$root.paint.canvas.drawContext;
                        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                        let redoMap = this.$root.paint.state._redoQueue.pop();
                        let undoMap = {};
                        let data = imageData.data;
                        let r, g, b, a, redoR, redoG, redoB, redoA, val;
                        // We can use fancy consolidated syntax since this operation is used less frequently
                        Object.keys(redoMap).forEach(key => {
                            a = key & 0xFF;
                            b = key & 0xFF00;
                            g = key & 0xFF0000;
                            r = key & 0xFF000000;
                            b >>= 8;
                            g >>= 16;
                            r >>= 24;
                            // 24 bit right shift in a 32-bit word may retain the sign
                            if (r < 0) {
                                // if so, roll the overflow
                                r = 255 + r;
                            }
                            let offsetArray = redoMap[key];
                            offsetArray.forEach(offset => {
                                redoR = data[offset];
                                redoG = data[offset + 1];
                                redoB = data[offset + 2];
                                redoA = data[offset + 3];
                                data[offset] = r;
                                data[offset + 1] = g;
                                data[offset + 2] = b;
                                data[offset + 3] = a;
                                val = redoA | (redoB << 8) | (redoG << 16) | (redoR << 24);
                                if (!undoMap[val]) {
                                    undoMap[val] = [];
                                }
                                undoMap[val].push(offset);
                            });
                        });
                        context.putImageData(imageData, 0, 0);
                        this.$root.paint.state._undoQueue.push(undoMap);
                        this.$root.paint.state.dirty = true;
                        this.$root.paint.state.canRedo = this.$root.paint.state._redoQueue.length > 0;
                    }
                },
                drawing: false,
                dirty: false,
                canRedo: false,
                _undoQueue: [],
                _redoQueue: [],
                _colorTo: null,
                _lineWidthTo: null,
                _touchFunctionsTo: null
            }
        };
        // Debug
        window.Vue = this.$root;
    },
    mounted() {
        // Clear the drawing area - solid background
        let canvas = this.$root.paint.canvas.drawElement;
        let context = this.$root.paint.canvas.drawContext;
        context.fillStyle = '#ffffff'; // TODO: Centralize background color
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.fill();
        // Set the defaults
        this.$root.paint.state.setColor(this.$root.paint.options.color);
        this.$root.paint.state.setLineWidth(this.$root.paint.options.lineWidth);
        try {
            document.querySelector('div.brush div.toolbar-button').click();
        } catch (e) {}
        this.$root.$on('drawing-released', () => {
            if (!!this.$root.paint.state._colorTo) {
                this.$root.paint.state.setColor(this.$root.paint.state._colorTo);
            }
            if (!!this.$root.paint.state._lineWidthTo) {
                this.$root.paint.state.setLineWidth(this.$root.paint.state._lineWidthTo);
            }
            if (!!this.$root.paint.state._touchFunctionsTo) {
                let functions = this.$root.paint.state._touchFunctionsTo;
                this.$root.paint.state.setTouchFunctions(
                    functions.touchFunction,
                    functions.dragFunction,
                    functions.releaseFunction
                );
            }
        });
    },
    components: {
        PaintToolbar,
        PaintCanvas
    }
}
</script>