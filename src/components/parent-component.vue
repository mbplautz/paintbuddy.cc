<template>
    <div :class="name">
        <div class="square" @click="selectParent()">
            <i :class="icon"></i>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery';

    export default {
        data() {
            return {
                icon: 'fas fa-radiation',
                selected: false
            }
        },
        mounted() {
            this.$root.$on('deselect', this.deselect);
        },
        methods: {
            selectParent() {
                this.$root.$emit('deselect', this.buttonGroup)
                $(`div.${this.name} div.square`).addClass('selected-item');
                console.log(`${this.name} has been selected`);
                this.select();
            },
            deselect(buttonGroup) {
                if (buttonGroup === this.buttonGroup) {
                     this.selected = false;
                     $(`div.${this.name} div.square`).removeClass('selected-item');
                     console.log(`${this.name} has been deselected`);
                }
            }
        }
    }
</script>