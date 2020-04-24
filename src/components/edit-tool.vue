<script>
    import ToolbarButton from './toolbar-button.vue';

    export default {
        data() {
            return {
                icon: '',
                selected: false
            }
        },
        extends: ToolbarButton,
        mounted() {
            this.$root.$on('deselect', this.deselect);
        },
        methods: {
            click() {
                this.$root.$emit('deselect', this.buttonGroup)
                this.selected = true;
                this.select();
            },
            deselect(buttonGroup) {
                if (buttonGroup === this.buttonGroup) {
                     this.selected = false;
                     console.log(`${this.name} has been deselected`);
                }
            }
        }
    }
</script>