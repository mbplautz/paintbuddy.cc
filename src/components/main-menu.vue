<template>
    <popup-tool name="main-menu">
        <div class="main-menu-select">
            <new-menu-option />
            <save-menu-option />
            <save-selection-menu-option />
            <open-menu-option />
            <report-issue-menu-option />
            <about-menu-option />
        </div>
    </popup-tool>
</template>

<script>
    import PopupTool from './popup-tool.vue';
    import NewMenuOption from './new-menu-option.vue';
    import SaveMenuOption from './save-menu-option.vue';
    import SaveSelectionMenuOption from './save-selection-menu-option.vue';
    import OpenMenuOption from './open-menu-option.vue';
    import ReportIssueMenuOption from './report-issue-menu-option.vue';
    import AboutMenuOption from './about-menu-option.vue';

    export default {
        mounted() {

        },
        components: {
            PopupTool,
            NewMenuOption,
            SaveMenuOption,
            SaveSelectionMenuOption,
            OpenMenuOption,
            ReportIssueMenuOption,
            AboutMenuOption
        }
    };
</script>

<style>
    div.main-menu-select {
        background-color: #eeeeee;
    }
</style>