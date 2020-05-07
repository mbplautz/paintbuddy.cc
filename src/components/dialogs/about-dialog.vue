<template>
    <dialog-box name="about-dialog">
        <div class="about-dialog-window" @click="preventDefault($event)">
            <div class="content-panel">
                <div class="content">
                    <img src="/static/icon.png" width="64" height="64" alt="PaintBuddy.cc Logo" />
                    <div>
                        <div><strong>PaintBuddy.cc</strong></div>
                        <div>The Simple TouchScreen Drawing Web App</div>
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    <span class="version">v 0.9.1</span>
                    <span class="author"><em>by Michael Plautz</em></span>
                </div>
                <div class="spacer"></div>
                <div class="content">
                    <img src="https://vuejs.org/images/logo.png" width="64" height="64" alt="vue logo">
                    <div>Built using <a href="https://vuejs.org">Vue.js</a></div>
                </div>
                <div class="content">
                    <div style="height: 64px; width: 64px; overflow: hidden; margin-right: 16px;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3046.7 875.7" height="64px"><path fill="#FFF" d="M387 0l387 218.9v437.9L387 875.7 0 656.8V218.9L387 0z"/><path fill="#8ED6FB" d="M704.9 641.7L399.8 814.3V679.9l190.1-104.6 115 66.4zm20.9-18.9V261.9l-111.6 64.5v232l111.6 64.4zM67.9 641.7L373 814.3V679.9L182.8 575.3 67.9 641.7zM47 622.8V261.9l111.6 64.5v232L47 622.8zm13.1-384.3L373 61.5v129.9L172.5 301.7l-1.6.9-110.8-64.1zm652.6 0l-312.9-177v129.9l200.5 110.2 1.6.9 110.8-64z"/><path fill="#1C78C0" d="M373 649.3L185.4 546.1V341.8L373 450.1v199.2zm26.8 0l187.6-103.1V341.8L399.8 450.1v199.2zM198.1 318.2l188.3-103.5 188.3 103.5-188.3 108.7-188.3-108.7z"/><path fill="#F5FAFA" d="M1164.3 576.3h82.5l84.1-280.2h-80.4l-49.8 198.8-53.1-198.8H1078l-53.6 198.8-49.3-198.8h-80.4l83.6 280.2h82.5l52-179.5 51.5 179.5zM1335.2 437c0 84.1 57.3 146.3 147.4 146.3 69.7 0 107.2-41.8 117.9-61.6l-48.8-37c-8 11.8-30 34.3-68.1 34.3-41.3 0-71.3-26.8-72.9-64.3H1608c.5-5.4.5-10.7.5-16.1 0-91.6-49.3-149.5-136.1-149.5-79.9 0-137.2 63.2-137.2 147.9zm77.7-30.6c3.2-32.1 25.7-56.8 60.6-56.8 33.8 0 58.4 22.5 60 56.8h-120.6zm223.5 169.9h69.7v-28.9c7.5 9.1 35.4 35.9 83.1 35.9 80.4 0 137.2-60.5 137.2-146.8 0-86.8-52.5-147.3-132.9-147.3-48.2 0-76.1 26.8-83.1 36.4V188.9h-73.9v387.4h-.1zm71.8-139.3c0-52.5 31.1-82.5 71.8-82.5 42.9 0 71.8 33.8 71.8 82.5 0 49.8-30 80.9-71.8 80.9-45 0-71.8-36.5-71.8-80.9zm247 239.5h73.9V547.3c7 9.1 34.8 35.9 83.1 35.9 80.4 0 132.9-60.5 132.9-147.3 0-85.7-56.8-146.8-137.2-146.8-47.7 0-75.6 26.8-83.1 36.4V296h-69.7v380.5h.1zm71.8-241.1c0-44.5 26.8-80.9 71.8-80.9 41.8 0 71.8 31.1 71.8 80.9 0 48.8-28.9 82.5-71.8 82.5-40.7 0-71.8-30-71.8-82.5zm231.5 54.1c0 58.9 48.2 93.8 105 93.8 32.2 0 53.6-9.6 68.1-25.2l4.8 18.2h65.4V398.9c0-62.7-26.8-109.8-116.8-109.8-42.9 0-85.2 16.1-110.4 33.2l27.9 50.4a165.2 165.2 0 0 1 74.5-19.8c32.7 0 50.9 16.6 50.9 41.3v18.2c-10.2-7-32.2-15.5-60.6-15.5-65.4-.1-108.8 37.4-108.8 92.6zm73.9-2.2c0-23 19.8-39.1 48.2-39.1s48.8 14.5 48.8 39.1c0 23.6-20.4 38.6-48.2 38.6s-48.8-15.5-48.8-38.6zm348.9 30.6c-46.6 0-79.8-33.8-79.8-81.4 0-45 29.5-82 77.2-82a95.2 95.2 0 0 1 65.4 26.8l20.9-62.2a142.6 142.6 0 0 0-88.4-30c-85.2 0-149 62.7-149 147.9s62.2 146.3 149.5 146.3a141 141 0 0 0 87.3-30l-19.8-60.5c-12.4 10.1-34.9 25.1-63.3 25.1zm110.9 58.4h73.9V431.6l93.8 144.7h86.8L2940.6 423l98.6-127h-83.1l-90 117.9v-225h-73.9v387.4z"/></svg>
                    </div>
                    Code bundled using <a href="https://webpack.js.org/">Webpack</a>
                </div>
                <div class="spacer"></div>
                <div>Flood fill algorithm by <a href="https://bl.ocks.org/jon-hall">Jon Hall</a></div>
                <div class="spacer"></div>
                <div class="content">
                    <svg class="octicon octicon-mark-github v-align-middle" height="64" viewBox="0 0 16 16" version="1.1" width="64" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                    <div>PaintBuddy.cc is an Open Source Project. Check out the source code on <a href="https://github.com/mbplautz/paintbuddy.cc">GitHib</a></div>
                </div>
            </div>
            <div class="button-panel">
                <div class="button-span">
                    <div class="button ok-button" @click="hide()">
                        <a>
                            <i class="fas fa-check-circle"></i>
                            OK
                        </a>
                    </div>
                 </div>
            </div>
        </div>
    </dialog-box>
