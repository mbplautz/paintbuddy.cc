<script>
    import MenuOption from '../menu-options/menu-option.vue';

    const reportIssueHtmlTemplate = `
        <p>Did you find an issue while using Paintbuddy.cc? Send an email to us and let us fix or address it! 
        Email us at <a href="mailto:dev@paintbuddy.cc">dev@paintbuddy.cc</a>.<p>
        <p>For those who have a GitHub account, you can 
        <a href="https://github.com/mbplautz/paintbuddy.cc/issues">open an issue directly on the code repository</a>.</p>
    `;

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
                this.$root.paint.state.confirm.confirmDialog = false;
                this.$root.paint.state.confirm.confirmAction = '';
                this.$root.paint.state.confirm.confirmOption = 'OK';
                this.$root.paint.state.confirm.template = reportIssueHtmlTemplate;
                this.$root.$emit('show-dialog', 'confirm-dialog');
            }
        }
    };
</script>

<style>
    div.main-menu-option.report-issue div.menu-option-icon i.material-icons {
        font-size: 36px;
    }
</style>