<template>
  <n-layout>
    <n-layout-content embedded content-style="padding: 10px 20px;" class="content-scroll" :native-scrollbar="false">
      <router-view />
      <n-back-top :right="100" />
    </n-layout-content>
  </n-layout>
</template>

<style scoped>
.content-scroll {
  height: 100vh;
  overflow-y: auto;
}
</style>
