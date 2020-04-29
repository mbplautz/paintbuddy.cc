<template>
    <popup-tool name="line-width-menu">
        <div class="line-width-select">
            <line-width-option v-for="lineWidth in ordinate(lineWidthList)" :key="lineWidth.index" :line-width="lineWidth.width" />
        </div>
    </popup-tool>
</template>

<script>
    import PopupTool from './popup-tool.vue';
    import LineWidthOption from './line-width-option.vue';

    export default {
        data() {
            return {
                lineWidthList: [ 1.0, 3.0, 5.0, 8.0 ]
            };
        },
        components: {
            PopupTool,
            LineWidthOption
        },
        methods: {
            ordinate(list) {
                return list.map((width, index) => ({
                    width,
                    index
                }));
            }
        }
    }
</script>