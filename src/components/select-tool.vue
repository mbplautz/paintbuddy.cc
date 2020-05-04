<script>
    import EditTool from './edit-tool.vue';

    // Set dash length here
    const dashLength = 5;
    const doubleDashLength = dashLength * 2;

    const blackWhiteSvgTemplate = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${doubleDashLength} ${doubleDashLength}" width="${doubleDashLength}" height="${doubleDashLength}">
    <rect x="0" y="0" width="${doubleDashLength}" height="${doubleDashLength}" fill="#000000"></rect><rect x="${dashLength}" y="0" width="${dashLength}" height="${dashLength}" fill="#ffffff"></rect>
    <rect x="0" y="${dashLength}" width="${dashLength}" height="${dashLength}" fill="#ffffff"></rect>
</svg>
    `.replace(/\n/g, '').replace(/\s{2,}/g, '');

    const img = document.createElement('img');
    img.src = `data:image/svg+xml;base64,${btoa(blackWhiteSvgTemplate)}`;
    img.height = doubleDashLength;
    img.width = doubleDashLength;

    const backgroundColor = '#ffffff'; // TODO: Centralize background color

    const pastePointStart = { x: 100, y: 100 };
    const pastePointStep = { deltaX: 50, deltaY: 50 };

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
                name: 'select',
                icon: 'fas fa-mouse-pointer',
                mouse: {
                    initialX: 0,
                    initialY: 0
                },
                touch: {
                    initialX: 0,
                    initialY: 0,
                    finalX: 0,
                    finalY: 0
                },
                selectionStart: {
                    x: 0,
                    y: 0
                },
                originalPosition: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                },
                dashPattern: null,
                selectionData: null,
                originalSelectionData: null,
                pasted: false,
                drawingData: null,
                pastePoint: Object.assign({}, pastePointStart)
            }
        },
        extends: EditTool,
        mounted() {
            this.$root.$on('clear-selection', this.clearSelection);
            this.$root.$on('drawing-started', this.clearSelection);
            this.$root.$on('update-selection', this.updateSelection);
            this.$root.$on('copy-selection', this.copySelection);
            this.$root.$on('cut-selection', this.cutSelection);
            this.$root.$on('paste-selection', this.pasteSelection);
            this.$root.paint.function.moveTouch = this.moveTouchFunction;
            this.$root.paint.function.moveDrag = this.moveDragFunction;
            this.$root.paint.function.moveRelease = this.moveReleaseFunction;
        },
        methods: {
            select() {
                console.log('Select Tool clicked');
            },
            childDeselect() {
                console.log('Select tool deselect');
                this.clearSelection();
                let undoContext = this.$root.paint.canvas.undoContext;
                undoContext.fillStyle = this.$root.paint.options.color;
            },
            touchFunction(e) {
                this.clearSelection();
                this.pasted = false;
                let canvas = this.$root.paint.canvas.toolElement;
                let bounds = canvas.getBoundingClientRect();
                let x, y;
                if (e.type === 'mousedown') {
                    this.mouse.initialX = e.clientX - bounds.left;
                    this.mouse.initialY = e.clientY - bounds.top;
                    x = this.mouse.initialX;
                    y = this.mouse.initialY;
                }
                else if (e.type === 'touchstart') {
                    // For the select tool, we only use the first touch if there are multiple touches
                    this.touch.initialX = e.touches[0].clientX - bounds.left;
                    this.touch.initialY = e.touches[0].clientY - bounds.top;
                    this.touch.finalX = this.touch.initialX;
                    this.touch.finalY = this.touch.initialY;
                    x = this.touch.initialX;
                    y = this.touch.initialY;
                }
                let context = this.$root.paint.canvas.toolContext;
                if (this.dashPattern === null) {
                    this.buildDashPattern();
                }
                context.strokeWidth = 1;
                context.strokeStyle = this.dashPattern;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
                context.rect(x, y, 1, 1);
                context.stroke();
            },
            dragFunction(e) {
                let canvas = this.$root.paint.canvas.toolElement;
                let bounds = canvas.getBoundingClientRect();
                let initialX, initialY, currentX, currentY;
                if (e.type === 'mousemove') {
                    initialX = this.mouse.initialX;
                    initialY = this.mouse.initialY;
                    currentX = e.clientX - bounds.left;
                    currentY = e.clientY - bounds.top;
                }
                else if (e.type === 'touchmove') {
                    initialX = this.touch.initialX;
                    initialY = this.touch.initialY;
                    currentX = e.touches[0].clientX - bounds.left;
                    currentY = e.touches[0].clientY - bounds.top;
                    this.touch.finalX = currentX;
                    this.touch.finalY = currentY;
                }
                let context = this.$root.paint.canvas.toolContext;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
                let width = currentX - initialX;
                let height = currentY - initialY;
                context.beginPath();
                context.rect(initialX, initialY, width, height);
                context.stroke();
            },
            releaseFunction(e) {
                let canvas = this.$root.paint.canvas.toolElement;
                let initialX, initialY, finalX, finalY;
                if (e.type === 'mouseup') {
                    let bounds = canvas.getBoundingClientRect();
                    initialX = this.mouse.initialX;
                    initialY = this.mouse.initialY;
                    finalX = e.clientX - bounds.left;
                    finalY = e.clientY - bounds.top;
                }
                else if (e.type === 'touchend') {
                    initialX = this.touch.initialX;
                    initialY = this.touch.initialY;
                    finalX = this.touch.finalX;
                    finalY = this.touch.finalY;
                }
                let context = this.$root.paint.canvas.toolContext;
                context.clearRect(0, 0, canvas.width, canvas.height);
                if (finalX < initialX) {
                    let temp = initialX;
                    initialX = finalX;
                    finalX = temp;
                }
                if (finalY < initialY) {
                    let temp = initialY;
                    initialY = finalY;
                    finalY = temp;
                }
                let width = finalX - initialX;
                let height = finalY - initialY;
                if (!width || !height) {
                    return;
                }
                this.$root.paint.state.selection = {
                    x: initialX,
                    y: initialY,
                    width,
                    height
                };
                this.originalPosition.x = this.$root.paint.state.selection.x;
                this.originalPosition.y = this.$root.paint.state.selection.y;
                this.originalPosition.width = this.$root.paint.state.selection.width;
                this.originalPosition.height = this.$root.paint.state.selection.height;
                let drawContext = this.$root.paint.canvas.drawContext;
                let drawCanvas = this.$root.paint.canvas.drawElement;
                this.originalSelectionData = drawContext.getImageData(initialX, initialY, width, height);
                this.selectionData = drawContext.getImageData(initialX, initialY, width, height);
                this.drawingData = drawContext.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
                this.setSelectionTransparency();
                this.invertSelectionBorder(true);
                context.putImageData(this.selectionData, initialX, initialY);
            },
            moveTouchFunction(e) {
                let canvas = this.$root.paint.canvas.toolElement;
                let bounds = canvas.getBoundingClientRect();
                let x, y;
                if (e.type === 'mousedown') {
                    this.mouse.initialX = e.clientX - bounds.left;
                    this.mouse.initialY = e.clientY - bounds.top;
                }
                else if (e.type === 'touchstart') {
                    // For the select tool, we only use the first touch if there are multiple touches
                    this.touch.initialX = e.touches[0].clientX - bounds.left;
                    this.touch.initialY = e.touches[0].clientY - bounds.top;
                    this.touch.finalX = this.touch.initialX;
                    this.touch.finalY = this.touch.initialY;
                }
                this.selectionStart.x = this.$root.paint.state.selection.x;
                this.selectionStart.y = this.$root.paint.state.selection.y;
                let context = this.$root.paint.canvas.toolContext;
                this.invertSelectionBorder(false);
            },
            moveDragFunction(e) {
                if (window.stopme) {
                    window.stopme = false;
                    debugger;
                }
                let canvas = this.$root.paint.canvas.toolElement;
                let bounds = canvas.getBoundingClientRect();
                let initialX, initialY, currentX, currentY;
                if (e.type === 'mousemove') {
                    initialX = this.mouse.initialX;
                    initialY = this.mouse.initialY;
                    currentX = e.clientX - bounds.left;
                    currentY = e.clientY - bounds.top;
                }
                else if (e.type === 'touchmove') {
                    initialX = this.touch.initialX;
                    initialY = this.touch.initialY;
                    currentX = e.touches[0].clientX - bounds.left;
                    currentY = e.touches[0].clientY - bounds.top;
                    this.touch.finalX = currentX;
                    this.touch.finalY = currentY;
                }
                let deltaX = currentX - initialX;
                let deltaY = currentY - initialY;
                this.$root.paint.state.selection.x = this.selectionStart.x + deltaX;
                this.$root.paint.state.selection.y = this.selectionStart.y + deltaY;
                let context = this.$root.paint.canvas.toolContext;
                context.clearRect(0, 0, canvas.width, canvas.height);
                if (!this.pasted) {
                    context.fillStyle = backgroundColor;
                    context.fillRect(this.originalPosition.x, this.originalPosition.y, this.originalPosition.width, this.originalPosition.height);
                }
                context.putImageData(this.selectionData, this.$root.paint.state.selection.x, this.$root.paint.state.selection.y);
            },
            moveReleaseFunction(e) {
                let canvas = this.$root.paint.canvas.toolElement;
                let initialX, initialY, finalX, finalY;
                if (e.type === 'mouseup') {
                    let bounds = canvas.getBoundingClientRect();
                    initialX = this.mouse.initialX;
                    initialY = this.mouse.initialY;
                    finalX = e.clientX - bounds.left;
                    finalY = e.clientY - bounds.top;
                }
                else if (e.type === 'touchend') {
                    initialX = this.touch.initialX;
                    initialY = this.touch.initialY;
                    finalX = this.touch.finalX;
                    finalY = this.touch.finalY;
                }
                let deltaX = finalX - initialX;
                let deltaY = finalY - initialY;
                this.$root.paint.state.selection.x = this.selectionStart.x + deltaX;
                this.$root.paint.state.selection.y = this.selectionStart.y + deltaY;
                let context = this.$root.paint.canvas.toolContext;
                context.clearRect(0, 0, canvas.width, canvas.height);
                if (!this.pasted) {
                    context.fillStyle = backgroundColor;
                    context.fillRect(this.originalPosition.x, this.originalPosition.y, this.originalPosition.width, this.originalPosition.height);
                }
                this.invertSelectionBorder(true);
                context.putImageData(this.selectionData, this.$root.paint.state.selection.x, this.$root.paint.state.selection.y);
            },
            updateSelection(transform) {
                if (transform) {
                    this.originalSelectionData = transform(this.originalSelectionData);
                    this.selectionData = new ImageData(
                        Uint8ClampedArray.from(this.originalSelectionData.data),
                        this.originalSelectionData.width,
                        this.originalSelectionData.height
                    );
                    this.invertSelectionBorder(true);
                }
                if (this.$root.paint.state.selection) {
                    let canvas = this.$root.paint.canvas.toolElement;
                    let context = this.$root.paint.canvas.toolContext;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    if (!this.pasted) {
                        context.fillStyle = backgroundColor;
                        context.fillRect(this.originalPosition.x, this.originalPosition.y, this.originalPosition.width, this.originalPosition.height);
                    }
                    this.setSelectionTransparency();
                    context.putImageData(this.selectionData, this.$root.paint.state.selection.x, this.$root.paint.state.selection.y);
                }
            },
            clearSelection() {
                if (this.$root.paint.state.selection) {
                    this.invertSelectionBorder(false);
                    let undoCanvas = this.$root.paint.canvas.undoElement;
                    let undoContext = this.$root.paint.canvas.undoContext;
                    undoContext.clearRect(0, 0, undoCanvas.width, undoCanvas.height);
                    if (!this.pasted) {
                        undoContext.fillStyle = backgroundColor;
                        undoContext.fillRect(this.originalPosition.x, this.originalPosition.y, this.originalPosition.width, this.originalPosition.height);
                    }
                    this.setSelectionTransparency();
                    undoContext.putImageData(this.selectionData, this.$root.paint.state.selection.x, this.$root.paint.state.selection.y);
                    this.$root.paint.state.selection = null;
                    let canvas = this.$root.paint.canvas.toolElement;
                    let context = this.$root.paint.canvas.toolContext;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    this.commitDrawing();
                }
            },
            copySelection() {
                if (this.$root.paint.state.selection) {
                    this.$root.paint.state.copySelection = this.originalSelectionData;
                }
            },
            cutSelection() {
                this.copySelection();
                let canvas = this.$root.paint.canvas.undoElement;
                let context = this.$root.paint.canvas.undoContext;
                context.clearRect(0, 0, canvas.width, canvas.height);
                if (!this.pasted)  {
                    let x = this.originalPosition.x;
                    let y = this.originalPosition.y;
                    let width = this.originalPosition.width;
                    let height = this.originalPosition.height;
                    context.fillStyle = backgroundColor;
                    context.fillRect(x, y, width, height);
                }
                this.$root.paint.state.selection = null;
                canvas = this.$root.paint.canvas.toolElement;
                context = this.$root.paint.canvas.toolContext;
                context.clearRect(0, 0, canvas.width, canvas.height);
                this.commitDrawing();
            },
            pasteSelection() {
                if (this.$root.paint.state.copySelection) {
                    this.clearSelection();
                    this.pasted = true;
                    let copySelection = this.$root.paint.state.copySelection;
                    let x = this.pastePoint.x;
                    let y = this.pastePoint.y;
                    let width = copySelection.width;
                    let height = copySelection.height;
                    let x2 = x + width;
                    let y2 = y + width;
                    // Use the canvas div size in the window view instead of the actual canvas size for the paste boundaries
                    // Note that the canvas div size can never be larger than the canvases
                    let canvasDiv = this.$root.paint.canvas.toolElement.parentElement.getBoundingClientRect();
                    let context = this.$root.paint.canvas.toolContext;
                    // Ensure the pasted image doesn't go over off to the side of the canvas
                    if (x2 >= canvasDiv.width) {
                        x -= (x2 - width);
                        // But if it is does, set it to 0
                        if (x < 0) {
                            x = 0;
                        }
                    }
                    if (y2 >= canvasDiv.height) {
                        y -= (y2 - width);
                        if (y < 0) {
                            y = 0;
                        }
                    }
                    // Update paste point
                    this.pastePoint.x += pastePointStep.deltaX;
                    this.pastePoint.y += pastePointStep.deltaY;
                    if (this.pastePoint.x + width > canvasDiv.width) {
                        this.pastePoint.x = pastePointStart.x;
                    }
                    if (this.pastePoint.y + height > canvasDiv.height) {
                        this.pastePoint.y = pastePointStart.y;
                    }
                    // Update the selection
                    this.originalSelectionData = copySelection;
                    this.selectionData = new ImageData(
                        Uint8ClampedArray.from(copySelection.data),
                        width,
                        height
                    );
                    this.$root.paint.state.selection = {
                        x, 
                        y,
                        width,
                        height
                    };
                    this.originalPosition = {
                        x,
                        y,
                        width,
                        height
                    };
                    this.setSelectionTransparency();
                    this.invertSelectionBorder(true);
                    context.putImageData(this.selectionData, x, y);
                }
            },
            invertSelectionBorder(enable) {
                let width = this.$root.paint.state.selection.width;
                let height = this.$root.paint.state.selection.height;
                let getPointOffset = (x, y) => 4 * (y * width + x);
                let data = this.selectionData.data;
                let originalData = this.originalSelectionData.data;
                let directionArray = [
                    {
                        deltaX: 1,
                        deltaY: 0,
                        bound: (x, y) => x < width - 1
                    },
                    {
                        deltaX: 0,
                        deltaY: 1,
                        bound: (x, y) => y < height - 1
                    },
                    {
                        deltaX: -1,
                        deltaY: 0,
                        bound: (x, y) => x > 0
                    },
                    {
                        deltaX: 0,
                        deltaY: -1,
                        bound: (x, y) => y > 0
                    }
                ];
                let x = 0, y = 0, invert = true, offset;
                directionArray.forEach(direction => {
                    do {
                        offset = getPointOffset(x, y);
                        if (invert) {
                            if (enable) {
                                data[offset] = 255 - originalData[offset];
                                data[offset + 1] = 255 - originalData[offset + 1];
                                data[offset + 2] = 255 - originalData[offset + 2];
                                data[offset + 3] = 255; // Keep the border opaque
                            }
                            else {
                                data[offset] = originalData[offset];
                                data[offset + 1] = originalData[offset + 1];
                                data[offset + 2] = originalData[offset + 2];
                                data[offset + 3] = originalData[offset + 3];
                            }
                        }
                        invert = !invert;
                        x += direction.deltaX;
                        y += direction.deltaY;
                    } while(direction.bound(x, y));
                });
            },
            setSelectionTransparency() {
                if (this.$root.paint.options.transparentSelection) {
                    let data = this.selectionData.data;
                    let offset;
                    for (offset = 0; offset < data.length; offset += 4) {
                        if (this.isBackgroundColor(data, offset)) {
                            // Set the A (of RGBA) to 0
                            data[offset + 3] = 0; 
                        }
                    }
                }
                else {
                    let data = this.selectionData.data;
                    let offset;
                    for (offset = 0; offset < data.length; offset += 4) {
                        if (this.isBackgroundColor(data, offset)) {
                            // Set the A (of RGBA) to 255
                            data[offset + 3] = 255; 
                        }
                    }
                }
            },
            isBackgroundColor(array, offset) {
                return array[offset] === 255 && array[offset + 1] === 255 && array[offset + 2] === 255;
            },
            buildDashPattern() {
                let context = this.$root.paint.canvas.toolContext;
                this.dashPattern = context.createPattern(img, 'repeat');
            }
        }
    }
</script>