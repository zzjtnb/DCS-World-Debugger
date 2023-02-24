<script lang="ts" setup>
import type { UploadFileInfo } from 'naive-ui/es/upload'
import JSZip from 'jszip'
import type { TreeOption } from 'naive-ui/es/tree'
const codemirror = ref()
const codemirror_json = ref()
const luacode = ref('')
const mizData = ref('{}')
const fileList = ref<UploadFileInfo[]>([])
const mizFile = ref<UploadFileInfo>({
  id: '',
  name: '',
  status: 'finished',
})

async function readFile(file) {
  // const state = new Map<String, any>()
  const zip = new JSZip()
  // 解压Zip压缩包，参数默认是二进制
  const zipData = await zip.loadAsync(file.file)
  mizData.value = JSON.stringify(zipData.files, null, 2)
  // codemirror_json.value.upState(mizData.value)
  luacode.value = await (zipData.file('mission') as JSZip.JSZipObject).async('string')
  codemirror.value.upState(luacode.value)
}

const message = useMessage()
function handleUploadChange(data: { fileList: UploadFileInfo[] }) {
  if (!data.fileList.length) return
  message.success(`读取成功: ${mizFile.value.name}`)
  mizFile.value = data.fileList.pop() as UploadFileInfo
  mizFile.value.thumbnailUrl = '/dcs/StartImage.bmp'
  mizFile.value.status = 'finished'
  readFile(mizFile.value)
}

// 下载一个文本文件
const downloadText = (text, filename = '') => {
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
          <icon-fa6-solid-upload />
        </n-icon>
      </div>
      <n-text style="font-size: 16px;">
        点击或者拖动文件到该区域来上传
      </n-text>
      <n-p depth="3" style="margin: 8px 0 0;">
        支持以.zip或者.miz结尾的任务文件
      </n-p>
    </n-upload-dragger>
  </n-upload>
  <n-card v-if="mizFile.name" text-center>
    <n-p>
      <n-text strong>
        用于获取miz文件当中的lua
      </n-text>
    </n-p>
    <n-p>
      <n-text>
        <span>当前任务名称: </span>
        <n-text type="info">
          {{ mizFile.name }}
        </n-text>
      </n-text>
      <n-button strong secondary type="primary" ml-4 @click="downloadText(luacode, `${mizFile.name.replace('.miz', '.lua')}`)">
        下载Lua
      </n-button>
    </n-p>
  </n-card>
  <div mx-4 my-2>
    <n-scrollbar max-h-2000px>
      <CodeMirror ref="codemirror" v-model="luacode" type="lua" />
    </n-scrollbar>

    <!-- <n-scrollbar style="max-height: 2000px;">
        <CodeMirror ref="codemirror_json" v-model="mizData" type="json" />
      </n-scrollbar> -->
  </div>
</template>

<style lang="scss" scoped>

</style>
