<template>
  <div class="tsx-counter">
    <span
      >Count: <strong>{{ count }}</strong> | Double: <strong>{{ count * 2 }}</strong></span
    >
    <button @click="count--">-</button>
    <button @click="count++">+</button>
    <button @click="count = 0">Reset</button>
    <InlineTag :text="`tsx inside vue: count is ${count}`" />
  </div>
</template>

<script setup lang="tsx">
import { ref, defineComponent } from 'vue';

const count = ref(0);

// 用 TSX 定义内联子组件，验证 tsx 语法可用
const InlineTag = defineComponent({
  props: {
    text: { type: String, required: true }
  },
  setup(props) {
    return () => <span style={{ color: 'red', marginLeft: '8px' }}>[{props.text}]</span>;
  }
});
</script>

<style scoped>
.tsx-counter {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
button {
  padding: 2px 10px;
  cursor: pointer;
}
</style>
