<script>
    import ToolbarButton from './toolbar-button.vue';

    export default {
        data() {
            return {
                name: 'paste',
                icon: 'far fa-clipboard'
            }
        },
        extends: ToolbarButton,
        methods: {
            click() {
                this.$root.$emit('paste-selection');
                this.$root.$emit('hide-popup', 'copy-menu');
            },
            isEnabled() {
                return !!this.$root.paint.state.copySelection;
            }
        }
    }
</script>