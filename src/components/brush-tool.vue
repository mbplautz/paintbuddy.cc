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
                name: 'Brush',
                icon: 'fas fa-paint-brush'
            }
        },
        extends: EditTool,
        methods: {
            select() {
                console.log('Brush Tool clicked');
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