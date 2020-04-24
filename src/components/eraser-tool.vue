<script>
import EditTool from './edit-tool.vue';

    export default {
        props: {
            buttonGroup: {
                type: String,
                default() {
                    return '';
                }
            }
        },
        data() {
            return {
                name: 'Eraser',
                icon: 'fas fa-eraser'
            }
        },
        extends: EditTool,
        methods: {
            select() {
                console.log('Eraser Tool clicked');
            },
            touchFunction(e) {

            },
            dragFunction(e) {

            },
            releaseFunction(e) {
                
            }
        }
    }
</script>