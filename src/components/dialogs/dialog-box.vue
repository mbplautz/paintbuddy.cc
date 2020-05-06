<template>
    <div :class="['dialog-box-container', name, visible ? 'dialog-box-visible' : 'dialog-box-invisible']">
        <div class="dialog-box-outer">
            <div class="dialog-box-overlay"></div>
            <div class="dialog-box-window-container" @click="hide()">
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                visible: false
            }
        },
        props: {
            name: {
                type: String,
                default: ''
            }
        },
        mounted() {
            this.$root.$on('show-dialog', dialogName => {
                if (dialogName === this.name) {
                    this.show();
                }
            });
            this.$root.$on('hide-dialog', dialogName => {
                if (dialogName === this.name) {
                    this.hide();
                }
            });
        },
        methods: {
            show() {
                this.visible = true;
            },
            hide() {
                this.visible = false;
            },
        }
    };
</script>

<style>
    div.dialog-box-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: fixed;
        left: 0;
        top: 0;
    }

    div.dialog-box-container div.dialog-box-outer {
        position: relative;
        width: 100%;
        height: 100%;
    }

    div.dialog-box-container div.dialog-box-outer div.dialog-box-overlay {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #bbbbbb;
        opacity: 0.5;
    }

    div.dialog-box-container div.dialog-box-outer div.dialog-box-window-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
    }    

    div.dialog-box-container.dialog-box-invisible {
        z-index: -7;
    }

    div.dialog-box-container.dialog-box-visible {
        z-index: 7;
    }
</style>