<script>
import ActionButton from './action-button.vue';

    export default {
        data() {
            return {
                name: 'menu-button',
                icon: 'fas fa-bars'
            };
        },
        extends: ActionButton,
        methods: {
            action() {
                console.log('Menu clicked');
            }
        }
    }
</script>