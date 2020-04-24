<script>
    import $ from 'jquery';
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
                $(`div.${this.name} div.toolbar-button`).addClass('selected-item');
                this.selected = true;
                this.select();
            },
            deselect(buttonGroup) {
                if (buttonGroup === this.buttonGroup) {
                     this.selected = false;
                     $(`div.${this.name} div.toolbar-button`).removeClass('selected-item');
                     console.log(`${this.name} has been deselected`);
                }
            }
        }
    }
</script>