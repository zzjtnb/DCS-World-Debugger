<script lang="ts" setup>

</script>

<template>
  <n-layout :native-scrollbar="false">
    <n-scrollbar>
      <n-layout-header>
        <Header />
      </n-layout-header>
      <n-layout-content>
        <!-- <Tabs /> -->
        <Main />
      </n-layout-content>
    </n-scrollbar>
    <n-back-top :right="100" />
  </n-layout>
</template>

<style lang="scss" scoped>

</style>
