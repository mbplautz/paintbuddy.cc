<script>
    import MenuOption from '../menu-options/menu-option.vue';

    export default {
        data() {
            return {
                icon: 'far fa-comment-alt',
                name: 'about',
                optionName: 'About PaintBuddy.cc'
            }
        },
        extends: MenuOption,
        mounted() {

        },
        methods: {
            click() {
                this.$root.$emit('hide-popup', 'main-menu');
                this.$root.$emit('show-dialog', 'about-dialog');
            }
        }
    };
</script>