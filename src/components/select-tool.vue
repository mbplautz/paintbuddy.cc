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
                name: 'select',
                icon: 'fas fa-mouse-pointer'
            }
        },
        extends: EditTool,
        methods: {
            select() {
                console.log('Select Tool clicked');
            },
            touchFunction() {

            },
            dragFunction() {

            },
            releaseFunction() {

            }
        }
    }
</script>