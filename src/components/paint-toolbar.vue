<template>
    <div class="toolbar">
        <menu-button />
        <undo-button />
        <redo-button />
        <copy-menu-tool />
        <toolbar-separator />
        <color-tool />
        <select-tool buttonGroup="edit-tools-group" />
        <brush-tool buttonGroup="edit-tools-group" />
        <line-tool buttonGroup="edit-tools-group" />
        <rectangle-tool buttonGroup="edit-tools-group" />
        <ellipse-tool buttonGroup="edit-tools-group" />
        <shape-tool buttonGroup="edit-tools-group" />
        <fill-tool buttonGroup="edit-tools-group" />
        <eraser-tool buttonGroup="edit-tools-group" />
        <toolbar-separator />
        <line-width-tool />
        <filled-polygon-tool />
        <transparent-selection-tool />

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
import MenuButton from './menu-button.vue';
import UndoButton from './undo-button.vue';
import RedoButton from './redo-button.vue';
import CopyMenuTool from './copy-menu-tool.vue';
import ToolbarSeparator from './toolbar-separator.vue';
import ColorTool from './color-tool.vue';
import SelectTool from './select-tool.vue';
import BrushTool from './brush-tool.vue';
import LineTool from './line-tool.vue';
import RectangleTool from './rectangle-tool.vue';
import EllipseTool from './ellipse-tool.vue';
import ShapeTool from './shape-tool.vue';
import FillTool from './fill-tool.vue';
import EraserTool from './eraser-tool.vue';
import LineWidthTool from './line-width-tool.vue';
import FilledPolygonTool from './filled-polygon-tool.vue';
import TransparentSelectionTool from './transparent-selection-tool.vue';

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
            MenuButton,
            UndoButton,
            RedoButton,
            CopyMenuTool,
            ToolbarSeparator,
            ColorTool,
            SelectTool,
            BrushTool,
            LineTool,
            RectangleTool,
            EllipseTool,
            ShapeTool,
            FillTool,
            EraserTool,
            LineWidthTool,
            FilledPolygonTool,
            TransparentSelectionTool,
            MainMenu,
            CopyMenu,
            ColorMenu,
            ShapeMenu,
            LineWidthMenu,
            FilledPolygonMenu,
            TransparentSelectionMenu,
            ConfirmDialog
        }
    }
</script>