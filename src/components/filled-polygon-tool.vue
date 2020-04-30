<template>
    <div class="filled-polygon-tool" style="height: 25px;">
        <div class="toolbar-button" @click="click()">
            <div class="filled-polygon-icon svg-container"><!--  -->
                <svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewbox="0 0 32 16" preserveAspectRatio="xMinYMin meet" class="svg-content" width="36" height="16">
                    <rect x="0" y="0" width="16" height="16" fill="#cee9fe" v-show="!isFill()" />
                    <rect x="16" y="0" width="16" height="16" fill="#cee9fe" v-show="isFill()" />
                    <circle cx="8" cy="8" r="7" stroke="#000000" stroke-width="1" fill="none"/>
                    <circle cx="24" cy="8" r="7" fill="#000000" />
                </svg>
            </div>
            <!-- div class="filled-polygon-icon" :is="dynamicComponent"></div -->
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
            // Force a DOM refresh to get the SVG to scale properly. I dunno why it works, it's just what I noticed
            //let element = document.querySelector('div.filled-polygon-icon.svg-container div.front');
            //element.innerHTML = element.innerHTML;
            window.addEventListener('resize', this.setWidth);
        },
/*        computed: {
            dynamicComponent: () => {
                return {
                    template: `           
                <svg viewbox="0 0 32 16" preserveAspectRatio="xMinYMin meet" class="svg-content">
                    <rect x="0" y="0" width="16" height="16" fill="#cee9fe" v-show="!isFill()" />
                    <rect x="16" y="0" width="16" height="16" fill="#cee9fe" v-show="isFill()" />
                    <circle cx="8" cy="8" r="7" stroke="#000000" stroke-width="1" fill="none"/>
                    <circle cx="24" cy="8" r="7" fill="#000000" />
                </svg>
                    `,
                    methods: {
                        isFill() {
                            return this.$root.paint.options.filledPolygon;
                        }
                    }
                }
            }
        },
*/        methods: {
            isFill() {
                return this.$root.paint.options.filledPolygon;
            },
            setFill(val) {
                this.$root.paint.options.filledPolygon = val;
            },
            click() {
                let name = 'filled-polygon-menu';
                let element = document.querySelector('div.filled-polygon-tool div.toolbar-button');
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
    /* div.filled-polygon-icon.svg-container {
        position: relative;
    }

     div.filled-polygon-icon.svg-container div.behind, div.filled-polygon-icon.svg-container div.front {
        position: absolute;
        left: 0;
        top: 0;
        width: 50px;
        height: 25px;
    }

    div.filled-polygon-icon.svg-container div.behind div {
        display: inline-block;
        width: 25px;
        height: 25px;
    }

    div.filled-polygon-icon.svg-container div.behind div.selected {
        background-color: #cee9fe;
    } */
    
</style>