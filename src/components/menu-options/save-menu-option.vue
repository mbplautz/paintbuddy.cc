<script>
    import MenuOption from '../menu-options/menu-option.vue';
    import SaveCanvas from '../../mixins/save-canvas.vue';

    export default {
        data() {
            return {
                icon: 'far fa-save',
                name: 'save',
                optionName: 'Save'
            }
        },
        extends: MenuOption,
        mixins: [SaveCanvas],
        mounted() {

        },
        methods: {
            click() {
                this.$root.$emit('hide-popup', 'main-menu');
                this.save('Drawing.png', false);
            }
        }
    };
</script>