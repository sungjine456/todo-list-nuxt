<template>
  <div class="calendar">
    <div class="handler">
      <button @click="calculateCalender(-1)">&lt;</button>
      {{ targetDate.format("YYYY년 MM월") }}
      <button @click="calculateCalender(1)">&gt;</button>
    </div>
    <table>
      <thead>
        <th v-for="day in days" :key="day">{{ day }}</th>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in dates" :key="idx">
          <td
            v-for="(day, secondIdx) in row"
            :key="secondIdx"
            :class="{
              gray:
                (idx === 0 && day >= lastMonthStart) ||
                (dates.length - 1 === idx && day < 8),
              red: secondIdx === 0,
              blue: secondIdx === 6,
              today:
                day === now.date() &&
                targetDate.month() === now.month() &&
                targetDate.year() === now.year(),
              target:
                !(
                  (idx === 0 && day >= lastMonthStart) ||
                  (dates.length - 1 === idx && day < 8)
                ) && day === targetDate.date()
            }"
            @click="(e) => changeTarget(e.target as Element, day)"
          >
            {{ day }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import dayjs, { Dayjs } from "dayjs";

const emit = defineEmits(["changedTarget"]);

const days = ["일", "월", "화", "수", "목", "금", "토"];
const now = dayjs();

const dates = ref<number[][]>([]);
const targetDate = ref<Dayjs>(now);
const lastMonthStart = ref<number>(0);

const calculateCalender = (month: number = 0) => {
  targetDate.value = targetDate.value.add(month, "month");

  const thisMonth = targetDate.value.set("date", 1);
  const previousMonth = targetDate.value.add(-1, "month");

  dates.value = getMonthOfDays(
    thisMonth.day(),
    thisMonth.daysInMonth(),
    previousMonth.daysInMonth()
  );

  emit("changedTarget", dayjs(targetDate.value));
};

const getMonthOfDays = (
  monthFirstDay: number,
  monthLastDate: number,
  prevMonthLastDate: number
): number[][] => {
  const dates: number[][] = [];
  let weekOfDays: number[] = [];

  lastMonthStart.value = prevMonthLastDate - monthFirstDay + 1;

  for (let i = lastMonthStart.value; i <= prevMonthLastDate; i++) {
    weekOfDays.push(i);
  }

  for (let i = 1; i <= monthLastDate; i++) {
    weekOfDays.push(i);

    if (weekOfDays.length === 7) {
      dates.push(weekOfDays);
      weekOfDays = [];
    }
  }

  const len = weekOfDays.length;

  if (len > 0 && len < 7) {
    for (let i = 1; i <= 7 - len; i++) {
      weekOfDays.push(i);
    }
  }

  if (weekOfDays.length > 0) dates.push(weekOfDays);

  return dates;
};

const changeTarget = (t: Element | null, day: number) => {
  // TODO: 이전 달이나 다음 달의 날짜를 누르면 해당 달로 이동하도록 수정하면 좋을 듯
  if (!t?.classList.contains("gray")) {
    targetDate.value = targetDate.value.set("date", day);

    emit("changedTarget", dayjs(targetDate.value));
  }
};

onMounted(() => {
  calculateCalender();
});
</script>

<style lang="scss" scoped>
.calendar {
  display: flex;
  flex-direction: column;

  .handler {
    display: flex;
    justify-content: center;
    margin: 10px;

    button {
      margin: 0 5px;
    }
  }

  table {
    text-align: center;

    td {
      cursor: pointer;
      border: 1px solid white;

      &.gray {
        cursor: default;
        color: gray !important;
      }

      &.red {
        color: red;
      }

      &.blue {
        color: blue;
      }

      &.today {
        text-decoration: underline;
      }

      &.target {
        border-color: skyblue;
        border-radius: 7px;
      }
    }
  }
}
</style>
