<template>
  <div>
    <CalendarComponent @changed-target="changeTarget" />
    <TodoList style="margin-top: 10px" :target-date="targetDate" />
  </div>
</template>

<script lang="ts" setup>
import dayjs, { Dayjs } from "dayjs";

const targetDate = ref<Dayjs>(dayjs());

const changeTarget = (date: Dayjs) => {
  targetDate.value = date;
};
</script>

<style lang="scss" scoped></style>
