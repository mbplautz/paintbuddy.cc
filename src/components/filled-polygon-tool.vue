<template>
    <div class="filled-polygon-tool">
        <div class="toolbar-button" @click="click()" ref="toolbar-button">
            Fill
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
            setFill(val) {
                this.$root.paint.options.filledPolygon = val;
            },
            click() {
                let name = 'filled-polygon-menu';
                let element = this.$refs['toolbar-button'];
                this.$root.$emit('show-popup', {
                    name,
                    element 
                });
            },
            setWidth() {
                try {
                    let clientRect = this.$root.paint.refs['options-tool-ref'].getBoundingClientRect();
                    this.iconWidth = clientRect.width;
                } catch (e) {
                    this.iconWidth = 50;
                }
                console.log(this.iconWidth);
            }
        }
    }
</script>

<style>

</style>