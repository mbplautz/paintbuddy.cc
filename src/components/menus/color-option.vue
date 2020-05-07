<template>
    <div class="color-option-border" :style="`border-color: ${isSelected() ? '#64a5e7' : '#a0a0a0'};`" @click="select()">
        <div class="color-option" :style="`background-color: ${color};`"></div>
    </div>
</template>

<script>
    export default {
        props: {
            color: {
                type: String,
                default: ''
            }
        },
        methods: {
            isSelected() {
                return this.$root.paint.options.color === this.color;
            },
            select() {
                this.$root.paint.state.setColor(this.color);
                this.$root.$emit('hide-popup', 'color-menu');
            }
        }
    }
</script>

<style>
    div.color-option {
        width: 24px;
        height: 24px;
    }

    div.color-option-border {
        padding: 2px 2px 2px 2px;
        margin: 2px 2px 2px 2px;
        border-left: 1px solid;
        border-right: 1px solid;
        border-top: 1px solid;
        border-bottom: 1px solid;
        display: inline-block;
    }
</style>