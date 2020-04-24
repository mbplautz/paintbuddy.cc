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
    components: {
        PaintToolbar,
        PaintCanvas
    }
}
</script>