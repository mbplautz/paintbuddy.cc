<script>
    import ToolbarButton from './toolbar-button.vue';

    export default {
        data() {
            return {
                name: 'rotate-cw',
                icon: 'material-icons'
            }
        },
        extends: ToolbarButton,
        mounted() {
            this.$refs['icon-ref'].appendChild(document.createTextNode('rotate_90_degrees_ccw'));
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
                let canvas = this.$root.paint.canvas.toolElement;
                let data = imageData.data;
                let getRotatePointOffset = (x, y) => 4 * (y * height + x);
                // Find the center point on the canvas - we will rotate about that
                let centerX = 
                    this.$root.paint.state.selection.x + 
                    this.$root.paint.state.selection.width / 2;
                let centerY = 
                    this.$root.paint.state.selection.y +
                    this.$root.paint.state.selection.height / 2;
                // Flip the width and the height
                let newImageData = new ImageData(
                    new Uint8ClampedArray(data.length),
                    height,
                    width
                );
                let offset, rotateOffset, x = height - 1, y = 0;
                for (offset = 0; offset < data.length; offset += 4) {
                    rotateOffset = getRotatePointOffset(x, y);
                    newImageData.data[rotateOffset] = data[offset];
                    newImageData.data[rotateOffset + 1] = data[offset + 1];
                    newImageData.data[rotateOffset + 2] = data[offset + 2];
                    newImageData.data[rotateOffset + 3] = data[offset + 3];
                    y++;
                    if (y >= width) {
                        y = 0;
                        x--;
                    }
                }
                // Set new selection bounds
                this.$root.paint.state.selection.x = centerX - (height / 2);
                this.$root.paint.state.selection.y = centerY - (width / 2);
                this.$root.paint.state.selection.width = height;
                this.$root.paint.state.selection.height = width;
                // Try not the new bounds to appear off of the page
                let x2 = this.$root.paint.state.selection.x + this.$root.paint.state.selection.width;
                let y2 = this.$root.paint.state.selection.y + this.$root.paint.state.selection.height;
                if (x2 >= canvas.width) {
                    this.$root.paint.state.selection.x -= (x2 - canvas.width);
                }
                if (this.$root.paint.state.selection.x < 0) {
                    this.$root.paint.state.selection.x = 0;
                }
                if (y2 >= canvas.height) {
                    this.$root.paint.state.selection.y -= (y2 - canvas.height);
                }
                if (this.$root.paint.state.selection.y < 0) {
                    this.$root.paint.state.selection.y = 0;
                }
                return newImageData;
            }
        }
    }
</script>

<style>
    div.rotate-cw div.toolbar-button i.material-icons {
        transform: scaleX(-1);
    }
</style>