<template>
  <div>
    <div class="form">
      <input v-model="work" @keypress.enter="add" />
      <button @click="add">추가</button>
    </div>
    <div v-if="!workMap.size">
      <p class="empty">비었습니다.</p>
    </div>
    <div v-for="(key, i) in workMap.keys()" :key="key" class="item">
      <template v-if="indexToUpdate === key">
        <input v-model="updatedWork" />
        <div>
          <button @click="update(key)">확인</button>
          <button @click="cancelUpdate()">취소</button>
        </div>
      </template>
      <template v-else>
        <span @click="showUpdate(key)">{{ workMap.get(key)?.work }}</span>
        <div v-show="indexToUpdate < 0" class="buttons">
          <div>
            <button @click="showUpdate(key)">수정</button>
            <button @click="remove(key)">삭제</button>
          </div>
          <div class="arrows">
            <button class="arrow" :disabled="i === 0" @click="clickUp(i)">
              ↑
            </button>
            <button
              class="arrow"
              :disabled="i === workMap.size - 1"
              @click="clickDown(i)"
            >
              ↓
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs, { Dayjs } from "dayjs";
import { type WorkItem, WorkItemList } from "~/utils/WorkList";

const props = defineProps({
  targetDate: Dayjs
});

const workItemList = WorkItemList();

const work = ref<string>("");
const updatedWork = ref<string>("");
const indexToUpdate = ref<number>(-1);
const targetedDate = ref<Dayjs | undefined>(props.targetDate);
const workMap = ref<Map<number, WorkItem>>(new Map());

const add = () => {
  setMap(workItemList.add(createWorkItem(work.value)));

  work.value = "";
};

const remove = (index: number) => {
  if (window.confirm("삭제 하시겠습니까?")) {
    setMap(workItemList.remove(index));
  }
};

const update = (index: number) => {
  setMap(workItemList.update(index, createWorkItem(updatedWork.value)));
  indexToUpdate.value = -1;
  updatedWork.value = "";
};

const showUpdate = (index: number) => {
  indexToUpdate.value = index;
  updatedWork.value = workMap.value.get(index)?.work ?? "";
};

const cancelUpdate = () => {
  indexToUpdate.value = -1;
};

const clickUp = (index: number) => {
  if (index !== 0) {
    const keys: number[] = [...workMap.value.keys()];

    setMap(workItemList.changeOrder(keys[index], keys[index - 1]));
  }
};

const clickDown = (index: number) => {
  if (index !== workMap.value.size - 1) {
    const keys: number[] = [...workMap.value.keys()];

    setMap(workItemList.changeOrder(keys[index], keys[index + 1]));
  }
};

const createWorkItem = (work: string): WorkItem => {
  return { work: work, date: targetedDate.value };
};

const setMap = (newMap: Map<number, WorkItem>) => {
  const date: Dayjs | undefined =
    targetedDate.value && dayjs(targetedDate.value);
  const filteredMap = new Map<number, WorkItem>();

  newMap.forEach((v, k) => {
    const d: Dayjs | undefined = v.date && dayjs(v.date);

    if (
      (!d && d === date) ||
      (d?.year?.() === date?.year?.() &&
        d?.month?.() === date?.month?.() &&
        d?.date?.() === date?.date?.())
    )
      filteredMap.set(k, v);
  });

  workMap.value = filteredMap;
};

onMounted(() => {
  setMap(workItemList.init());
});

watch(
  () => props.targetDate,
  (n: Dayjs | undefined) => {
    targetedDate.value = n;

    setMap(workItemList.getMap());
  }
);
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  input {
    width: 229px;
    height: 19px;
  }

  button {
    height: 25px;
  }
}

.empty {
  margin: 0;
  height: 24px;
}

.item {
  display: flex;
  justify-content: space-between;
  height: 24px;

  span {
    width: 170px;
    cursor: pointer;
    border: solid white 1px;
    border-radius: 3px;

    &:hover {
      text-decoration: underline;
      border: solid black 1px;
    }
  }

  input {
    width: 170px;
  }

  .buttons {
    display: flex;
    position: relative;

    .arrows {
      display: flex;
      align-items: center;
      height: 100%;
      position: absolute;
      right: -45px;

      .arrow {
        border-radius: 10px;
        width: 20px;
        height: 20px;
        padding: 0;
        font-size: 13px;
        line-height: 0;
      }
    }
  }
}
</style>
