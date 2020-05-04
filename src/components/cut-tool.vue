<script>
    import ToolbarButton from './toolbar-button.vue';

    export default {
        data() {
            return {
                name: 'cut',
                icon: 'fas fa-cut'
            }
        },
        extends: ToolbarButton,
        methods: {
            click() {
                this.$root.$emit('cut-selection');
                this.$root.$emit('hide-popup', 'copy-menu');
            },
            isEnabled() {
                return !!this.$root.paint.state.selection;
            }
        }
    }
</script>