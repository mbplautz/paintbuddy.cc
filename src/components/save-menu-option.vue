<script>
    import MenuOption from './menu-option.vue';

    export default {
        data() {
            return {
                icon: 'far fa-save',
                name: 'save',
                optionName: 'Save'
            }
        },
        extends: MenuOption,
        mounted() {

        },
        methods: {
            click() {
                this.$root.$emit('hide-popup', 'main-menu');
                // canvas.toDataURL("image/png");  // get the data URL
            }
        }
    };
</script>