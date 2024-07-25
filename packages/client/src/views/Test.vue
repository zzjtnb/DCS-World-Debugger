<script lang="ts" setup>
import Fa6SolidGlobe from '~icons/fa6-solid/globe'

import Fa6SolidArchway from '~icons/fa6-solid/archway?raw&width=1em&height=1em'

getIP().then((res) => {
  console.log(res)
})
</script>

<template>
  <img src="@/assets/icons/logo.svg" w-500>
  <div class="icons">
    <ul>
      <li>
        <Fa6SolidGlobe />
        <IFa6SolidFile style=" color: red;font-size: 2em" />
        <div i-fa6-solid:globe />
        <i-lc-logo text-4em />
        <div i-lc-logo text-4em color-teal />
      </li>
      <li>
        <p>import Fa6SolidArchway from '~icons/fa6-solid/archway?raw&width=1em&height=1em'</p>
        <p>{{ Fa6SolidArchway }}</p>
      </li>
    </ul>
  </div>
  <ul pb-100>
    <li><h1>测试页面</h1></li>
    <li>  <hr border-1 border-blue border-solid></li>
    <li i-fa6-solid:arrows-rotate />
    <li class="box" />
    <li class="h-100 w-100 bg-red text-30 hover:text-emerald">
      unocss hover
    </li>
    <li class="box-apply">
      unocss apply
    </li>
    <!-- <p>
        <span>Icon</span>
        <Fa6SolidDesktop class="v-icon" />
      </p>
      <p>
        <span>icon-</span>
        <fa6-solid:desktop class="v-icon" />
      </p> -->
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
    <li class="warp" flex-center h-100 w-200>
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
      <div class="h-20 w20 bg-blue" />
    </li>
    <li class="warp" flex-center h-100 w-200 gap-10>
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
