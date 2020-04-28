<template>
    <div :class="name" @click="click()">
        <div :class="['toolbar-button', selected ? 'selected-item' : '']">
            <i :class="icon" :style="isEnabled() ? '' : 'color: #bbb;'"></i>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selected: false
            };
        },
        methods: {
            isEnabled() {
                return true;
            }
        }
    }
</script>