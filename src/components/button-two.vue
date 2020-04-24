<script>
import ParentComponent from './parent-component.vue';
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
                name: 'Button2',
                icon: 'fas fa-anchor'
            }
        },
        // mixins: [
        //     ParentComponent
        // ],
        extends: ParentComponent,
        methods: {
            select() {
                // ParentComponent.methods.select.call(this);
                console.log('Button2 sub-component clicked');
            }
        }
    }
</script>