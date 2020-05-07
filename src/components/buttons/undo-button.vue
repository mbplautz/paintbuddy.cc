<script>
import ActionButton from '../buttons/action-button.vue';

    export default {
        data() {
            return {
                name: 'undo-button',
                icon: 'fas fa-undo'
            };
        },
        extends: ActionButton,
        methods: {
            action() {
                console.debug('Undo clicked');
                this.$root.$emit('clear-selection');
                if (this.$root.paint.state.dirty) {
                    this.$root.paint.state.undo();
                }
            },
            isEnabled() {
                return this.$root.paint.state.dirty;
            }
        }
    }
</script>