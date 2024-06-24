<template>
  <div>
    <div class="form">
      <input v-model="work" @keypress.enter="add" />
      <button @click="add">추가</button>
    </div>
    <div v-if="!workMap.size">
      <p class="empty">등록된 내용이 없습니다.</p>
    </div>
    <div class="items">
      <div v-for="(key, i) in keys" :key="key" class="item">
        <div class="work" @click="checkWork(key)">
          <p class="title">
            {{ printTitle(key) }}
          </p>
          <p class="body">
            {{ workMap.get(key)?.work }}
          </p>
          <div
            v-if="workMap.get(key)?.checked"
            class="check"
            @click="checkWork(key)"
          ></div>
        </div>
        <div v-show="indexToUpdate < 0" class="buttons">
          <button @click="openModal(key)">수정</button>
          <button @click="remove(key)">삭제</button>
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
    </div>

    <update-modal
      v-if="openedModal"
      :work-item="updatedWorkItem!"
      @close-modal="closeModal"
      @update="update"
    />
  </div>
</template>

<script setup lang="ts">
import dayjs, { Dayjs } from "dayjs";
import { type WorkItem } from "~/utils/WorkList";
import UpdateModal from "./modals/UpdateModal.vue";

const props = defineProps({
  onlyMemo: Boolean,
  targetDate: Dayjs
});
const emit = defineEmits(["updateWork"]);

const work = ref<string>("");
const updatedWorkItem = ref<WorkItem>();
const indexToUpdate = ref<number>(-1);
const targetedDate = ref<Dayjs | undefined>(props.targetDate);
const workMap = ref<Map<number, WorkItem>>(new Map());
const keys = ref<number[]>([]);

const openedModal = ref<boolean>(false);

const add = () => {
  setMap(useWorkList().value.add(work.value, targetedDate.value));

  work.value = "";

  emit("updateWork");
};

const remove = (index: number) => {
  if (window.confirm("삭제 하시겠습니까?")) {
    setMap(useWorkList().value.remove(index));

    emit("updateWork");
  }
};

const update = (updatedWork: WorkItem) => {
  setMap(useWorkList().value.update(indexToUpdate.value, updatedWork));

  emit("updateWork");

  closeModal();
};

const openModal = (index: number) => {
  updatedWorkItem.value = useWorkList().value.get(index);
  openedModal.value = true;
  indexToUpdate.value = index;
};

const closeModal = () => {
  openedModal.value = false;
  indexToUpdate.value = -1;
};

const checkWork = (index: number) => {
  const work = useWorkList().value.get(index);
  work.checked = !work.checked;
  setMap(useWorkList().value.update(index, work));
  emit("updateWork");
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

  return work && work.date ? dayjs(work.date).format("YYYY-MM-DD") : "메모";
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

.items {
  width: 341px;
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;

  .item {
    display: flex;
    position: relative;
    justify-content: start;

    .work {
      width: 222px;
      border: solid white 1px;
      border-radius: 3px;

      &:hover {
        border-color: black;
        cursor: pointer;
      }

      p {
        margin: 0;

        &.title {
          color: gray;
          font-size: 8px;
        }

        &.body {
          height: 24px;
          font-size: 22px;
          line-height: 1;
        }
      }

      .check {
        position: absolute;
        border: 2px solid #6ec6fb;
        width: 210px;
        top: 22px;
      }
    }

    .buttons {
      display: flex;
      align-items: center;

      button {
        padding: 0;

        &.arrow {
          border-radius: 10px;
          width: 19px;
          height: 19px;
          font-size: 13px;
        }
      }
    }
  }
}
</style>
