<template>
  <div>
    <CalendarComponent ref="calendarRef" @changed-target="changeTarget" />
    <TodoList
      style="margin-top: 10px"
      :target-date="targetDate"
      @add-or-remove-work="addOrRemoveWork"
    />
  </div>
</template>

<script lang="ts" setup>
import dayjs, { Dayjs } from "dayjs";

const calendarRef = ref();
const targetDate = ref<Dayjs>(dayjs());

const changeTarget = (date: Dayjs) => {
  targetDate.value = date;
};

const addOrRemoveWork = () => {
  calendarRef.value.syncDatesWithWork();
};
</script>

<style lang="scss" scoped></style>
