<template>
    <div class="popup-container">
        <div :class="['popup-overlay', visible ? 'popup-visible' : 'popup-invisible']" @click="hide()"></div>
        <div class="popup-tool" :style="`top: ${heightOffset}px;${ visible ? '' : ` left: ${-width}px;`}`" ref="popup-ref">
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                heightOffset: 0,
                width: 0
            };
        },
        props: {
            name: {
                type: String,
                default: ''
            }
        },
        mounted() {
            this.$root.$on('show-popup', (popupElement) => {
                if (this.name === popupElement.name) {
                    this.show(popupElement.element);
                }
                this.$refs['popup-ref'].style.left = '';
            });
            this.$root.$on('hide-popup', (popupName) => {
                if (this.name === popupName) {
                    this.hide();
                }
            });
            let popupRef = this.$refs['popup-ref'];
            let bounds = popupRef.getBoundingClientRect();
            this.width = bounds.width;
            //popupRef.style.left = `${-this.width}px`;
        },
        methods: {
            show(element) {
                let rect = element.getBoundingClientRect();
                this.heightOffset = rect.top;
                this.visible = true;
                // this.$refs['popup-ref'].style.left = '';
            },
            hide() {
                this.visible = false;
                // this.$refs['popup-ref'].style.left = `${-this.width}px`;                
            }
        // },
        // filters: {
        //     style(top) {
        //         return `top: ${top}px;`;
        //     }
        }
    };
</script>

<style>
    div.popup-overlay {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: fixed;
        left: 0;
        top: 0;
    }

    div.popup-tool {
        position: fixed;
        border: solid 1px #888;
        transition: left ease 250ms;
        z-index: 6;
    }

    .popup-invisible {
        z-index: -2;
    }

    div.popup-overlay.popup-visible {
        z-index: 5;
    }

    div.popup-tool.popup-visible {
        z-index: 6;
    }
</style>