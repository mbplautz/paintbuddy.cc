<script>
    import MenuOption from '../menu-options/menu-option.vue';

    export default {
        data() {
            return {
                icon: 'far fa-save',
                name: 'save-selection',
                optionName: 'Save Selection'
            }
        },
        extends: MenuOption,
        mounted() {

        },
        methods: {
            click() {
                this.$root.$emit('hide-popup', 'main-menu');
            }
        }
    };
</script>

<style>
    div.main-menu-option.save-selection div.menu-option-icon i {
        border: 3px dashed;
        padding: 2px;
    }
</style>