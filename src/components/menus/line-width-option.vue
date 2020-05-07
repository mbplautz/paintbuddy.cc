<template>
    <div :class="['line-width-option', isSelected() ? 'line-width-selected' : '']" @click="click()">
        <div class="line-width-display" :style="lineWidth | lineWidthFilter"></div>
    </div>
</template>

<script>
    export default {
        props: {
            lineWidth: {
                type: Number,
                default: 1.0
            }
        },
        methods: {
            isSelected() {
                return this.$root.paint.options.lineWidth === this.lineWidth;
            },
            click() {
                this.$root.paint.state.setLineWidth(this.lineWidth);
                this.$root.$emit('hide-popup', 'line-width-menu');
            }
        },
        filters: {
            lineWidthFilter(val) {
                return `height: ${val}px;`;
            }
        }
    };
</script>

<style>
    div.line-width-option {
        width: 126px;
        height: 38px;
        background-color: #ffffff;
        border: 1px solid #ffffff;
        position: relative;
    }

    div.line-width-option.line-width-selected {
        background-color: #cee5fc;
        border-color: #64a5e6;
    }

    div.line-width-display {
        width: 120px;
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%,-50%);
        background: #000000;
    }
</style>