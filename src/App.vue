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
                drawing: false,
                dirty: false,
                _colorTo: null,
                _lineWidthTo: null
                
            }
        };
        // Debug
        window.Vue = this.$root;
    },
    mounted() {
        this.$root.paint.state.setColor(this.$root.paint.options.color);
        this.$root.paint.state.setLineWidth(this.$root.paint.options.lineWidth);
        this.$root.$on('drawing-released', () => {
            if (!!this.$root.paint.state._colorTo) {
                this.$root.paint.state.setColor(this.$root.paint.state._colorTo);
            }
            if (!!this.$root.paint.state._lineWidthTo) {
                this.$root.paint.state.setLineWidth(this.$root.paint.state._lineWidthTo);
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