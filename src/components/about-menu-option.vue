<script>
    import MenuOption from './menu-option.vue';

    export default {
        data() {
            return {
                icon: 'far fa-comment-alt',
                name: 'about',
                optionName: 'About Paintbuddy.cc'
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