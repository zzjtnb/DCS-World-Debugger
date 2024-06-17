<script lang="ts" setup>
import type { UploadFileInfo } from 'naive-ui/es/upload'
import JSZip from 'jszip'

const message = useMessage()
const luaStore = useLuaStore()
luaStore.resetCode()
luaStore.codemirror.disabled = true
const mizData = ref('{}')
const fileList = ref<UploadFileInfo[]>([])
const mizFile = ref<UploadFileInfo>({
  id: '',
  name: '',
  status: 'finished',
})

async function readFile(file: UploadFileInfo) {
  if (!file.file)
    return
  const zip = new JSZip()
  // 解压Zip压缩包，参数默认是二进制
  const zipData = await zip.loadAsync(file.file)
  mizData.value = JSON.stringify(zipData.files, null, 2)
  luaStore.codemirror.code = await (zipData.file('mission') as JSZip.JSZipObject).async('string')
}

function handleUploadChange(data: { fileList: UploadFileInfo[] }) {
  if (!data.fileList.length)
    return
  message.success(`读取成功: ${mizFile.value.name}`)
  mizFile.value = data.fileList.pop() as UploadFileInfo
  mizFile.value.thumbnailUrl = '/dcs/StartImage.bmp'
  mizFile.value.status = 'finished'
  readFile(mizFile.value)
}

// 下载一个文本文件
function downloadText(text: string, filename = '') {
  const a = document.createElement('a')
  a.download = filename
  // 文本txt类型
  const blob = new Blob([text], { type: 'text/plain' })
  // text指需要下载的文本或字符串内容
  a.href = window.URL.createObjectURL(blob)
  // 会生成一个类似blob:http://localhost:3000/d3958f5c-0777-0845-9dcf-2cb28783acaf 这样的URL字符串
  document.body.appendChild(a)
  a.click()
  a.remove()
}
</script>

<template>
  <n-upload
    v-model:file-list="fileList"
    accept=".zip,.miz"
    show-download-button
    list-type="image"
    @change="handleUploadChange"
  >
    <n-upload-dragger>
      <div style="margin-bottom: 12px;">
        <n-icon size="48" :depth="3">
          <fa6-solid-upload />
        </n-icon>
      </div>
      <n-text style="font-size: 16px;">
        {{ $t('mission.upload') }}
      </n-text>
      <n-p depth="3" style="margin: 8px 0 0;">
        {{ $t('mission.support') }}
      </n-p>
    </n-upload-dragger>
  </n-upload>
  <n-card v-if="mizFile.name" text-center>
    <n-p>
      <n-text strong>
        {{ $t('mission.desc') }}
      </n-text>
    </n-p>
    <n-p>
      <n-text>
        <span>{{ $t('mission.name') }}: </span>
        <n-text type="info">
          {{ mizFile.name }}
        </n-text>
      </n-text>
      <n-button strong secondary type="primary" ml-4 @click="downloadText(luaStore.codemirror.code, `${mizFile.name.replace('.miz', '.lua')}`)">
        {{ $t('mission.download') }}
      </n-button>
    </n-p>
  </n-card>
  <div mx-4 my-2>
    <CodeMirror />
  </div>
</template>
