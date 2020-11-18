<script lang="ts" setup>
import { net } from '@/utils/model'
</script>

<template>
  <div text-center container mx-auto>
    <h1>DCS World Lua调试工具</h1>
  </div>
  <n-alert type="info">
    Script/Hooks目录下的脚本在服务器启动时加载,并将用于所有任务.<br>
    执行 DCS.isServer() 或 DCS.isMultiplayer() 检查在mission(任务)中不起作用.<br>
    另外,trigger.action.outText() 在Hooks中不起作用,仅在任务中起作用.<br>
  </n-alert>

  <n-descriptions label-placement="top" bordered :column="Object.keys(net).length" my-4>
    <template v-for="(item, key) in net" :key="key">
      <n-descriptions-item>
        <template #label>
          <div text-center>
            <p> {{ key }}</p>
            <n-tooltip>
              <template #trigger>
                <n-button
                  text
                  tag="a"
                  :href="item.link.url"
                  target="_blank"
                  type="primary"
                >
                  {{ item.link.title }}
                </n-button>
              </template>
              {{ item.link.url }}
            </n-tooltip>
          </div>
        </template>
        <n-code
          word-wrap
          :code="item.describe"
          language="lua"
        />
      </n-descriptions-item>
    </template>
  </n-descriptions>
</template>
