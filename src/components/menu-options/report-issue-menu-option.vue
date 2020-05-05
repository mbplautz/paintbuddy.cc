<script>
    import MenuOption from '../menu-options/menu-option.vue';

    export default {
        data() {
            return {
                icon: 'material-icons',
                name: 'report-issue',
                optionName: 'Report an Issue',
                ligature: 'error_outline'
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
    div.main-menu-option.report-issue div.menu-option-icon i.material-icons {
        font-size: 36px;
    }
</style>