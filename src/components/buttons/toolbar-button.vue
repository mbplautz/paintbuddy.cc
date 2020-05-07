<template>
    <div :class="name" @click="(isEnabled() ? click : noop)()">
        <div :class="['toolbar-button', selected ? 'selected-item' : '']">
            <i :class="icon" :style="isEnabled() ? '' : 'color: #bbb;'" ref="icon-ref"></i>
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
            },
            noop() {

            }
        }
    }
</script>