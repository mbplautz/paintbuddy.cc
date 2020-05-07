<template>
    <div :class="['popup-container', name]">
        <div :class="['popup-overlay', visible ? 'popup-visible' : 'popup-invisible']" @click="hide()"></div>
        <div :class="['popup-menu', popupVisible ? 'popup-layer' : '']" :style="`top: ${heightOffset}px;${ visible ? '' : ` left: ${-width}px;`}${ initiallyHidden ? ' z-index: -5;' : ''}`" ref="popup-ref">
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                popupVisible: false,
                heightOffset: 0,
                width: 0,
                initiallyHidden: true,
                attachElement: null
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
            this.setLeft();
            window.addEventListener('resize', () => { this.setLeft(); this.setTop(); });
            this.$root.$on('unhide-popups', () => this.initiallyHidden = false);
        },
        methods: {
            show(element) {
                this.attachElement = element;
                this.setTop();
                this.visible = true;
                document.querySelector(`div.popup-container.${this.name} div.popup-menu`).style.left = '';
                // We have very specific criteria to meet, which is why we do what is below
                // The toolbar div is set to z-index 4
                // The popup-menu is set to z-index 3 when hidden
                // However, we need the overlay to be above the toolbar div when shown
                // And, we need the popup-menu to be above the overlay
                // But we want the popup-menu to appear to slide under the toolbar div when sliding
                // Therefore, the popup-menu stays at z-index 3 until it is fully out (i.e. after 250ms)
                // Upon which it changes to z-index 6, so it can be above the overlay which is at z-index 5
                // Both of which are above the toolbar div at z-index 4
                // Immediately upon calling hide, the overlay must totally disappear (z-index -2) and the
                // popup-menu must go back to z-index 3 so it can slide under the toolbar div (still at z-index 4)
                setTimeout(() => this.popupVisible = true, 250);
            },
            hide() {
                this.visible = false;
                this.popupVisible = false;
                document.querySelector(`div.popup-container.${this.name} div.popup-menu`).style.left = `${-this.width}px`;            
            },
            setLeft() {
                let popupRef = this.$refs['popup-ref'];
                let bounds = popupRef.getBoundingClientRect();
                this.width = bounds.width;
            },
            setTop() {
                if (this.attachElement) {
                    let rect = this.attachElement.getBoundingClientRect();
                    this.heightOffset = rect.top;
                }
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

    div.popup-menu {
        position: fixed;
        border: solid 1px #888;
        transition: left ease 250ms;
        z-index: 3;
    }

    div.popup-overlay.popup-invisible {
        z-index: -2;
    }

    div.popup-overlay.popup-visible {
        z-index: 5;
    }

    div.popup-menu.popup-layer {
        z-index: 6;
    }
</style>