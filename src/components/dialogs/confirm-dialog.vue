<template>
    <dialog-box name="confirm-dialog">
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
    </dialog-box>
</template>

<script>
    import DialogBox from '../dialogs/dialog-box.vue';

    export default {
        components: {
            DialogBox
        },
        mounted() {
        },
        methods: {
            action() {
                this.hide();
                this.$root.$emit(this.$root.paint.state.confirm.confirmAction);
            },
            hide() {
                this.$root.$emit('hide-dialog', 'confirm-dialog');
            },
            ordinate(array) {
                return (Array.isArray(array) ? array : [array]).map((element, index) => ({ element, index }));
            }
        }
    };
</script>

<style>
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
</style>