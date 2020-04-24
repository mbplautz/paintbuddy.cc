<script>
import ToolbarButton from './toolbar-button.vue';

    export default {
        data() {
            return {
                name: 'undo-button',
                icon: 'fas fa-undo'
            };
        },
        extends: ToolbarButton,
        methods: {
            click() {
                console.log('Undo clicked');
            }
        }
    }
</script>