<template>
    <popup-menu name="transparent-selection-menu">
        <div class="transparent-selection-select">
            <div :class="['option', isTransparentSelection() ? '' : 'selected-option']" @click="setTransparentSelection(false)">
                <div class="no-fill-option"></div>
            </div>
            <div :class="['option', isTransparentSelection() ? 'selected-option' : '']" @click="setTransparentSelection(true)">
                <div class="fill-option"></div>
            </div>
        </div>
    </popup-menu>
</template>

<script>
    import PopupMenu from '../menus/popup-menu.vue';
    import LineWidthOption from '../menus/line-width-option.vue';

    export default {
        components: {
            PopupMenu
        },
        methods: {
            isTransparentSelection() {
                return this.$root.paint.options.transparentSelection;
            },
            setTransparentSelection(val) {
                this.$root.paint.options.transparentSelection = val;
                this.$root.$emit('hide-popup', 'transparent-selection-menu');
                this.$root.$emit('update-selection');
            }
        }
    };
</script>

<style>
    div.transparent-selection-select {
        display: table;
    }

    div.transparent-selection-select div.option {
        display: table-cell;
        width: 50px;
        height: 50px;
        background-color: #ffffff;
    }

    div.transparent-selection-select div.option.selected-option {
        background-color: #cee9fe;
    }

    div.transparent-selection-select div.option div {
        width: 40px;
        height: 40px;
        border-style: solid;
        border-color: #000000;
        border-width: 3px;
        margin: 3px 3px 3px 3px;
    }

    div.transparent-selection-select div.option div.fill-option {
        border-style: dashed;
    }
</style>