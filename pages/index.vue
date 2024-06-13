<template>
  <main>
    <div class="tabs">
      <button @click="clickTabHandler(true)">메모</button>
      <button @click="clickTabHandler(false)">할 일</button>
    </div>
    <div class="body">
      <memo v-if="isMemo" />
      <work v-if="!isMemo" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import memo from "@/pages/memo.vue";
import work from "@/pages/work.vue";

const isMemo = ref<boolean>(true);

const clickTabHandler = (memo: boolean) => {
  isMemo.value = memo;
};

onBeforeMount(() => {
  useWorkList().value.init();
});
</script>

<style lang="scss" scoped>
main {
  width: 285px;
}

.tabs {
  display: flex;
  height: 30px;
  margin-bottom: 10px;

  button {
    flex: 1;
  }
}
</style>
