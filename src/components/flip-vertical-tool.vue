<script>
    import ToolbarButton from './toolbar-button.vue';

    export default {
        data() {
            return {
                name: 'flip-vertical',
                icon: 'material-icons'
            }
        },
        extends: ToolbarButton,
        mounted() {
            this.$refs['icon-ref'].appendChild(document.createTextNode('flip'));
        },
        methods: {
            click() {
                this.$root.$emit('update-selection', this.transform);
                this.$root.$emit('hide-popup', 'copy-menu');
            },
            isEnabled() {
                return !!this.$root.paint.state.selection;
            },
            transform(imageData) {
                let width = this.$root.paint.state.selection.width;
                let height = this.$root.paint.state.selection.height;
                let data = imageData.data;
                let getPointOffset = (x, y) => 4 * (y * width + x);
                // We need to swap pixels only up to halfway through the image
                let flipBounds = Math.floor(height / 2);
                let x, y, offset, flipOffset, index, temp
                for (y = 0; y <= flipBounds; y++) {
                    for (x = 0; x < width; x++) {
                        offset = getPointOffset(x, y);
                        flipOffset = getPointOffset(x, height - 1 - y);
                        for (index = 0; index < 4; index++) {
                            temp = data[offset + index];
                            data[offset + index] = data[flipOffset + index];
                            data[flipOffset + index] = temp;
                        }
                    }
                }
                return imageData;
            }
        }
    }
</script>

<style>
    div.flip-vertical div.toolbar-button i.material-icons {
        transform: rotate(90deg);
    }

    div.toolbar-button i.material-icons {
        font-size: inherit;
        vertical-align: bottom;
    }
</style>