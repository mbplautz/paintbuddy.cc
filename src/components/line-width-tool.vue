<template>
    <div class="line-width-tool" @click="click()">
        <div class="toolbar-button">
            <div class="line-width-icon svg-container" ref="options-tool-ref">
                <svg viewbox="0 0 32 32" preserveAspectRatio="xMinYMin meet" class="svg-content">
                    <g>
                        <line x1="0" y1="2" x2="31" y2="2" style="stroke:rgb(0, 0, 0);stroke-width:1;"></line>
                        <line x1="0" y1="7" x2="31" y2="7" style="stroke:rgb(0, 0, 0);stroke-width:3;"></line>
                        <line x1="0" y1="15" x2="31" y2="15" style="stroke:rgb(0, 0, 0);stroke-width: 5;"></line>
                        <line x1="0" y1="25" x2="31" y2="25" style="stroke:rgb(0, 0, 0);stroke-width: 7;"></line>
                    </g>
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            // Force a DOM refresh to get the SVG to scale properly. I dunno why it works, it's just what I noticed
            let element = document.querySelector('div.line-width-icon.svg-container');
            element.innerHTML = element.innerHTML;
            this.$root.paint.refs['options-tool-ref'] = this.$refs['options-tool-ref'];
        },
        methods: {
            click() {
                let name = 'line-width-menu';
                let element = document.querySelector('div.line-width-icon');
                this.$root.$emit('show-popup', {
                    name,
                    element
                });
            }
        }
    }
</script>