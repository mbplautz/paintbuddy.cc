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
                name: 'Button1',
                icon: 'fas fa-address-card'
            }
        },
        // mixins: [
        //     ParentComponent
        // ],
        extends: ParentComponent,
        methods: {
            select() {
                // ParentComponent.methods.select.call(this);
                console.log('Button1 sub-component clicked');
            }
        }
    }
</script>