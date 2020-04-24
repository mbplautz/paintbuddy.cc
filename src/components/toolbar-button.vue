<template>
    <div :class="name" @click="click()">
        <div :class="['toolbar-button', selected ? 'selected-item' : '']">
            <i :class="icon"></i>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        }
    }
</script>