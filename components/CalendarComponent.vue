<template>
  <div class="calendar">
    <div class="handler">
      <button @click="calculateDate(-1)">&lt;</button>
      {{ year }}년 {{ month }}월
      <button @click="calculateDate(1)">&gt;</button>
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
                (dates.length - 1 === idx && nextMonthStart > day),
              red: secondIdx === 0,
              blue: secondIdx === 6,
              today:
                day === today && month === currentMonth && year === currentYear,
              target:
                !(
                  (idx === 0 && day >= lastMonthStart) ||
                  (dates.length - 1 === idx && nextMonthStart > day)
                ) && day === target
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
const emit = defineEmits(["changedTarget"]);

const days = ["일", "월", "화", "수", "목", "금", "토"];
const dates = ref<number[][]>([]);
const currentYear = ref<number>(0);
const currentMonth = ref<number>(0);
const year = ref<number>(0);
const month = ref<number>(0);
const lastMonthStart = ref<number>(0);
const nextMonthStart = ref<number>(0);
const today = ref<number>(0);
const target = ref<number>(0);

const now = new Date();
currentYear.value = now.getFullYear();
currentMonth.value = now.getMonth() + 1;
year.value = currentYear.value;
month.value = currentMonth.value;
today.value = now.getDate();
target.value = today.value;

const calculateDate = (arg: number = 0) => {
  if (arg < 0) {
    month.value -= 1;
  } else if (arg === 1) {
    month.value += 1;
  }

  if (month.value === 0) {
    year.value -= 1;
    month.value = 12;
  } else if (month.value > 12) {
    year.value += 1;
    month.value = 1;
  }

  const [monthFirstDay, monthLastDate, lastMonthLastDate] = getFirstDayLastDate(
    year.value,
    month.value
  );
  dates.value = getMonthOfDays(monthFirstDay, monthLastDate, lastMonthLastDate);
};

const getFirstDayLastDate = (year: number, month: number) => {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  let lastYear = year;
  let lastMonth = month - 1;

  if (month === 1) {
    lastMonth = 12;
    lastYear -= 1;
  }

  const prevLastDate = new Date(lastYear, lastMonth, 0).getDate();

  return [firstDay, lastDate, prevLastDate];
};

const getMonthOfDays = (
  monthFirstDay: number,
  monthLastDate: number,
  prevMonthLastDate: number
): number[][] => {
  let day: number = 1;
  let prevDay: number = prevMonthLastDate - monthFirstDay + 1;
  const dates: number[][] = [];
  let weekOfDays: number[] = [];

  while (day <= monthLastDate) {
    if (day === 1) {
      for (let j = 0; j < monthFirstDay; j += 1) {
        if (j === 0) lastMonthStart.value = prevDay;

        weekOfDays.push(prevDay);
        prevDay += 1;
      }
    }

    weekOfDays.push(day);

    if (weekOfDays.length === 7) {
      dates.push(weekOfDays);
      weekOfDays = [];
    }

    day += 1;
  }

  const len = weekOfDays.length;

  if (len > 0 && len < 7) {
    for (let k = 1; k <= 7 - len; k += 1) {
      weekOfDays.push(k);
    }
  }

  if (weekOfDays.length > 0) dates.push(weekOfDays);

  nextMonthStart.value = weekOfDays[0];

  return dates;
};

const changeTarget = (t: Element | null, day: number) => {
  // TODO: 이전 달이나 다음 달의 날짜를 누르면 해당 달로 이동하도록 수정하면 좋을 듯
  if (!t?.classList.contains("gray")) {
    target.value = day;

    emit(
      "changedTarget",
      new Date(`${currentYear.value}-${currentMonth.value}-${day}`)
    );
  }
};

onMounted(() => {
  calculateDate();

  emit("changedTarget", now);
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
