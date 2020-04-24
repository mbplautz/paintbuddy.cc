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
        return {
            touchFunction: () => {},
            dragFunction: () => {},
            releaseFunction: () => {},
            color: null
        };
    },
    components: {
        PaintToolbar,
        PaintCanvas
    }
}
</script>