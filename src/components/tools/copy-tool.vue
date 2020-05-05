<script>
    import ToolbarButton from '../buttons/toolbar-button.vue';

    export default {
        data() {
            return {
                name: 'copy',
                icon: 'far fa-copy'
            }
        },
        extends: ToolbarButton,
        methods: {
            click() {
                this.$root.$emit('copy-selection');
                this.$root.$emit('hide-popup', 'copy-menu');
            },
            isEnabled() {
                return !!this.$root.paint.state.selection;
            }
        }
    }
</script>