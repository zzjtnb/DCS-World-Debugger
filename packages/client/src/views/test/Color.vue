<script lang="ts" setup>
const colors = ref<any>({})
getColor().then((res) => {
  console.log('🚀 ~ getColor ~ res:', res)
  colors.value = res
})
const active: any = ref('红')
</script>

<template>
  <main p-20 text-center>
    <ul mb-10 flex-center gap-10>
      <li v-for="(item, color) in colors" :key="color" @click="active = color">
        {{ color }}
      </li>
    </ul>
    <ul class="list">
      <li v-for="(item, index) in colors[active]" :key="index" class="card" :style="{ backgroundColor: item.hex }">
        {{ item.name }}
      </li>
    </ul>
  </main>
</template>

<style scoped lang="scss">
main {
  min-height: 100vh;
  background-color: #415462;

  // background-color: rgb(255 255 255 / 50%);
  background-image: url('@/assets/images/fresh-snow.png');
  box-shadow: 0 0 3px 2px rgb(0 0 0 / 10%);

  ul {
    li {
      cursor: pointer;
    }
  }

  .list {
    @apply flex flex-wrap gap-10;

    width: 60%;
  }

  .card {
    @apply flex-center h-100 w-100;

    // @apply flex-center;
    // width: 268px;
    // height: 682px;
    // background-image: url('@/assets/images/color-bg-removebg-preview.png');
    box-shadow: 0 0 3px 2px rgb(0 0 0 / 10%);
  }
}
</style>
