<template>
    <div class="filled-polygon-tool">
        <div class="toolbar-button option-tool" @click="click()" ref="toolbar-button">
            <div class="filled-polygon-icon option-icon">
                <div :class="['option', isFill() ? '' : 'selected-option']">
                    <div class="no-fill-option"></div>
                </div>
                <div :class="['option', isFill() ? 'selected-option' : '']">
                    <div class="fill-option"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                iconWidth: 50
            }
        },
        mounted() {
        },
        methods: {
            isFill() {
                return this.$root.paint.options.filledPolygon;
            },
            click() {
                let name = 'filled-polygon-menu';
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
    div.filled-polygon-icon {
        width: inherit;
        height: 50%;
        display: table;
    }

    div.filled-polygon-icon div.option {
        display: table-cell;
        width: 50%;
        height: inherit;
    }

    div.filled-polygon-icon div.option.selected-option {
        background-color: #cee9fe;
    }

    div.filled-polygon-icon div.option div {
        border-radius: 25px;
        width: inherit;
        height: inherit;
        border-style: solid;
        border-color: #000000;
        border-width: 1px;
    }

    div.filled-polygon-icon div.option div.fill-option {
        background-color: #000000;
    }

</style>