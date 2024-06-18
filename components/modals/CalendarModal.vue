<template>
  <modal-wrapper @close-modal="emit('closeModal')">
    <template #main>
      <div class="header">
        <span :class="{ can: isMonth }" @click="yearHandler">{{
          printYears()
        }}</span>
        <div>
          <button @click="clickDownHandler">↓</button>
          <button @click="clickUpHandler">↑</button>
        </div>
      </div>
      <div class="body">
        <span
          v-for="index in range()"
          :key="index"
          class="item"
          @click="chooseDate(index)"
          >{{ index }}</span
        >
      </div>
    </template>
  </modal-wrapper>
</template>

<script lang="ts" setup>
import dayjs, { Dayjs } from "dayjs";
import ModalWrapper from "./ModalWrapper.vue";

const props = defineProps({ year: { type: Number, required: true } });

const emit = defineEmits<{
  (e: "closeModal"): void;
  (e: "chooseDate", value: Dayjs): void;
}>();

const startNum = ref<number>(1);
const isMonth = ref<boolean>(true);
const year = ref<number>(props.year);

const printYears = () => {
  return isMonth.value ? year.value : `${year.value - 5}-${year.value + 6}`;
};

const yearHandler = () => {
  isMonth.value = false;
  startNum.value = year.value - 5;
};

const range = (): number[] => {
  return Array.from({ length: 12 }, (_, i) => startNum.value + i);
};

const clickUpHandler = () => {
  if (isMonth.value) {
    year.value += 1;
  } else {
    year.value += 10;
    startNum.value += 10;
  }
};

const clickDownHandler = () => {
  if (isMonth.value) {
    year.value -= 1;
  } else {
    year.value -= 10;
    startNum.value -= 10;
  }
};

const chooseDate = (date: number) => {
  if (isMonth.value) {
    emit("chooseDate", dayjs(`${year.value}-${date}`));
  } else {
    year.value = date;
    isMonth.value = true;
    startNum.value = 1;
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 15px;
  height: 44px;

  span {
    font-size: 24px;
    cursor: default;

    &.can:hover {
      cursor: pointer;
      color: rgb(110, 110, 110);
    }
  }

  button {
    width: 20px;
    height: 20px;
    padding: 0;
    border: 1px solid black;
    border-radius: 15px;

    &:first-child {
      margin-right: 5px;
    }
  }
}

.body {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;

  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 67.2px;
    height: 48px;
    border: 2px solid rgb(204, 204, 204);
    border-radius: 15px;
    cursor: pointer;
    background-color: rgb(204, 204, 204);

    &:hover {
      background-color: rgb(140, 140, 140);
      border-color: rgb(41, 223, 255);
    }
  }
}
</style>
