<script>
import ActionButton from './action-button.vue';

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
                console.log('Redo clicked');
                this.$root.paint.state.redo();
            },
            isEnabled() {
                return this.$root.paint.state.canRedo;
            }
        }
    }
</script>