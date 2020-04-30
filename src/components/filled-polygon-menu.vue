<template>
    <popup-tool name="filled-polygon-menu">
        <div class="filled-polygon-select">
            <div :class="['option', isFill() ? '' : 'selected-option']" @click="setFill(false)">
                <div class="no-fill-option"></div>
            </div>
            <div :class="['option', isFill() ? 'selected-option' : '']" @click="setFill(true)">
                <div class="fill-option"></div>
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
    div.filled-polygon-select {
        display: table;
    }

    div.filled-polygon-select div.option {
        display: table-cell;
        width: 50px;
        height: 50px;
        background-color: #ffffff;
    }

    div.filled-polygon-select div.option.selected-option {
        background-color: #cee9fe;
    }

    div.filled-polygon-select div.option div {
        border-radius: 25px;
        width: 40px;
        height: 40px;
        border-style: solid;
        border-color: #000000;
        border-width: 3px;
        margin: 3px 3px 3px 3px;
    }

    div.filled-polygon-select div.option div.fill-option {
        background-color: #000000;
    }
</style>