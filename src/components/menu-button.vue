<script>
import ToolbarButton from './toolbar-button.vue';

    export default {
        data() {
            return {
                name: 'menu-button',
                icon: 'fas fa-bars'
            };
        },
        extends: ToolbarButton,
        methods: {
            click() {
                console.log('Menu clicked');
            }
        }
    }
</script>