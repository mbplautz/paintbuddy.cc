<template>
    <div :class="['confirm-dialog-container', visible ? 'confirm-dialog-visible' : 'confirm-dialog-invisible']">
        <div class="confirm-dialog-outer">
            <div class="confirm-dialog-overlay" @click="hide()"></div>
            <div class="confirm-dialog-window-container">
                <div class="confirm-dialog-window">
                    <div class="message-panel">
                        <p v-for="item in ordinate($root.paint.state.confirm.message)" :key="item.index">
                            {{item.element}}
                        </p>
                    </div>
                    <div class="button-panel">
                        <div class="button-span">
                            <div class="button cancel-button" v-if="$root.paint.state.confirm.confirmDialog" @click="hide()">
                                <span>
                                    <i class="fas fa-times-circle"></i>
                                    Cancel
                                </span>
                            </div>
                            <div class="button confirm-button" @click="($root.paint.state.confirm.confirmDialog ? action : hide)()">
                                <span>
                                    <i class="fas fa-check-circle"></i>
                                    Confrm
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
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
        mounted() {
            this.$root.$on('show-confirm-dialog', this.show);
        },
        methods: {
            show() {
                this.visible = true;
            },
            hide() {
                this.visible = false;
            },
            action() {
                this.hide();
                this.$root.$emit(this.$root.paint.state.confirm.confirmAction);
            },
            ordinate(array) {
                return (Array.isArray(array) ? array : [array]).map((element, index) => ({ element, index }));
            }
        }
    };
</script>

<style>
    div.confirm-dialog-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: fixed;
        left: 0;
        top: 0;
    }

    div.confirm-dialog-container div.confirm-dialog-outer {
        position: relative;
        width: 100%;
        height: 100%;
    }

    div.confirm-dialog-container div.confirm-dialog-outer div.confirm-dialog-overlay {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #bbbbbb;
        opacity: 0.5;
    }

    div.confirm-dialog-container div.confirm-dialog-outer div.confirm-dialog-window-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
    }    

    div.confirm-dialog-window {
        width: 360px;
        margin: 0 auto;
        border: 3px solid #888888;
        border-radius: 10px;
        background-color: #eeeeee;
        padding: 5px;
        font-size: 22px;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
    }

    div.confirm-dialog-window div.message-panel {
        width: 300px;
        margin: 0 auto;
        font-size: 22px;
    }

    div.confirm-dialog-window div.button-panel {
        width: 100%;
        border-spacing: 10px;
        font-size: 20px;
    }

    div.confirm-dialog-window div.button-panel div.button-span {
        display: table;
        margin: 0 auto;
    }

    div.confirm-dialog-window div.button-panel div.button-span div.button {
        display: table-cell;
        color: #ffffff;
        background-color: #aaaaaa;
        border-radius: 10px;
        padding: 5px 20px;
    }

    div.confirm-dialog-window div.button-panel div.button-span div.button span {
        display: flex;
        align-items: center;
    }

    div.confirm-dialog-window div.button-panel div.button-span div.button span i {
        font-size: 36px;
        padding-right: 10px;
    }

    div.confirm-dialog-window div.button-panel div.button-span div.cancel-button span i {
        color: #ff2d19;
    }

    div.confirm-dialog-window div.button-panel div.button-span div.confirm-button span i {
        color: #258c1c;
    }    

    div.confirm-dialog-container.confirm-dialog-invisible {
        z-index: -7;
    }

    div.confirm-dialog-container.confirm-dialog-visible {
        z-index: 7;
    }
</style>