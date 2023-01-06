<script lang="ts" setup>
import {
  alertType, autoFill, luaValue,
  netLua, received, resultJSON, sendLua, showLoading,
} from '../../hooks/lua'

const code = `local keys = {}
for k, v in pairs(_G) do
  keys[#keys + 1] = k
end
return keys
`
const codemirror = ref()
const model = ref('server')
luaValue.value = netLua[model.value].code

const route = useRoute()
const isNet = computed(() => {
  received.value = {}
  const falg = route.path === '/dostring_in'
  if (!falg) luaValue.value = code
  return falg
})

function handleUpdateChecked(value: boolean) {
  if (value) { luaValue.value = `a_do_script("${luaValue.value}")` }
  else {
    const regex = /"(.*?)"/
    const match = luaValue.value.match(regex)
    if (match?.length)
      luaValue.value = match[1]
  }

  codemirror.value.upState(luaValue.value)
}
function updateLua(value) {
  received.value = {}
  luaValue.value = netLua[value].code
  codemirror.value.upState(luaValue.value)
}
function clearLua() {
  luaValue.value = ''
  codemirror.value.upState(luaValue.value)
}
</script>

<template>
  <div v-if="!isNet" px-4 py-2>
    <n-alert :show-icon="false">
      net.dostring_in()这个函数,入参是普通的string,返回一个string.<br>
      返回的string你可以把一个table转成json返回出来,但没法直接返回一个table.<br>
      但是lua原生的loadstring没这个限制,所以hook和export里可以直接返回table<br>
      <n-code code="return net.get_player_list()" language="lua" word-wrap />
    </n-alert>
  </div>
  <n-spin :show="showLoading">
    <div class="code" my-4>
      <CodeMirror ref="codemirror" v-model="luaValue" />
    </div>
  </n-spin>

  <div v-if="isNet" class="net_dostring">
    <div text-center container mx-auto my-4>
      <p text-8 fw-900 mt--2 mb-2>
        <n-gradient-text type="info">
          当前运行环境:
        </n-gradient-text>
        <n-gradient-text type="warning">
          {{ model }}
        </n-gradient-text>
      </p>

      <n-radio-group v-model:value="model" size="large" @update:value="updateLua">
        <n-radio-button
          v-for="(item, key) in netLua" :key="key" :value="key"
        >
          {{ key }}
        </n-radio-button>
      </n-radio-group>
      <p v-if="model === 'mission'">
        <n-checkbox v-model:checked="autoFill" size="large" @update:checked="handleUpdateChecked">
          <span>自动添加 <n-gradient-text type="success">a_do_script()</n-gradient-text></span>
        </n-checkbox>
      </p>
    </div>
    <div px-2>
      <n-descriptions label-placement="top" bordered :column="Object.keys(netLua).length" my-4>
        <template v-for="(item, key) in netLua" :key="key">
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
    </div>
  </div>
  <div px-2>
    <n-space justify="center" container mx-auto my-4>
      <n-button type="primary" text-4 fw-900 :disabled="showLoading" @click="sendLua(isNet, model)">
        发送
      </n-button>
      <n-button type="error" text-4 fw-900 :disabled="showLoading" @click="clearLua">
        清空
      </n-button>
    </n-space>
    <n-alert title="执行状态" :type="alertType" :bordered="false" my-4>
      {{ received?.msg }}
    </n-alert>
    <n-card mb-36>
      <n-code :code="resultJSON" language="json" word-wrap />
    </n-card>
  </div>
</template>

<style lang="scss" scoped>

</style>
