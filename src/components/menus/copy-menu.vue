<template>
    <popup-menu name="copy-menu">
        <div class="copy-tool-select">
            <div class="copy-tool-option">
                <copy-tool />
            </div>
            <div class="copy-tool-option">
                <cut-tool />                
            </div>
            <div class="copy-tool-option">
                <paste-tool />                
            </div>
            <div class="copy-tool-option">
                <flip-horizontal-tool />
            </div>
            <div class="copy-tool-option">
                <flip-vertical-tool />
            </div>
            <div class="copy-tool-option">
                <rotate-cw-tool />
            </div>
            <div class="copy-tool-option">
                <rotate-ccw-tool />
            </div>
        </div>
    </popup-menu>
</template>
<script>
    import PopupMenu from '../menus/popup-menu.vue';
    import CopyTool from '../tools/copy-tool.vue';
    import CutTool from '../tools/cut-tool.vue';
    import PasteTool from '../tools/paste-tool.vue';
    import FlipHorizontalTool from '../tools/flip-horizontal-tool.vue';
    import FlipVerticalTool from '../tools/flip-vertical-tool.vue';
    import RotateCwTool from '../tools/rotate-cw-tool.vue';
    import RotateCcwTool from '../tools/rotate-ccw-tool.vue';

    export default {
        components: {
            PopupMenu,
            CopyTool,
            CutTool,
            PasteTool,
            FlipHorizontalTool,
            FlipVerticalTool,
            RotateCwTool,
            RotateCcwTool
        }
    }
</script>

<style>
    div.copy-tool-select {
        display: table;
        background-color: #ffffff;
    }

    div.copy-tool-select div.copy-tool-option {
        display: table-cell;
    }
</style>