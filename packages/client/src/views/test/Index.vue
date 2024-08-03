<script lang="ts" setup>
const IP = ref('')
getIP().then((res) => {
  IP.value = res
})
</script>

<template>
  <h1>测试页面</h1>
  {{ IP }}
</template>
