<template>
  <main>
    <div class="tabs">
      <button @click="clickTabHandler(TAB.All)">전체</button>
      <button @click="clickTabHandler(TAB.Memo)">메모</button>
      <button @click="clickTabHandler(TAB.Work)">할 일</button>
    </div>
    <div class="body">
      <TodoList v-if="selectedTab === TAB.All" />
      <TodoList v-if="selectedTab === TAB.Memo" :only-memo="true" />
      <work v-if="selectedTab === TAB.Work" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import work from "@/pages/work.vue";

const TAB = {
  All: "all",
  Memo: "memo",
  Work: "work"
};

const selectedTab = ref<string>(TAB.All);

const clickTabHandler = (tab: string) => {
  selectedTab.value = tab;
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
