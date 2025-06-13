<script setup>
import Split from 'split.js'
import { parse } from 'es-module-lexer/js';
const loading = ref(true)
const editorRef = ref()
const terminalRef = ref()
onMounted(() => {
  Split(['#panel-code', '#panel-console'], {
    direction: 'vertical',
    sizes: [60, 40],
    minSize: [100, 100],
    gutterSize: 5,
    onDrag: () => {
      terminalRef.value.fit();
    },
  })
  Split(['#panel-config', '#panel-editor'], {
    sizes: [50, 50],
    minSize: [100, 100],
    gutterSize: 5,
  })
  editorRef.value.setValue(`import * as ${form.name} from '${form.name}';
export default ${form.name};`)
  loading.value = false;
  nextTick(() => {
    terminalRef.value.open();
  })
})
const form = reactive({
  name: "dayjs",
  version: "1.11.13",
  description: "2KB immutable date time library alternative to Moment.js with the same modern API",
  dependencies: [],
  fileName: "index",
  pack: true,
  publish: false,
})
const code = ref("")
watch(() => code.value, () => {
  const [imports] = parse(code.value, 'optional-sourcename');
  let items = []
  for (let i = 0; i < imports.length; i++) {
    items.push(imports[i].n)
  }
  form.dependencies = items;
})
const submitLoading = ref(false)

const onSubmit = () => {
  submitLoading.value = true
  $fetch('/api/build', {
    method: 'post',
    body: {
      config: form,
      code: code.value,
    }
  }).then(res => {
    for (let i = 0; i < res.length; i++) {
      terminalRef.value.write(res[i])
    }
  }).catch((err) => {
    terminalRef.value.write(err.message)
  }).finally(() => {
    submitLoading.value = false
  })
}
</script>
<template>
  <UApp>
    <div class="fixed w-screen h-screen ui-bg z-50 flex items-center justify-center" v-if="loading">
      Loading...
    </div>
    <div class="h-12 border-b border-color flex items-center px-4">
      <div>IIFE Generate</div>
      <div class="flex-1"></div>
      <ColorMode></ColorMode>
    </div>
    <div class="flex flex-col body-h">
      <div id="panel-code" class="flex">
        <div id="panel-config" class="overflow-y">
          <UForm :state="form" @submit="onSubmit" class="space-y-4 p-4">
            <div class="flex items-center gap-4">
              <UFormField label="Name" name="name">
                <UInput v-model="form.name" />
              </UFormField>
              <UFormField label="Version" name="version">
                <UInput v-model="form.version" />
              </UFormField>
            </div>
            <UFormField label="Description" name="description">
              <UInput v-model="form.description" />
            </UFormField>
            <UFormField label="FileName" name="fileName">
              <UInput v-model="form.fileName" />
            </UFormField>
            <UFormField label="Dependencies" name="dependencies">
              <div class="flex flex-wrap gap-4">
                <div v-for="(_, index) in form.dependencies">
                  <UInput v-model="form.dependencies[index]" readonly />
                </div>
              </div>
            </UFormField>
            <div class="flex items-center gap-4">
              <UButton type="submit" :loading="submitLoading" class="w-26 text-center mr-2">
                <div class="w-full">Build</div>
              </UButton>
              <UCheckbox v-model="form.pack" label="Pack"></UCheckbox>
              <UCheckbox v-model="form.publish" label="Publish"></UCheckbox>
            </div>
          </UForm>
        </div>
        <div id="panel-editor">
          <Editor ref="editorRef" v-model="code"></Editor>
        </div>
      </div>
      <div id="panel-console" class="overflow-y">
        <Terminal ref="terminalRef" />
      </div>
    </div>
  </UApp>
</template>