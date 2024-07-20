<script lang="ts" setup>
import { net } from '@/utils/model'

const luaStore = useLuaStore()
const autoFill = ref(false)

function handleUpdateChecked(value: boolean) {
  const regex = /a_do_script\(\[\[((?:.|\n)*?)\]\]\)/
  const match = luaStore.codemirror.code.match(regex)
  if (value) {
    if (match)
      return
    luaStore.codemirror.code = `a_do_script([[${luaStore.codemirror.code}]])`
  }
  else {
    if (!match)
      return
    const extractedText = match[1]
    luaStore.codemirror.code = extractedText
  }
}
function updateLua() {
  if (!luaStore.state || luaStore.state === 'lua')
    luaStore.state = 'gui'
  luaStore.codemirror.code = net[luaStore.state as keyof typeof net].code
  luaStore.resetReceived()
}
updateLua()
</script>

<template>
  <n-alert :show-icon="false">
    <n-code code="net.dostring_in(state, string) -> string" language="lua" word-wrap />
    在给定的内部 lua-state 中执行一个 lua-string 并返回一个字符串结果.<br>
    你可以把一个table转成json返回出来,但没法直接返回一个table.<br>
  </n-alert>

  <div mx-auto my-16 text-center container>
    <p mb-8 mt--8 text-32 fw-900>
      <n-gradient-text type="info">
        {{ $t('debug.state') }}:
      </n-gradient-text>
      <n-gradient-text type="warning">
        {{ luaStore.state }}
      </n-gradient-text>
    </p>
    <n-radio-group v-model:value="luaStore.state" size="large" @update:value="updateLua">
      <n-radio-button v-for="(item, key) in net" :key="key" :value="key">
        {{ key }}
      </n-radio-button>
    </n-radio-group>

    <div v-if="luaStore.state === 'mission'">
      <n-checkbox v-model:checked="autoFill" size="large" my-8 @update:checked="handleUpdateChecked">
        <span>{{ $t('debug.auto') }} <b>a_do_script()</b>
        </span>
      </n-checkbox>
      <n-alert v-if="autoFill" title="a_do_script注意事项" type="info">
        <p flex>
          <b text-red> a_do_script</b> 括号中用单引号包裹则内容中只能使用双引号,反之亦然,这里建议直接使用<b text-red>[[]]</b> 包裹
        </p>
        <ul>
          <li>
            <span text-red>错误示范: </span>
            <span flex><n-code

              word-wrap inline
              code="a_do_script('net.log('测试LUA')')"
              language="lua"
            />或者  <n-code

              word-wrap inline
              code="a_do_script(&quot;net.log(&quot;测试LUA&quot;)&quot;)"
              language="lua"
            /></span>
          </li>
          <li>
            <span text-emerald> 正确示范: </span>
            <span flex><n-code

              word-wrap inline
              code="a_do_script('net.log(&quot;测试LUA&quot;)')"
              language="lua"
            /> 或者 <n-code

              word-wrap inline
              code="a_do_script(&quot;net.log('测试LUA')&quot;)"
              language="lua"
            /></span>
          </li>
          <li>
            <span text-lightblue>推荐使用: </span>
            <span flex>
              <n-code

                word-wrap inline
                code="a_do_script([[net.log('测试LUA')]])"
                language="lua"
              />
            </span>
          </li>
        </ul>
      </n-alert>
    </div>
  </div>
</template>
