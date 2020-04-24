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
                name: 'Rectangle',
                icon: 'far fa-square'
            }
        },
        extends: EditTool,
        methods: {
            select() {
                console.log('Rectangle Tool clicked');
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