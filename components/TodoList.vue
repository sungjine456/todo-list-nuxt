<template>
  <div>
    <div class="form">
      <input v-model="work" @keypress.enter="add" />
      <button @click="add">추가</button>
    </div>
    <div v-if="!workMap.size">
      <p class="empty">비었습니다.</p>
    </div>
    <div v-for="(key, i) in keys" :key="key" class="item">
      <template v-if="indexToUpdate === key">
        <input v-model="updatedWork" />
        <div>
          <button @click="update(key)">확인</button>
          <button @click="cancelUpdate()">취소</button>
        </div>
      </template>
      <template v-else>
        <div class="work">
          <p class="title">
            {{ printTitle(key) }}
          </p>
          <p class="body" @click="checkWork(key)">
            {{ workMap.get(key)?.work }}
          </p>
          <div
            v-if="workMap.get(key)?.checked"
            class="check"
            @click="checkWork(key)"
          ></div>
        </div>
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
import { type WorkItem } from "~/utils/WorkList";

const props = defineProps({
  onlyMemo: Boolean,
  targetDate: Dayjs
});
const emit = defineEmits(["addOrRemoveWork"]);

const work = ref<string>("");
const updatedWork = ref<string>("");
const indexToUpdate = ref<number>(-1);
const targetedDate = ref<Dayjs | undefined>(props.targetDate);
const workMap = ref<Map<number, WorkItem>>(new Map());
const keys = ref<number[]>([]);

const add = () => {
  setMap(useWorkList().value.add(work.value, targetedDate.value));

  work.value = "";

  emit("addOrRemoveWork");
};

const remove = (index: number) => {
  if (window.confirm("삭제 하시겠습니까?")) {
    setMap(useWorkList().value.remove(index));

    emit("addOrRemoveWork");
  }
};

const update = (index: number) => {
  const work = useWorkList().value.get(index);
  work.work = updatedWork.value;
  setMap(useWorkList().value.update(index, work));
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

const checkWork = (index: number) => {
  const work = useWorkList().value.get(index);
  work.checked = !work.checked;
  setMap(useWorkList().value.update(index, work));
};

const clickUp = (index: number) => {
  if (index !== 0) {
    setMap(
      useWorkList().value.changeOrder(keys.value[index], keys.value[index - 1])
    );
  }
};

const clickDown = (index: number) => {
  if (index !== workMap.value.size - 1) {
    setMap(
      useWorkList().value.changeOrder(keys.value[index], keys.value[index + 1])
    );
  }
};

const printTitle = (index: number): string => {
  const work = workMap.value.get(index);

  if (work && work.date) {
    return dayjs(work.date).format("YYYY-MM-DD");
  } else {
    return "메모";
  }
};

const setMap = (newMap: Map<number, WorkItem>) => {
  if (!props.onlyMemo && !targetedDate.value) {
    workMap.value = newMap;
  } else {
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
      ) {
        filteredMap.set(k, v);
      }
    });

    workMap.value = filteredMap;
  }

  keys.value = Array.from(workMap.value.keys()).reverse();
};

onMounted(() => {
  setMap(useWorkList().value.getMap());
});

watch(
  () => props.targetDate,
  (n: Dayjs | undefined) => {
    targetedDate.value = n;

    setMap(useWorkList().value.getMap());
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
  position: relative;
  justify-content: space-between;

  .work {
    border: solid white 1px;
    border-radius: 3px;

    &:hover {
      border: solid black 1px;
      cursor: pointer;
    }

    p {
      margin: 0;

      &.title {
        color: gray;
        font-size: 8px;
      }

      &.body {
        width: 185px;
        height: 24px;
        font-size: 22px;
        line-height: 1;
      }
    }

    .check {
      position: absolute;
      border: 2px solid #6ec6fb;
      width: 181px;
      top: 22px;
    }
  }

  input {
    width: 180px;
  }

  .buttons {
    display: flex;
    position: relative;
    align-items: center;

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
