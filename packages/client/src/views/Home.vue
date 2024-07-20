<script lang="ts" setup>
import { net } from '@/utils/model'
</script>

<template>
  <div mx-auto mb-4 text-center container>
    <n-gradient-text
      :size="28" fw-900 :gradient="{
        deg: 160,
        from: '#0093E9 0%',
        to: '#80D0C7 100%',
      }"
    >
      {{ $t('home.title') }}
    </n-gradient-text>
  </div>
  <n-alert type="info">
    <p v-for="(item, key) in $t('home.info').split('\n')" :key="key">
      {{ item }}
    </p>
  </n-alert>

  <n-descriptions label-placement="top" bordered :column="Object.keys(net).length" my-16>
    <template v-for="(item, key) in net" :key="key">
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
</template>
