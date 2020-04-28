<script>
import ActionButton from './action-button.vue';

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
                console.log('Undo clicked');
            }
        }
    }
</script>