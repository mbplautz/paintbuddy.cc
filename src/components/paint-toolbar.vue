<template>
    <div class="toolbar">
        <menu-button />
        <undo-button />
        <redo-button />
        <toolbar-separator />
        <select-tool buttonGroup="edit-tools-group" />
        <brush-tool buttonGroup="edit-tools-group" />
        <line-tool buttonGroup="edit-tools-group" />
        <rectangle-tool buttonGroup="edit-tools-group" />
        <ellipse-tool buttonGroup="edit-tools-group" />
        <fill-tool buttonGroup="edit-tools-group" />
        <eraser-tool buttonGroup="edit-tools-group" />
        <toolbar-separator />
    </div>
</template>

<script>
import MenuButton from './menu-button.vue';
import UndoButton from './undo-button.vue';
import RedoButton from './redo-button.vue';
import ToolbarSeparator from './toolbar-separator.vue';
import SelectTool from './select-tool.vue';
import BrushTool from './brush-tool.vue';
import LineTool from './line-tool.vue';
import RectangleTool from './rectangle-tool.vue';
import EllipseTool from './ellipse-tool.vue';
import FillTool from './fill-tool.vue';
import EraserTool from './eraser-tool.vue';

    export default {
        data() {
            return {}
        },
        components: {
            MenuButton,
            UndoButton,
            RedoButton,
            ToolbarSeparator,
            SelectTool,
            BrushTool,
            LineTool,
            RectangleTool,
            EllipseTool,
            FillTool,
            EraserTool
        }
    }
</script>