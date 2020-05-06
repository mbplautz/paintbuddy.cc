<script>
    import MenuOption from '../menu-options/menu-option.vue';

    export default {
        data() {
            return {
                icon: 'far fa-file',
                name: 'new',
                optionName: 'New'
            }
        },
        extends: MenuOption,
        mounted() {
            this.$root.$on('action-new', this.new);
        },
        methods: {
            click() {
                this.$root.$emit('hide-popup', 'main-menu');
                if (this.$root.paint.state.dirty) {
                    Object.assign(this.$root.paint.state.confirm, {
                        confirmDialog: true,
                        message: ['There are unsaved changes to this drawing.', 'Are you sure you want to discard the drawing?'],
                        confirmAction: 'action-new' 
                    });
                    this.$root.$emit('show-dialog', 'confirm-dialog');
                }
                else {
                    this.new();
                }
            }
        }
    };
</script>