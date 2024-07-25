<script lang="ts" setup>
const appStore = useAppStore()
appStore.theme = 'light'

const reg = /[\u4E00-\u9FA5]/
function isChinese(char: string) {
  return reg.test(char)
}

const data = ref()
const pinyin = ref()

getPinyin().then((res) => {
  pinyin.value = res
  getColors().then((res) => {
    data.value = sortColorsByHsv(res, 'RGB')
  })
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

                h('rp', '('),
                h('rt', {
                  class: 'tone',
                }, pinyin.value[item].withTone),
                h('rp', ')'),
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
      key: 'CMYK',
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
            { default: () => 'CMYK' },
          ),
          '印刷四分色模式',
        )
      },
    },
    {
      key: 'RGB',
      title() {
        return renderTooltip(
          h(
            NTag,
            {
              type: 'info',
              size: 'small',
              border: false,
            },
            { default: () => 'RGB' },
          ),
          '三原色光模式',
        )
      },
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
  return {
    style: {
      backgroundColor: row.hex,
      color: 'white',
    },
  }
}
const columns = createColumns()
columns.forEach((column) => {
  // column.cellProps = rowData => cellProps(rowData)
  column.cellProps = cellProps
})
</script>

<template>
  <!-- :pagination="pagination" -->
  <n-card title=" 中国色 - 中国传统颜色">
    <n-data-table
      :columns="columns"
      :data="data"
      :bordered="false"
      max-height="760px"
      virtual-scroll
      :row-props="rowProps"
    />
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
