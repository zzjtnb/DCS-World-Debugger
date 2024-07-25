<script lang="ts" setup>

</script>

<template>
  <n-layout>
    <n-layout-header bordered>
      <Header />
    </n-layout-header>
    <n-layout-content embedded content-style="padding: 10px 20px;" class="content-scroll" :native-scrollbar="false">
      <Main />
      <n-back-top :right="100" />
    </n-layout-content>
  </n-layout>
</template>

<style scoped>
.content-scroll {
  height: calc(100vh - 64px);
  overflow-y: auto;
}
</style>
