<script>
    import EditButton from '../buttons/edit-button.vue';

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
                dirtySelection: false,
                pasted: false,
                pastePoint: Object.assign({}, pastePointStart)
            }
        },
        extends: EditButton,
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
                console.debug('Select Tool clicked');
            },
            childDeselect() {
                console.debug('Select tool deselect');
                this.clearSelection();
                let context = this.$root.paint.canvas.undoContext;
                context.fillStyle = this.$root.paint.options.color;
                context = this.$root.paint.canvas.activeContext;
                context.fillStyle = this.$root.paint.options.color;
                let canvas = this.$root.paint.canvas.activeElement;
                context.clearRect(0, 0, canvas.width, canvas.height);
            },
            touchFunction(e) {
                this.clearSelection();
                this.pasted = false;
                this.dirtySelection = false;
                let canvas = this.$root.paint.canvas.toolElement;
                let boundsUnrounded = canvas.getBoundingClientRect();
                let bounds = { left: Math.floor(boundsUnrounded.left), top: Math.floor(boundsUnrounded.top) };
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
                let boundsUnrounded = canvas.getBoundingClientRect();
                let bounds = { left: Math.floor(boundsUnrounded.left), top: Math.floor(boundsUnrounded.top) };
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
                    let boundsUnrounded = canvas.getBoundingClientRect();
                    let bounds = { left: Math.floor(boundsUnrounded.left), top: Math.floor(boundsUnrounded.top) };
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
                this.setSelectionTransparency();
                this.invertSelectionBorder(true);
                context.putImageData(this.selectionData, initialX, initialY);
            },
            moveTouchFunction(e) {
                let canvas = this.$root.paint.canvas.toolElement;
                let boundsUnrounded = canvas.getBoundingClientRect();
                let bounds = { left: Math.floor(boundsUnrounded.left), top: Math.floor(boundsUnrounded.top) };
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
                let canvas = this.$root.paint.canvas.toolElement;
                let boundsUnrounded = canvas.getBoundingClientRect();
                let bounds = { left: Math.floor(boundsUnrounded.left), top: Math.floor(boundsUnrounded.top) };
                let initialX, initialY, currentX, currentY;
                this.dirtySelection = true;
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
                    let activeContext = this.$root.paint.canvas.activeContext;
                    activeContext.fillStyle = backgroundColor;
                    activeContext.fillRect(this.originalPosition.x, this.originalPosition.y, this.originalPosition.width, this.originalPosition.height);
                }
                context.putImageData(this.selectionData, this.$root.paint.state.selection.x, this.$root.paint.state.selection.y);
            },
            moveReleaseFunction(e) {
                let canvas = this.$root.paint.canvas.toolElement;
                let initialX, initialY, finalX, finalY;
                if (e.type === 'mouseup') {
                    let boundsUnrounded = canvas.getBoundingClientRect();
                    let bounds = { left: Math.floor(boundsUnrounded.left), top: Math.floor(boundsUnrounded.top) };
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
                    let activeContext = this.$root.paint.canvas.activeContext;
                    activeContext.fillStyle = backgroundColor;
                    activeContext.fillRect(this.originalPosition.x, this.originalPosition.y, this.originalPosition.width, this.originalPosition.height);
                }
                this.invertSelectionBorder(true);
                context.putImageData(this.selectionData, this.$root.paint.state.selection.x, this.$root.paint.state.selection.y);
            },
            updateSelection(transform) {
                this.dirtySelection = true;
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
                        let activeContext = this.$root.paint.canvas.activeContext;
                        activeContext.fillStyle = backgroundColor;
                        activeContext.fillRect(this.originalPosition.x, this.originalPosition.y, this.originalPosition.width, this.originalPosition.height);
                    }
                    this.setSelectionTransparency();
                    context.putImageData(this.selectionData, this.$root.paint.state.selection.x, this.$root.paint.state.selection.y);
                }
            },
            clearSelection(semaphore) {
                if (this.$root.paint.state.selection) {
                    this.invertSelectionBorder(false);
                    if (this.dirtySelection) { // Only commit the drawing for undo if it has been moved or transformed
                        let undoCanvas = this.$root.paint.canvas.undoElement;
                        let undoContext = this.$root.paint.canvas.undoContext;
                        undoContext.clearRect(0, 0, undoCanvas.width, undoCanvas.height);
                        if (!this.pasted) {
                            undoContext.fillStyle = backgroundColor;
                            undoContext.fillRect(this.originalPosition.x, this.originalPosition.y, this.originalPosition.width, this.originalPosition.height);
                        }
                        this.setSelectionTransparency();
                        this.compensateTransparentOverlap();
                        undoContext.putImageData(this.selectionData, this.$root.paint.state.selection.x, this.$root.paint.state.selection.y);
                        this.commitDrawing();
                    }
                    this.$root.paint.state.selection = null;
                    let canvas = this.$root.paint.canvas.toolElement;
                    let context = this.$root.paint.canvas.toolContext;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context = this.$root.paint.canvas.activeContext;
                    canvas = this.$root.paint.canvas.activeElement;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                }
                this.$root.$emit('selection-cleared', semaphore);
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
                    let canvasDivUnrounded = this.$root.paint.canvas.toolElement.parentElement.getBoundingClientRect();
                    let canvasDiv = { width: Math.floor(canvasDivUnrounded.width), height: Math.floor(canvasDivUnrounded.height) };
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
                    this.dirtySelection = true;
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
                                // This code attempts to prevent a bug where the border shows up as a white dotted line against the
                                // background during drag (the border should be invisible) while transparent selection is enabled.
                                // This code introduces a new bug where the border persists after the selection has been cleared
                                // in the area that overlaps the original selection position and the final selection position.
                                // if (this.$root.paint.options.transparentSelection && this.isBackgroundColor(originalData, offset)) {
                                //     data[offset + 3] = 0;
                                // }
                                // else {
                                    data[offset] = originalData[offset];
                                    data[offset + 1] = originalData[offset + 1];
                                    data[offset + 2] = originalData[offset + 2];
                                    data[offset + 3] = originalData[offset + 3];
                                // }
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
            compensateTransparentOverlap() {
                // I tried a few implementatons of select, drag, and release with transparent selection before I got to
                // the solution that is currently implemented. The current solution just sets the alpha to 0 for all 
                // pixels that are deemed a background color. This leaves one bug, which I will describe. During an 
                // original selection move, there should be a hole left behind where the selection was grabbed from. To
                // accomplish this, I draw a rectangle that is filled with the background color. Only, once I call put-
                // ImageData, any pixel that is transparent that overlaps this white rectangle also becomes transparent,
                // allowing visibility to the draw canvas underneath. Therefore, I have to compensate for this two ways:
                // 
                // - Draw a background colored rectangle on the active canvas instead of the tool canvas
                // - Call this method when the selection is cleared and committed to the undo and draw canvases. This
                // solution checks for transparency selected and overlap between the hole and the current selection
                // position. If there is overlap and transparency, each background pixel has its opacity set back to 
                // opaque (255 Alpha) instead of transparent (0 Alpha).
                if (this.$root.paint.options.transparentSelection) {
                    if (this.isSelectionOverlapsOriginal()) {
                        // Brute force method for now to determine the overlap section
                        let x, y, offset, drawX, drawY;
                        let selectionX = this.$root.paint.state.selection.x;
                        let selectionY = this.$root.paint.state.selection.y;
                        let width = this.$root.paint.state.selection.width;
                        let height = this.$root.paint.state.selection.height;
                        let data = this.selectionData.data;
                        for (y = 0; y < height; y++) {
                            for (x = 0; x < width; x++) {
                                drawX = selectionX + x;
                                drawY = selectionY + y;
                                if (
                                    drawX >= this.originalPosition.x && 
                                    drawY >= this.originalPosition.y &&
                                    drawX < this.originalPosition.x + this.originalPosition.width &&
                                    drawY < this.originalPosition.y + this.originalPosition.height
                                ) {
                                    offset = 4 * (y * width + x);
                                    // Ensure opacity by setting Alpha to 255
                                    data[offset + 3] = 255;
                                }
                            }
                        }
                    }
                }
            },
            isSelectionOverlapsOriginal() {
                let l1 = {
                    x: this.$root.paint.state.selection.x,
                    y: this.$root.paint.state.selection.y
                };
                let r1 = {
                    x: l1.x + this.$root.paint.state.selection.width - 1,
                    y: l1.y + this.$root.paint.state.selection.height - 1
                };
                let l2 = {
                    x: this.originalPosition.x,
                    y: this.originalPosition.y
                };
                let r2 = {
                    x: l2.x + this.originalPosition.width - 1,
                    y: l2.y + this.originalPosition.height - 1
                };

                return (l1.x < r2.x && l2.x < r1.x) && (l1.y < r2.y && l2.y < r1.y);
            },
            // This is a threshold way to evaluate white as a background. This could be replaced with the toleranceEqual
            // method used by flood fill
            isBackgroundColor(array, offset) {
                return (array[offset] + array[offset + 1] + array[offset + 2] >= 750); 
            },
            buildDashPattern() {
                let context = this.$root.paint.canvas.toolContext;
                this.dashPattern = context.createPattern(img, 'repeat');
            }
        }
    }
</script>