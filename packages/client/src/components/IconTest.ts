export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
      default: 'icon',
    },
  },
  setup(props) {
    const count = ref(1)
    // 返回渲染函数
    return () => {
      const tag = props.name.includes(`${props.prefix}-`)
        ? props.name
        : `${props.prefix}-${props.name}`
      return h(tag, {})
    }
  },
}

