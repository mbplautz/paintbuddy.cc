<script>
import ActionButton from '../buttons/action-button.vue';

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
                console.debug('Menu clicked');
                let name = 'main-menu';
                let element = document.querySelector('div.menu-button div.toolbar-button');
                this.$root.$emit('show-popup', {
                    name,
                    element
                });
            }
        }
    }
</script>