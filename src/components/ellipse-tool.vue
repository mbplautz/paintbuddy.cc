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
                name: 'Ellipse',
                icon: 'far fa-circle'
            }
        },
        extends: EditTool,
        methods: {
            select() {
                console.log('Ellipse Tool clicked');
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