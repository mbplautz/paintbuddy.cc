<template>
    <div id="app">
        <paint-toolbar />
        <paint-canvas />
        <paint-menu />
    </div>
</template>

<script>
import PaintToolbar from './components/containers/paint-toolbar.vue';
import PaintCanvas from './components/containers/paint-canvas.vue';
import PaintMenu from './components/containers/paint-menu.vue';

import UndoCalc from './mixins/undo-calc.vue';

import Shape from './module/shape';

export default {
    data() {
        return {};
    },
    mixins: [UndoCalc],
    created() {
        this.$root.paint = {
            function: {
                touch: () => {},
                drag: () => {},
                release: () => {},
                moveTouch: () => {},
                moveDrag: () => {},
                moveRelease: () => {}
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
            tool: {},
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
                    this.$root.paint.state.dirtySave = true;
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
                                r = 256 + r;
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
                        let compressedRedoMap = this.compressUndoMap(redoMap);
                        this.$root.paint.state._redoQueue.push(compressedRedoMap);
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
                        let r, g, b, a, redoR, redoG, redoB, redoA, val, upperOffset;
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
                                r = 256 + r;
                            }
                            let offsetArray = redoMap[key];
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
                                    if (!undoMap[val]) {
                                        undoMap[val] = [];
                                    }
                                    undoMap[val].push(offset);
                                    offset += 4;
                                } while (offset <= upperOffset);
                            });
                        });
                        context.putImageData(imageData, 0, 0);
                        let compressedUndoMap = this.compressUndoMap(undoMap);
                        this.$root.paint.state._undoQueue.push(compressedUndoMap);
                        this.$root.paint.state.dirty = true;
                        this.$root.paint.state.canRedo = this.$root.paint.state._redoQueue.length > 0;
                    }
                },
                resetState: () => {
                    // All values should match what is set below to reset state
                    let state = this.$root.paint.state;
                    state.drawing = false;
                    state.dirty = false;
                    state.dirtySave = false;
                    state.canRedo = false;
                    state.selection = null;
                    state._undoQueue.length = 0;
                    state._redoQueue.length = 0;
                    state._colorTo = null;
                    state._lineWidthTo = null;
                    state._touchFunctionsTo = null;
                },
                confirm: {
                    confirmDialog: false,
                    confirmAction: '',
                    confirmOption: null,
                    template: null,
                    message: ''
                },
                drawing: false,
                dirty: false,
                dirtySave: false,
                canRedo: false,
                selection: null,
                copySelection: null,
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
        // Prevent a quick visible slide of all the popups upon initial page load
        setTimeout(() => this.$root.$emit('unhide-popups'), 250);
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
        // Print Support
        window.addEventListener('beforeprint', () => {
            let canvasDiv = document.querySelector('div.canvas div.canvas-child');
            let bounds = canvasDiv.getBoundingClientRect();
            let img = document.createElement('img');
            img.id = 'print-img';
            let width = bounds.width > 0 ? bounds.width - 1 : 0;
            let height = bounds.height > 0 ? bounds.height - 1 : 0;
            img.width = width;
            img.height = height;
            img.src = this.$root.paint.canvas.drawElement.toDataURL();
            canvasDiv.appendChild(img);
        });
        window.addEventListener('afterprint', () => {
            let canvasDiv = document.querySelector('div.canvas div.canvas-child');
            let img = document.getElementById('print-img');
            canvasDiv.removeChild(img);            
        })
    },
    components: {
        PaintToolbar,
        PaintCanvas,
        PaintMenu
    }
}
</script>