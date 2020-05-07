<template>
    <popup-menu name="main-menu">
        <div class="main-menu-select">
            <new-menu-option />
            <save-menu-option />
            <save-selection-menu-option />
            <open-menu-option />
            <report-issue-menu-option />
            <about-menu-option />
        </div>
    </popup-menu>
</template>

<script>
    import PopupMenu from '../menus/popup-menu.vue';
    import NewMenuOption from '../menu-options/new-menu-option.vue';
    import SaveMenuOption from '../menu-options/save-menu-option.vue';
    import SaveSelectionMenuOption from '../menu-options/save-selection-menu-option.vue';
    import OpenMenuOption from '../menu-options/open-menu-option.vue';
    import ReportIssueMenuOption from '../menu-options/report-issue-menu-option.vue';
    import AboutMenuOption from '../menu-options/about-menu-option.vue';

    export default {
        mounted() {

        },
        components: {
            PopupMenu,
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