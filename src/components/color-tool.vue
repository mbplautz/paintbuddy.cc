<template>
    <div class="color-tool" @click="click()">
        <div class="toolbar-button">
            <div class="color-icon" :style="$root.paint.options.color | colorFilter" ref="toolbar-button"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selected: false
            };
        },
        methods: {
            click() {
                let name = 'color-menu';
                let element = this.$refs['toolbar-button'];
                this.$root.$emit('show-popup', {
                    name,
                    element
                });
            }
        },
        filters: {
            colorFilter(value) {
                return `background-color: ${value};`;
            }
        }
    }
</script>