</template>

<script>
    import DialogBox from '../dialogs/dialog-box.vue';

    export default {
        components: {
            DialogBox
        },
        mounted() {
        },
        methods: {
           hide() {
                this.$root.$emit('hide-dialog', 'about-dialog');
            },
            preventDefault(e) {
                e.stopPropagation();
            }
        }
    };
</script>

<style>
    div.about-dialog-window {
        margin: 0 auto;
        border: 3px solid #888888;
        border-radius: 10px;
        background-color: #eeeeee;
        padding: 5px;
        font-size: 22px;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
    }

    @media only screen and (max-width: 599px) {
        div.about-dialog-window {
            width: 360px;
        }

        div.about-dialog-window div.content-panel {
            width: 300px;
        }
    }

    @media only screen and (min-width: 600px) {
        div.about-dialog-window {
            width: 600px;
        }
        div.about-dialog-window div.content-panel {
            width: 550px;
        }
    }

    div.about-dialog-window div.content-panel {
        margin: 20px auto;
        font-size: 22px;
    }

    div.about-dialog-window div.button-panel {
        width: 100%;
        border-spacing: 10px;
        font-size: 20px;
    }

    div.about-dialog-window div.button-panel div.button-span {
        display: table;
        margin: 0 auto;
    }

    div.about-dialog-window div.button-panel div.button-span div.button {
        display: table-cell;
        color: #ffffff;
        background-color: #aaaaaa;
        border-radius: 10px;
        padding: 5px 20px;
    }

    div.about-dialog-window div.button-panel div.button-span div.button a {
        display: flex;
        align-items: center;
    }

    div.about-dialog-window div.button-panel div.button-span div.button a i {
        font-size: 36px;
        padding-right: 10px;
    }

    /* vestigial */
    div.about-dialog-window div.button-panel div.button-span div.cancel-button a i {
        color: #ff2d19;
    }

    div.about-dialog-window div.button-panel div.button-span div.ok-button a i {
        color: #258c1c;
    }    

    div.content-panel div.content {
        display: flex; 
        align-items: center;
        height: 64px;
    }

    div.spacer {
        height: 32px;
    }

    div.content-panel div.content img, div.content-panel div.content svg {
        margin-right: 16px;
    }
</style>