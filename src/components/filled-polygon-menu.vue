<template>
    <popup-tool name="filled-polygon-menu">
        <div class="filled-polygon-select">
            <div :class="['option', isFill() ? '' : 'selected-option']" @click="setFill(false)">
                <svg viewbox="0 0 50 50" width="50" height="50">
                    <circle cx="24" cy="24" r="12" stroke="#000000" stroke-width="1" fill="none" />
                </svg>
            </div>
            <div :class="['option', isFill() ? 'selected-option' : '']" @click="setFill(true)">
                <svg viewbox="0 0 50 50" width="50" height="50">
                    <circle cx="24" cy="24" r="12" stroke="#000000" stroke-width="1" fill="#000000" />
                </svg>
            </div>
        </div>
    </popup-tool>
</template>

<script>
    import PopupTool from './popup-tool.vue';
    import LineWidthOption from './line-width-option.vue';

    export default {
        components: {
            PopupTool,
        },
        methods: {
            isFill() {
                return this.$root.paint.options.filledPolygon;
            },
            setFill(fill) {
                this.$root.paint.options.filledPolygon = fill;
                this.$root.$emit('hide-popup', 'filled-polygon-menu');
            }
        }
    };
</script>

<style>
    div.filled-polygon-select div.option {
        display: inline-block;
        width: 50px;
        height: 50px;
        background-color: #ffffff;
    }

    div.filled-polygon-select div.option.selected-option {
        background-color: #cee9fe;
    }
</style>