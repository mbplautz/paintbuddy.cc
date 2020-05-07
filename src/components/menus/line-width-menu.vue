<template>
    <popup-menu name="line-width-menu">
        <div class="line-width-select">
            <line-width-option v-for="lineWidth in ordinate(lineWidthList)" :key="lineWidth.index" :line-width="lineWidth.width" />
        </div>
    </popup-menu>
</template>

<script>
    import PopupMenu from '../menus/popup-menu.vue';
    import LineWidthOption from '../menus/line-width-option.vue';

    export default {
        data() {
            return {
                lineWidthList: [ 1.0, 3.0, 5.0, 8.0 ]
            };
        },
        components: {
            PopupMenu,
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