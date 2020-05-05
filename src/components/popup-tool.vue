<template>
    <div :class="['popup-container', name]">
        <div :class="['popup-overlay', visible ? 'popup-visible' : 'popup-invisible']" @click="hide()"></div>
        <div class="popup-tool" :style="`top: ${heightOffset}px;${ visible ? '' : ` left: ${-width}px;`}${ initiallyHidden ? ' z-index: -5;' : ''}`" ref="popup-ref">
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
                width: 0,
                initiallyHidden: true
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
            });
            this.$root.$on('hide-popup', (popupName) => {
                if (this.name === popupName) {
                    this.hide();
                }
            });
            let popupRef = this.$refs['popup-ref'];
            let bounds = popupRef.getBoundingClientRect();
            this.width = bounds.width;
            this.$root.$on('unhide-popups', () => this.initiallyHidden = false);
        },
        methods: {
            show(element) {
                let rect = element.getBoundingClientRect();
                this.heightOffset = rect.top;
                this.visible = true;
                document.querySelector(`div.popup-container.${this.name} div.popup-tool`).style.left = '';
            },
            hide() {
                this.visible = false;
                document.querySelector(`div.popup-container.${this.name} div.popup-tool`).style.left = `${-this.width}px`;            
            }
        }
    };
</script>

<style scoped>
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