<template>
    <div :class="['main-menu-option', name]" @click="click()">
        <div class="menu-option-icon">
            <i :class="icon">{{ligature}}</i>
        </div>
        <div class="menu-option-name">
            {{optionName}}
        </div>
    </div>
</template>

<script>
    const backgroundColor = '#ffffff'; // TODO: Centralize background color

    export default {
        data() {
            return {
                icon: '',
                name: '',
                optionName: '',
                ligature: ''
            }
        },
        methods: {
            click() {
            },
            new() {
                this.$root.paint.state.resetState();
                // Put a cover underneath the draw canvas on the undo canvas to prevent any flashing while resetting other canvases
                let canvas = this.$root.paint.canvas.undoElement;
                let context = this.$root.paint.canvas.undoContext;
                context.fillStyle = backgroundColor;
                context.fillRect(0, 0, canvas.width, canvas.height);
                ['draw', 'active', 'tool'].forEach(canvas => {
                    // Reset each canvas by changing the width to what it already is
                    this.$root.paint.canvas[`${canvas}Element`].width = this.$root.paint.canvas[`${canvas}Element`].width;
                })
                // Draw the background for the draw canvas
                context = this.$root.paint.canvas.drawContext;
                context.fillStyle = backgroundColor;
                context.fillRect(0, 0, canvas.width, canvas.height);
                // Now reset the undo canvas
                this.$root.paint.canvas.undoElement.width = this.$root.paint.canvas.undoElement.width;
                // Set the color back to what it was
                this.$root.paint.state.setColor(this.$root.paint.options.color);
                this.$root.paint.state.setLineWidth(this.$root.paint.options.lineWidth);
            }
        }
    }
</script>

<style>
    div.main-menu-option {
        height: 50px;
        width: 320px;
        display: table;
        font-size: 36px;
        vertical-align: middle;
        color: #000000;
        background-color: #eeeeee;
        margin: 3px;
    }

    div.main-menu-option div.menu-option-icon {
        display: table-cell;
        width: 50px;
    }

    div.main-menu-option div.menu-option-name {
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        padding-left: 2px;
        font-size: 24px;
    }
</style>