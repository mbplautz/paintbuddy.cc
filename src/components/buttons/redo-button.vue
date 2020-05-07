<script>
import ActionButton from '../buttons/action-button.vue';

    export default {
        data() {
            return {
                name: 'redo-button',
                icon: 'fas fa-redo'
            };
        },
        extends: ActionButton,
        methods: {
            action() {
                console.debug('Redo clicked');
                this.$root.$emit('clear-selection');
                this.$root.paint.state.redo();
            },
            isEnabled() {
                return this.$root.paint.state.canRedo;
            }
        }
    }
</script>