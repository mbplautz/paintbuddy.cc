<template>
    <div class="menu">
        <main-menu />
        <copy-menu />
        <color-menu />
        <shape-menu />
        <line-width-menu />
        <filled-polygon-menu />
        <transparent-selection-menu />

        <confirm-dialog />
    </div>
</template>

<script>
    import MainMenu from '../menus/main-menu.vue';
    import CopyMenu from '../menus/copy-menu.vue';
    import ColorMenu from '../menus/color-menu.vue';
    import ShapeMenu from '../menus/shape-menu.vue';
    import LineWidthMenu from '../menus/line-width-menu.vue';
    import FilledPolygonMenu from '../menus/filled-polygon-menu.vue';
    import TransparentSelectionMenu from '../menus/transparent-selection-menu.vue';
    import ConfirmDialog from '../dialogs/confirm-dialog.vue';

    export default {
        data() {
            return {}
        },
        components: {
            MainMenu,
            CopyMenu,
            ColorMenu,
            ShapeMenu,
            LineWidthMenu,
            FilledPolygonMenu,
            TransparentSelectionMenu,
            ConfirmDialog
        }
    };
</script>