<script lang="ts" setup>
// 表单测试
const message = useMessage()
const valueRef = ref()
const formRef = ref<FormInst | null>(null)
const formItem = {
  rule: [
    {
      required: true,
      trigger: ['input'],
      validator: () => {
        if (!valueRef.value) {
          return new Error('请输入查询单位')
        }
        return true
      },
    },
    {
      trigger: ['blur'],
      validator(rule: FormItemRule, value: string) {
        return true
      },
    },
  ],
}

function search() {
  const res = formRef.value?.validate()
  res?.then(() => {
    message.success('通过')
  }).catch((err) => {
    console.log(err)
  })
}
</script>

<template>
  <n-form-item ref="formRef" :rule="formItem.rule" :show-label="false" w-200>
    <n-input v-model:value="valueRef" placeholder="请输入查询单位">
      <template #suffix>
        <n-icon cursor-pointer @click="search()">
          <div i-fa6-solid:magnifying-glass />
        </n-icon>
      </template>
    </n-input>
  </n-form-item>
</template>

<style scoped lang="scss">
 // TODO
</style>
