<template>
    <div id="app">
        <div class="paint-background"></div>
        <paint-toolbar />
        <paint-canvas />
    </div>
</template>

<script>
import PaintToolbar from './components/paint-toolbar.vue';
import PaintCanvas from './components/paint-canvas.vue';

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
                transparentSelection: true,
                filledPolygon: false
            },
            canvas: {
                activeElement: null,
                activeContext: null,
                drawElement: null,
                drawContext: null,
                getPointOffset: null
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
                drawing: false,
                dirty: false,
                _colorTo: null,
                _lineWidthTo: null,
                _touchFunctionsTo: null
            }
        };
        // Debug
        window.Vue = this.$root;
    },
    mounted() {
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

<style>
    .paint-background {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: -1;
        background-color: #fff;
    }
</style>