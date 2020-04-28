<script>
    import ToolbarButton from './toolbar-button.vue';

    export default {
        extends: ToolbarButton,
        methods: {
            click() {
                if (this.isEnabled()) {
                    let d = document.querySelector(`div.${this.name} div.toolbar-button`);
                    let t = 20;
                    let i = setInterval(() => {
                        if (t < 0) {
                            clearInterval(i);
                        }
                        else {
                            // #cee9fe
                            d.style.backgroundColor = `rgba(206, 233, 254, ${t-- / 20})`;
                        }
                    }, 50);
                    this.action();
                }
            }
        }
    };
</script>