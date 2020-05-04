<script>
    import ToolbarButton from './toolbar-button.vue';

    export default {
        data() {
            return {
                name: 'copy-menu',
                icon: 'far fa-clone'
            };
        },
        extends: ToolbarButton,
        methods: {
            click() {
//                if (this.isEnabled()) {
                    let name = 'copy-menu';
                    let element = document.querySelector('div.copy-menu div.toolbar-button');
                    this.$root.$emit('show-popup', {
                        name,
                        element
                    });
//                }
            },
            isEnabled() {
                return !!this.$root.paint.state.copySelection || !!this.$root.paint.state.selection;
            }
        }
    };
</script>