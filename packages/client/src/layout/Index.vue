<script lang="ts" setup>
const layoutScrollbarProps = {
  containerClass: 'document-scroll-container',
  size: 10,
}
</script>

<template>
  <n-layout
    :native-scrollbar="false" :scrollbar-props="layoutScrollbarProps" h-full
  >
    <n-layout-header>
      <Header />
    </n-layout-header>
    <n-layout-content mx-6 mt-6>
      <Main />
    </n-layout-content>
    <n-back-top :right="100" />
  </n-layout>
</template>
