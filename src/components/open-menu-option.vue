<script>
    import MenuOption from './menu-option.vue';

    export default {
        data() {
            return {
                icon: 'far fa-folder-open',
                name: 'open',
                optionName: 'Open',
                fileInputElement: null
            }
        },
        extends: MenuOption,
        mounted() {
            this.$root.$on('action-open', this.open);
            this.fileInputElement = document.createElement('input');
            this.fileInputElement.type = 'file';
            this.fileInputElement.addEventListener('change', this.processFile);
        },
        methods: {
            click() {
                this.$root.$emit('hide-popup', 'main-menu');
                if (this.$root.paint.state.dirty) {
                    Object.assign(this.$root.paint.state.confirm, {
                        confirmDialog: true,
                        message: ['There are unsaved changes to this drawing.', 'Are you sure you want to discard the drawing?'],
                        confirmAction: 'action-open' 
                    });
                    this.$root.$emit('show-confirm-dialog');
                }
                else {
                    this.open();
                }
            },
            open() {
                this.fileInputElement.click();
            },
            processFile() {
                if (window.File && window.FileReader) {
                    // Taken from SO answer https://stackoverflow.com/a/13939150/1733377
                    const createImage = () => {
                        img = new Image();
                        img.onload = imageLoaded;
                        img.src = fr.result;
                    };
                    const imageLoaded = () => {
                        this.new();
                        let context = this.$root.paint.canvas.drawContext;
                        context.drawImage(img, 0, 0);
                    };
                    let file = this.fileInputElement.files[0];
                    let fr = new FileReader();
                    let img;
                    fr.onload = createImage;   // onload fires after reading is complete
                    fr.readAsDataURL(file);    // begin reading
                }
                else {
                    this.$root.paint.state.confirm.confirmDialog = false;
                    this.$root.paint.state.confirm.message = [
                        "Uh oh, there's an error!", 
                        'Your web browser does not support this feature', 
                        'If possible, please use this app in a modern web browser like Google Chrome, Firefox, or Safari'
                    ];
                    this.$root.$emit('show-confirm-dialog');
                }
            }
        }
    };
</script>