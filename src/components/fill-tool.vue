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
                name: 'Fill',
                icon: 'fas fa-fill-drip'
            }
        },
        extends: EditTool,
        methods: {
            select() {
                console.log('Fill Tool clicked');
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