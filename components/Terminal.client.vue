<script setup>
import { Terminal } from '@xterm/xterm';
import "@xterm/xterm/css/xterm.css"
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
const colorMode = useColorMode()
let term = null;
let fitAddon = null;
const getTheme = () => {
    const style = getComputedStyle(document.documentElement)
    return {
        foreground: style.getPropertyValue("--ui-text"),
        background: style.getPropertyValue("--ui-bg"),
    }
}
const open = () => {
    term = new Terminal({
        convertEol: true,
        cursorBlink: true,
        disableStdin: true,
        theme: getTheme()
    });
    fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());
    term.open(document.getElementById('terminal'));
    fit();
}
const write = (value) => {
    term.write(value)
}
const fit = () => {
    fitAddon.fit();
}
watch(() => colorMode.value, () => {
    term.options.theme = getTheme()
})
onMounted(() => {
    window.addEventListener('resize', () => {
        fit()
    })
})
defineExpose({ open, write, fit })
</script>

<template>
    <div id="terminal" class="w-full h-full"></div>
</template>
