<template>
    <div class="filled-polygon-tool">
        <div class="toolbar-button">
            <div :class="isFill() ? '' : 'selected-option'" @click="setFill(false)">
                <i class="far fa-circle"></i>
            </div>
            <div :class="isFill() ? 'selected-option' : ''" @click="setFill(true)">
                <i class="fas fa-circle"></i>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            isFill() {
                return this.$root.paint.options.filledPolygon;
            },
            setFill(val) {
                this.$root.paint.options.filledPolygon = val;
            }
        }
    }
</script>

<style>
    div.filled-polygon-tool div.toolbar-button div {
        display: inline-block;
        font-size: 50%;
    }
</style>