<script lang="ts" setup>
// const appStore = useAppStore()
// onBeforeMount(() => {
//   appStore.theme = 'light'
// })

// onUnmounted(() => {
//   appStore.theme = 'dark'
// })

const reg = /[\u4E00-\u9FA5]/
function isChinese(char: string) {
  return reg.test(char)
}

const data = ref()

getColor().then((res) => {
  console.log('🚀 ~ getColor ~ res:', res)

  data.value = res
})
function renderTooltip(trigger: any, content: any) {
  return h(NTooltip, null, {
    trigger: () => trigger,
    default: () => content,
  })
}

function createColumns(): DataTableColumns<RowData> {
  return [
    {
      title: '中文颜色名',
      key: 'name',
      render(row: any) {
        // console.log('🚀 ~ render ~ row:', row)
        return row.name.split('').map((item: string) => {
          if (isChinese(item)) {
            return h(
              'ruby',
              [
                item,
                // h('rp', '('),
                // h('rt', {
                //   class: 'tone',
                // }, pinyin.value[item].withTone),
                // h('rp', ')'),
              ],
            )
          }
          else if (item === '\n' || item === ' ') {
            return item += h('br')
          }
          else {
            return item
          }
        })
      },
    },

    {
      key: 'hex',
      // title: '十六进制颜色代码(hex)',
      title() {
        return renderTooltip(
          h(
            NTag,
            {
              type: 'info',
              size: 'small',
              border: false,
            },
            { default: () => 'hex' },
          ),
          '十六进制颜色代码',
        )
      },
    },
    {
      key: 'cmyk',
      // title: '印刷四分色模式(CMYK)',
      title() {
        return renderTooltip(
          h(
            NTag,
            {
              type: 'info',
              size: 'small',
              border: false,
            },
            { default: () => 'cmyk' },
          ),
          '印刷四分色模式',
        )
      },
    },
    {
      key: 'rgb',
      title() {
        return renderTooltip(
          h(
            NTag,
            {
              type: 'info',
              size: 'small',
              border: false,
            },
            { default: () => 'rgb' },
          ),
          '三原色光模式',
        )
      },
    },
    {
      key: 'source 1',
      title: '《中国传统色》',
    },
    {
      key: 'source 2',
      title: '中科院《色谱》（无解释）',
    },
    {
      key: 'source 3',
      title: '《中国色彩图典》(画师整理)',
    },
    {
      key: 'source 4',
      title: '中华遗产《中国美色》（无色值）',
    },
    {
      key: 'source 5',
      title: '《中国颜色》黄仁达',
    },
    {
      key: 'explanation',
      title: '解释',
      ellipsis: true,
    },
  ]
}
function rowProps(row: RowData) {
  return {
    style: {
      cursor: 'pointer',
    },
  }
}
function cellProps(row: RowData) {
  // 获取背景颜色
  const backgroundColor = row.hex
  // 将背景颜色转换为RGB值
  const rgb = row.rgb.split(',')
  const r = Number.parseInt(rgb[0])
  const g = Number.parseInt(rgb[1])
  const b = Number.parseInt(rgb[2])
  // 计算文本颜色
  const textColor = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? 'black' : 'white'
  // 返回样式对象
  return {
    style: {
      backgroundColor,
      color: textColor,
    },
  }
}
const columns = createColumns()
columns.forEach((column) => {
  // column.cellProps = rowData => cellProps(rowData)
  column.cellProps = cellProps
})
const pagination = {
  pageSize: 10,
}
</script>

<template>
  <n-card title=" 中国色 - 中国传统颜色">
    <n-tabs default-value="红" size="large" justify-content="space-evenly">
      <template v-for="(item, key) in data " :key="key">
        <n-tab-pane :name="key" :tab="key">
          <n-data-table
            :columns="columns"
            :data="item"
            :row-props="rowProps"
            :pagination="pagination"
          />
        </n-tab-pane>
      </template>
    </n-tabs>
  </n-card>
  <!-- <n-list bordered>
    <template #header>
      中国色 - 中国传统颜色
    </template>
    <n-list-item>
      <n-thing title="颜色名: 暗玉紫" content-style="margin-top: 10px;">
        <template #description>
          <n-space size="small" style="margin-top: 4px">
            拼音
            <NTag :bordered="false" type="info" size="small">
              anyuzi
            </NTag>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button> hex </n-button>
              </template>
              十六进制颜色代码
            </n-tooltip>
            <NTag :bordered="false" type="info" size="small">
              #5c2223
            </NTag>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button> CMYK </n-button>
              </template>
              印刷四分色模式
            </n-tooltip>
            <NTag :bordered="false" type="info" size="small">
              35947753
            </NTag>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button> RGB </n-button>
              </template>
              三原色光模式
            </n-tooltip>
            <NTag :bordered="false" type="info" size="small">
              #5c2223
            </NTag>
          </n-space>
        </template>
      </n-thing>
    </n-list-item>
  </n-list> -->
</template>

<style scoped>
:deep(ruby) {
  font-size: 16px;
  font-weight: bold;
}

:deep(rt) {
  width: 40px;

  /* color: #ec2b24; */
  font-size: 12px;
  font-weight: 700;
}
</style>
