<template>
    <div class="transparent-selection-tool">
        <div class="toolbar-button option-tool" @click="click()" ref="toolbar-button">
            <div class="transparent-selection-icon option-icon">
                <div :class="['option', isTransparentSelection() ? '' : 'selected-option']">
                    <div class="no-fill-option"></div>
                </div>
                <div :class="['option', isTransparentSelection() ? 'selected-option' : '']">
                    <div class="fill-option"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            isTransparentSelection() {
                return this.$root.paint.options.transparentSelection;
            },
            click() {
                let name = 'transparent-selection-menu';
                let element = this.$refs['toolbar-button'];
                this.$root.$emit('show-popup', {
                    name,
                    element 
                });
            },
        }
    }
</script>

<style>
    div.transparent-selection-icon {
        width: inherit;
        height: 50%;
        display: table;
    }

    div.transparent-selection-icon div.option {
        display: table-cell;
        width: 50%;
        height: inherit;
    }

    div.transparent-selection-icon div.option.selected-option {
        background-color: #cee9fe;
    }

    div.transparent-selection-icon div.option div {
        width: inherit;
        height: inherit;
        border-style: solid;
        border-color: #000000;
        border-width: 1px;
    }

    div.transparent-selection-icon div.option div.fill-option {
        border-style: dashed;
    }

</style>