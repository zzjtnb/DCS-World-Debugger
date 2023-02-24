<script lang="ts" setup>
import {
  alertType, autoFill, luaValue,
  netLua, received, resultJSON, sendLua, showLoading,
} from '../../hooks/lua'
const router = useRouter()
const route = useRoute()

const loadstring_code = `local res = {}
for k, v in pairs(_G) do
  -- res[k] = v
  res[k] = type(v)
end
return res`
const loadstring_tip = `return net.get_player_list()
return net.get_player_info(1)
return theatres
return theatresByName
return coalition
return country
return unit_aliases
return _current_mission.mission
`
const codemirror = ref()
const state = ref(route.query.state as string || 'gui')
luaValue.value = netLua[state.value].code
const isNet = computed(() => {
  received.value = {}
  const falg = route.path === '/dostring_in'
  if (!falg) luaValue.value = loadstring_code
  return falg
})

function handleUpdateChecked(value: boolean) {
  const regex = /a_do_script\(\[\[((?:.|\n)*?)\]\]\)/
  const match = luaValue.value.match(regex)
  if (value) {
    if (match) return
    luaValue.value = `a_do_script([[${luaValue.value}]])`
  }
  else {
    if (!match) return
    const extractedText = match[1]
    // do something with extractedText
    luaValue.value = extractedText
  }
  codemirror.value.upState(luaValue.value)
}
function updateLua(value) {
  received.value = {}
  luaValue.value = netLua[value].code
  codemirror.value.upState(luaValue.value)
  router.push({ name: 'dostring_in', query: { state: value } })
}
function clearLua() {
  luaValue.value = ''
  codemirror.value.upState(luaValue.value)
}
const message = useMessage()
const { copy, isSupported } = useClipboard()

function handleCopy() {
  if (!isSupported)
    return message.error('您的浏览器不支持Clipboard API')
  if (!resultJSON.value)
    return message.error('请输入要复制的内容')
  copy(resultJSON.value)
  message.success('复制成功')
}
function clearResult() {
  received.value = ''
}
</script>

<template>
  <div px-4 py-2>
    <n-alert :show-icon="false">
      <span v-if="isNet">
        Script/Hooks目录下的脚本在服务器启动时加载,并将用于所有任务.<br>
        执行 DCS.isServer() 或 DCS.isMultiplayer() 检查在mission(任务)中不起作用.<br>
        另外,trigger.action.outText() 在Hooks中不起作用,仅在任务中起作用.<br>
        <n-code code="net.dostring_in(state, string) -> string" language="lua" word-wrap />
        在给定的内部 lua-state 中执行一个 lua-string 并返回一个字符串结果.<br>
        你可以把一个table转成json返回出来,但没法直接返回一个table.<br>
      </span>

      <span v-else>
        lua原生的loadstring没限制返回类型,所以hook和export里可以直接返回table<br>
        <n-code :code="loadstring_tip" language="lua" word-wrap />
      </span>
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
          {{ state }}
        </n-gradient-text>
      </p>
      <n-radio-group v-model:value="state" size="large" @update:value="updateLua">
        <n-radio-button
          v-for="(item, key) in netLua" :key="key" :value="key"
        >
          {{ key }}
        </n-radio-button>
      </n-radio-group>
      <div v-if="state === 'mission'">
        <n-checkbox v-model:checked="autoFill" size="large" my-2 @update:checked="handleUpdateChecked">
          <span>自动添加 <b>a_do_script()</b>
          </span>
        </n-checkbox>
        <!-- <n-button strong secondary type="warning">
          注意事项
        </n-button> -->
        <n-alert v-if="autoFill" title="a_do_script注意事项" type="info">
          <p flex>
            <b text-red> a_do_script</b> 括号中用单引号包裹则内容中只能使用双引号,反之亦然,这里建议直接使用<b text-red>[[]]</b> 包裹
          </p>
          <ul>
            <li>
              <span text-red>错误示范: </span>
              <span flex><n-code
                inline
                word-wrap
                code="a_do_script('net.log('测试LUA')')"
                language="lua"
              />或者  <n-code
                inline
                word-wrap
                code="a_do_script(&quot;net.log(&quot;测试LUA&quot;)&quot;)"
                language="lua"
              /></span>
            </li>
            <li>
              <span text-emerald> 正确示范: </span>
              <span flex><n-code
                inline
                word-wrap
                code="a_do_script('net.log(&quot;测试LUA&quot;)')"
                language="lua"
              /> 或者 <n-code
                inline
                word-wrap
                code="a_do_script(&quot;net.log('测试LUA')&quot;)"
                language="lua"
              /></span>
            </li>
            <li>
              <span text-lightblue>推荐使用: </span>
              <span flex>
                <n-code
                  inline
                  word-wrap
                  code="a_do_script([[net.log('测试LUA')]])"
                  language="lua"
                />
              </span>
            </li>
          </ul>
        </n-alert>
      </div>
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
      <n-button type="primary" text-4 fw-900 :disabled="showLoading" @click="sendLua(isNet, state)">
        发送
      </n-button>
      <n-button type="error" text-4 fw-900 :disabled="showLoading" @click="clearLua">
        清空
      </n-button>
    </n-space>
    <n-alert title="执行状态" :type="alertType" :bordered="false" my-4>
      {{ received?.msg }}
    </n-alert>
    <n-space mx-auto my-4>
      <!-- <i i-fa6-solid-copy /> -->
      <n-button icon-placement="right" type="success" quaternary @click="handleCopy()">
        <template #icon>
          <fa6-solidcopy />
        </template>
      </n-button>
      <n-button icon-placement="right" type="error" quaternary @click="clearResult">
        <template #icon>
          <fa6-solid-broom />
        </template>
      </n-button>
    </n-space>
    <n-card mb-36>
      <n-code :code="resultJSON" language="json" word-wrap show-line-numbers />
    </n-card>
  </div>
</template>

<style lang="scss" scoped>

</style>
