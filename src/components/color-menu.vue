<template>
    <popup-tool name="color-menu">
        <div class="color-select">
            <div class="color-select-row" v-for="colorRow in colorList" :key="colorRow.rowIndex">
                <color-option v-for="element in ordinate(colorRow.colors)" :color="element.color" :key="element.index" />
            </div>
        </div>
    </popup-tool>
</template>

<script>
    import PopupTool from './popup-tool.vue';
    import ColorOption from './color-option.vue';

    export default {
        data() {
            return {
                colorList: [
                    {
                        rowIndex: 0,
                        colors: [
                            '#000000',
                            '#7f7f7f',
                            '#880015',
                            '#ed1c24',
                            '#ff7f27',
                            '#fff200',
                            '#22b14c',
                            '#00a2e8',
                            '#3f48cc',
                            '#a349a4'
                        ],
                    },
                    {
                        rowIndex: 1,
                        colors: [
                            '#ffffff',
                            '#c3c3c3',
                            '#b97a57',
                            '#ffaec9',
                            '#ffc90e',
                            '#efe4b0',
                            '#b5e61d',
                            '#99d9ea',
                            '#7092be',
                            '#c8bfe7'
                        ]
                    }
                ]
            };
        },
        components: {
            PopupTool,
            ColorOption
        },
        methods: {
            ordinate(colorRow) {
                return colorRow.map((color, index) => ({
                    color,
                    index
                }));
            }
        }
    };
</script>

<style>
    div.color-select {
        background-color: #f5f6f7;
        padding: 2px 2px 2px 2px;
    }
</style>