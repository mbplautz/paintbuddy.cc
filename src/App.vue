<template>
    <div id="app">
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
                lineThickness: 3,
                transparentSelection: true,
                filledPolygon: false
            },
            canvas: {
                activeElement: null,
                activeContext: null,
                drawElement: null,
                drawContext: null
            }
        };
    },
    components: {
        PaintToolbar,
        PaintCanvas
    }
}
</script>