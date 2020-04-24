<template>
    <div id="app">
        <h1>Welcome to PaintBuddy.cc</h1>
        <button-one buttonGroup="Group1"/>
        <button-two buttonGroup="Group1"/>
    </div>
</template>

<script>
import ButtonOne from './components/button-one.vue';
import ButtonTwo from './components/button-two.vue';

export default {
    components: {
        ButtonOne,
        ButtonTwo
    }
}
</script>