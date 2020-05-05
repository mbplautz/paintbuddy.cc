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
    </div>
</template>

<script>
import MenuButton from '../buttons/menu-button.vue';
import UndoButton from '../buttons/undo-button.vue';
import RedoButton from '../buttons/redo-button.vue';
import CopyMenuTool from '../tools/copy-menu-tool.vue';
import ToolbarSeparator from '../buttons/toolbar-separator.vue';
import ColorTool from '../tools/color-tool.vue';
import SelectTool from '../tools/select-tool.vue';
import BrushTool from '../tools/brush-tool.vue';
import LineTool from '../tools/line-tool.vue';
import RectangleTool from '../tools/rectangle-tool.vue';
import EllipseTool from '../tools/ellipse-tool.vue';
import ShapeTool from '../tools/shape-tool.vue';
import FillTool from '../tools/fill-tool.vue';
import EraserTool from '../tools/eraser-tool.vue';
import LineWidthTool from '../tools/line-width-tool.vue';
import FilledPolygonTool from '../tools/filled-polygon-tool.vue';
import TransparentSelectionTool from '../tools/transparent-selection-tool.vue';

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
            TransparentSelectionTool
        }
    }
</script>

<style>
    div.toolbar {
        z-index: 4;
    }
</style>