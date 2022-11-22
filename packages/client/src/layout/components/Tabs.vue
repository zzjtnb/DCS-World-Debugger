<script lang="ts" setup>
const size = ref<'small' | 'medium' | 'large'>('medium')
const tabsList = ref([
  { name: 'oasis', tab: 'Oasis' },
  { name: 'the beatles', tab: 'the Beatles' },
  { name: 'jay chou', tab: '周杰伦' },
])
</script>

<template>
  <n-tabs type="card" :size="size" closable class="tabs-view">
    <template v-for="item in tabsList" :key="item.name">
      <n-tab :name="item.name" :tab="item.tab" class="tabs-card-scroll-item" />
    </template>
  </n-tabs>
</template>

<style lang="scss" scoped>
.tabs-view {
  :deep(.n-tabs-nav.n-tabs-nav--card-type .n-tabs-tab.n-tabs-tab--active) {
    border: 1px solid var(--n-tab-border-color);
  }

  :deep(.n-tabs-nav.n-tabs-nav--card-type .n-tabs-tab-pad) {
    border: none;
  }

  :deep(.n-tabs-nav.n-tabs-nav--card-type .n-tabs-pad) {
    border: none;
  }
}
</style>
