<template>
    <div class="popup-container">
        <div :class="['popup-overlay', visible ? 'popup-visible' : 'popup-invisible']" @click="hide()"></div>
        <div :class="['popup-tool', visible ? 'popup-visible' : 'popup-invisible']" :style="`top: ${heightOffset}px;`">
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                heightOffset: 0
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
                    let rect = popupElement.element.getBoundingClientRect();
                    this.heightOffset = rect.top;
                    this.visible = true;
                }
            });
            this.$root.$on('hide-popup', (popupName) => {
                if (this.name === popupName) {
                    this.hide();
                }
            });
        },
        methods: {
            show(element) {

            },
            hide() {
                this.visible = false;
            }
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