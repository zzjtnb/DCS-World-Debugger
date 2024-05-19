<script lang="ts" setup>
const luaStore = useLuaStore()
const loadstring_tip = `
return net.get_player_list()
return coalition
return country
`

luaStore.codemirror.code = `local res = {}
for k, v in pairs(_G) do
  -- res[k] = v
  res[k] = type(v)
end
return res`
</script>

<template>
  <n-alert :show-icon="false">
    lua原生的loadstring没限制返回类型,所以hook和export里可以直接返回table<br>
    <n-code :code="loadstring_tip" language="lua" word-wrap />
  </n-alert>
</template>
