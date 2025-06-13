<script setup>
import ace from "ace-builds";
import modeJavascript from 'ace-builds/src-noconflict/mode-javascript'
import themeCloudEditorDark from 'ace-builds/src-noconflict/theme-cloud_editor_dark'
import themeCloudEditor from 'ace-builds/src-noconflict/theme-cloud_editor'

ace.config.setModuleUrl('ace/mode/javascript', modeJavascript)
ace.config.setModuleUrl('ace/theme/cloud_editor_dark', themeCloudEditorDark)
ace.config.setModuleUrl('ace/theme/cloud_editor', themeCloudEditor)

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const colorMode = useColorMode()

const getTheme = () => {
    return colorMode.value === 'dark' ? 'ace/theme/cloud_editor_dark' : "ace/theme/cloud_editor"
};
let aceEditor;
onMounted(() => {
    aceEditor = ace.edit(document.getElementById("ace-editor"), {
        value: props.modelValue,
        theme: getTheme(),
        mode: 'ace/mode/javascript',
        tabSize: 2,
        fontSize: 14,
        wrap: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        enableBasicAutocompletion: true,
        scrollPastEnd: true,
        highlightActiveLine: true,
        useWorker: false,
        showPrintMargin: false,
    })
    aceEditor.container.style.lineHeight = 1.6
    aceEditor.on('change', () => {
        emit('update:modelValue', aceEditor.getValue())
    })
});
onBeforeUnmount(() => {
    aceEditor.destroy()
    aceEditor.container.remove();
})
watch(() => colorMode.value, () => {
    aceEditor.setTheme(getTheme())
})
const setValue = (value) => {
    aceEditor.session.setValue(value)
}
defineExpose({ setValue })
</script>

<template>
    <div class="w-full h-full" id="ace-editor"></div>
</template>
