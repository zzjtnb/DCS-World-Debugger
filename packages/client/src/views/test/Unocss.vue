<script lang="ts" setup>

</script>

<template>
  <ul pb-100>
    <li>  <hr border-1 border-blue border-solid></li>

    <li class="box" />
    <li class="h-100 w-100 bg-red text-30 hover:text-emerald">
      unocss hover
    </li>
    <li class="box-apply">
      unocss apply
    </li>

    <li mt10 h100 w100 bg-red />
    <li class="warp" h-100 w-200 flex>
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
    </li>
    <li class="warp" h-100 w-200 flex items-center>
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
    </li>
    <li class="warp" h-100 w-200 flex items-center justify-center>
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
    </li>
    <li class="warp" h-100 w-200 flex-center>
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
    </li>
    <li class="warp" h-100 w-200 flex-center gap-10>
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
    </li>
    <li class="warp" h-100 w-200 flex flex-col items-center justify-center gap-10>
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
    </li>
    <li class="warp" h-100 w-200 flex-col-center gap-10>
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
li {
  margin-top: 4px;
}

.box {
  width: 100px;
  height: 100px;
  background-color: salmon;
}

.box-apply {
  @apply w-100 h-100 bg-red text-30 hover:text-emerald;
}

.warp {
  border: 1px solid gray;
}
</style>
