<script lang="ts" setup>
import Fa6SolidGlobe from '~icons/fa6-solid/globe'
import Fa6SolidArchway from '~icons/fa6-solid/archway?raw&width=1em&height=1em'
import logo from '~icons/lc/logo'

// Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.
const list = reactive([
  {
    name: 'Button 1',
    icon: markRaw(logo),
  },
  {
    name: 'Button 2',
    icon: shallowRef(logo),
  },
])

function renderIcon(item: any): VNodeChild {
  return h(NIcon, null, {
    default: () => h(item.icon),
  })
}
</script>

<template>
  <div class="icons">
    <ul>
      <li i-fa6-solid:arrows-rotate />
      <li>
        <img src="@/assets/icons/logo.svg" w-500>
        <n-button icon-placement="right" secondary strong>
          <template #icon>
            <n-icon>
              <!-- 直接使用不报:Vue received a Component that was made a reactive object -->
              <logo />
            </n-icon>
          </template>
          +100 元
        </n-button>
      </li>
      <li>
        <template v-for="item in list" :key="item.name">
          <n-button secondary strong :render-icon="() => renderIcon(item)">
            {{ item.name }}
          </n-button>
        </template>
      </li>
      <li>
        <p>
          <span>Icon</span>
          <!-- <Fa6SolidDesktop class="v-icon" /> -->
        </p>
        <p>
          <span>icon-</span>
          <!-- <icon-fa6-solid:desktop class="v-icon" /> -->
        </p>
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
</template>

<style lang="scss" scoped>
li {
  margin-top: 4px;
}
</style>
