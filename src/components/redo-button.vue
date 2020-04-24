<script>
import ToolbarButton from './toolbar-button.vue';

    export default {
        data() {
            return {
                name: 'redo-button',
                icon: 'fas fa-redo'
            };
        },
        extends: ToolbarButton,
        methods: {
            click() {
                console.log('Redo clicked');
            }
        }
    }
</script>