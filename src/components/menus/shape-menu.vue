<template>
    <popup-menu name="shape-menu">
        <div class="shape-select">
            <div class="shape-select-row" v-for="shapeListRow in shapeListRows" :key="shapeListRow.key">
                <div class="shape-select-cell" v-for="shape in shapeListRow.elements" :key="shape.name" @click="select(shape.name)">
                    <div :class="['option', isSelected(shape.name) ? 'selected-option' : '' ]">
                        <svg width="100%" viewBox="0 0 100 100">
                            <polygon stroke="#000000" stroke-width="4" fill="none" :points="shape.points | pointsFilter" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </popup-menu>
</template>

<script>
    import PopupMenu from '../menus/popup-menu.vue';
    import Shape from '../../module/shape';

    const defaultColumnCount = 6;

    const processShapeList = (list) => {
        let result = [];
        let rowKey = 0;
        let currentRow = {
            elements: [],
            key: rowKey++
        };
        Object.keys(list).forEach(item => {
            currentRow.elements.push({
                name: item,
                points: list[item]
            });
            if (currentRow.elements.length >= defaultColumnCount) {
                result.push(currentRow);
                currentRow = {
                    elements: [],
                    key: rowKey++
                };
            }
        });
        if (currentRow.elements.length > 0) {
            result.push(currentRow);
        }

        return result;
    };

    export default {
        components: {
            PopupMenu
        },
        data() {
            return {
                shapeListRows: processShapeList(Shape)
            };
        },
        methods: {
            select(name) {
                this.$root.paint.options.selectedShape = name;
                this.$root.$emit('hide-popup', 'shape-menu');
            },
            isSelected(name) {
                return this.$root.paint.options.selectedShape === name;
            }
        },
        filters: {
            pointsFilter(val) {
                return val.reduce((prev, curr) => prev + `${curr.x * 100},${curr.y * 100} `, '');
            }
        }
    };
</script>

<style>
    div.shape-select {
        display: table;
        background-color: #ffffff;
    }

    div.shape-select div.shape-select-row {
        display: table-row;
    }

    div.shape-select div.shape-select-row div.shape-select-cell {
        display: table-cell;
        width: 32px;
        height: 32px;
    }

    div.shape-select div.shape-select-row div.shape-select-cell div.option {
        width: 28px;
        height: 28px;
        margin: 2px 2px 2px 2px;
    }

    div.shape-select div.shape-select-row div.shape-select-cell div.option.selected-option {
        background-color: #cee9fe;
    }
</style>