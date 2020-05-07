<template>
    <div :class="name">
        <div :class="['toolbar-button', selected ? 'selected-item' : '']" @click="click()">
            <div class="shape-icon svg-container" ref="toolbar-button">
                <svg width="100%" viewBox="0 0 100 100">
                    <polygon stroke='#000000' stroke-width="6" fill="none" :points="$root.paint.options.selectedShape | pointFilter" />
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
import EditButton from '../buttons/edit-button.vue';
import Shape from '../../module/shape';

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
                name: 'shape',
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
            }
        },
        extends: EditButton,
        methods: {
            select() {
                console.debug('Shape Tool clicked');
                let name = 'shape-menu';
                let element = this.$refs['toolbar-button'];
                this.$root.$emit('show-popup', {
                    name,
                    element
                });
            },
            touchFunction(e) {
                let canvas = this.$root.paint.canvas.activeElement;
                let bounds = canvas.getBoundingClientRect();
                let x, y;
                if (e.type === 'mousedown') {
                    this.mouse.initialX = e.clientX - bounds.left;
                    this.mouse.initialY = e.clientY - bounds.top;
                    x = this.mouse.initialX;
                    y = this.mouse.initialY;
                }
                else if (e.type === 'touchstart') {
                    // For the shape tool, we only use the first touch if there are multiple touches
                    this.touch.initialX = e.touches[0].clientX - bounds.left;
                    this.touch.initialY = e.touches[0].clientY - bounds.top;
                    this.touch.finalX = this.touch.initialX;
                    this.touch.finalY = this.touch.initialY;
                    x = this.touch.initialX;
                    y = this.touch.initialY;
                }
                let context = this.$root.paint.canvas.activeContext;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
                context.rect(x, y, 1, 1);
                context.stroke();
            },
            dragFunction(e) {
                let canvas = this.$root.paint.canvas.activeElement;
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
                let context = this.$root.paint.canvas.activeContext;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
                let width = currentX - initialX;
                let height = currentY - initialY;
                context.beginPath();
                //context.rect(initialX, initialY, width, height);
                this.drawShape(initialX, initialY, width, height, context);
                if (this.$root.paint.options.filledPolygon) {
                    context.fill();
                }
                else {
                    context.stroke();
                }
            },
            releaseFunction(e) {
                let canvas = this.$root.paint.canvas.activeElement;
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
                let context = this.$root.paint.canvas.activeContext;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context = this.$root.paint.canvas.undoContext;
                canvas = this.$root.paint.canvas.undoElement;
                context.clearRect(0, 0, canvas.width, canvas.height);
                let width = finalX - initialX;
                let height = finalY - initialY;
                context.beginPath();
                //context.rect(initialX, initialY, width, height);
                this.drawShape(initialX, initialY, width, height, context);
                if (this.$root.paint.options.filledPolygon) {
                    context.fill();
                }
                else {
                    context.stroke();
                }
                this.commitDrawing();
            },
            drawShape(x1, y1, width, height, context) {
                let selectedShape = this.$root.paint.options.selectedShape;
                let points = Shape[selectedShape];
                if (!points) {
                    console.warn(`Invalid shape "${selectedShape}" selected`);
                    return;
                }
                let drawPoints = points.map(point => ({
                    x: x1 + point.x * width,
                    y: y1 + point.y * height
                }));
                context.beginPath();
                context.moveTo(drawPoints[0].x, drawPoints[0].y);
                let index;
                for (index = 1; index < drawPoints.length; index++) {
                    context.lineTo(drawPoints[index].x, drawPoints[index].y);
                }
                context.closePath();
            }
        },
        filters: {
            pointFilter(val) {
                let points = Shape[val] || [];
                return points.reduce((prev, curr) => prev + `${curr.x * 100},${curr.y * 100} `, '');
            }
        }
    }
</script>

<style>
    div.shape-icon {
        position: relative;
        top: 3px;
    }
</style>