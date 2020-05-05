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
    import MainMenu from './main-menu.vue';
    import CopyMenu from './copy-menu.vue';
    import ColorMenu from './color-menu.vue';
    import ShapeMenu from './shape-menu.vue';
    import LineWidthMenu from './line-width-menu.vue';
    import FilledPolygonMenu from './filled-polygon-menu.vue';
    import TransparentSelectionMenu from './transparent-selection-menu.vue';
    import ConfirmDialog from './confirm-dialog.vue';

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