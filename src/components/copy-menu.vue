<template>
    <popup-tool name="copy-menu">
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
    </popup-tool>
</template>
<script>
    import PopupTool from './popup-tool.vue';
    import CopyTool from './copy-tool.vue';
    import CutTool from './cut-tool.vue';
    import PasteTool from './paste-tool.vue';
    import FlipHorizontalTool from './flip-horizontal-tool.vue';
    import FlipVerticalTool from './flip-vertical-tool.vue';
    import RotateCwTool from './rotate-cw-tool.vue';
    import RotateCcwTool from './rotate-ccw-tool.vue';

    export default {
        components: {
            PopupTool,
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