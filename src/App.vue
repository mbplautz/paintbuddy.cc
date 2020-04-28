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
            }
        };
        // Debug
        window.Vue = this.$root;
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