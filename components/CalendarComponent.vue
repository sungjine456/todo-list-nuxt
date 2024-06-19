<template>
  <div class="calendar">
    <div class="handler">
      <button @click="addMonth(-1)">&lt;</button>
      <span @click="openedModal = true">{{
        targetDate.format("YYYY년 MM월")
      }}</span>
      <button @click="addMonth(1)">&gt;</button>
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
                (idx === 0 && secondIdx < monthStartDay) ||
                (idx >= dates.length - 2 && day < 20),
              red: secondIdx === 0,
              blue: secondIdx === 6,
              today:
                day === now.date() &&
                targetDate.month() === now.month() &&
                targetDate.year() === now.year(),
              target: day === targetDate.date()
            }"
            @click="(e) => changeTarget(e.target as Element, day)"
          >
            <p>{{ day }}</p>
            <p>{{ printDailyProgress(day) }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <calendar-modal
    v-if="openedModal"
    :year="targetDate.year()"
    @close-modal="closeModal()"
    @choose-date="chooseDateHandler"
  />
</template>

<script lang="ts" setup>
import dayjs, { Dayjs } from "dayjs";
import CalendarModal from "./modals/CalendarModal.vue";

interface Progress {
  checks: number;
  works: number;
}

const emit = defineEmits<{ (e: "changedTarget", valeu: Dayjs): void }>();

const days = ["일", "월", "화", "수", "목", "금", "토"];
const now = dayjs();

const dates = ref<number[][]>([]);
const targetDate = ref<Dayjs>(now);
const monthStartDay = ref<number>(0);
const dailyProgresList = ref<Map<number, Progress>>(new Map());

const openedModal = ref<boolean>(false);

const addMonth = (month: number) => {
  targetDate.value = targetDate.value.add(month, "month");

  calculateCalender();
};

const calculateCalender = () => {
  const thisMonth = targetDate.value.set("date", 1);
  const previousMonth = targetDate.value.add(-1, "month");

  monthStartDay.value = thisMonth.day();

  dates.value = getMonthOfDays(
    thisMonth.daysInMonth(),
    previousMonth.daysInMonth()
  );

  syncDatesWithWork();

  emit("changedTarget", dayjs(targetDate.value));
};

const getMonthOfDays = (
  lastDate: number,
  prevMonthLastDate: number
): number[][] => {
  const dates: number[][] = [];
  let datesInWeek: number[] = [];

  for (
    let i = prevMonthLastDate - monthStartDay.value + 1;
    i <= prevMonthLastDate;
    i++
  ) {
    datesInWeek.push(i);
  }

  for (let i = 1; i <= lastDate; i++) {
    datesInWeek.push(i);

    if (datesInWeek.length === 7) {
      dates.push(datesInWeek);
      datesInWeek = [];
    }
  }

  const len = datesInWeek.length;

  if (len > 0 && len < 7) {
    for (let i = 1; i <= 7 - len; i++) {
      datesInWeek.push(i);
    }
  }

  if (datesInWeek.length > 0) dates.push(datesInWeek);

  if (dates.length < 6) {
    let lastNext = dates[dates.length - 1][6] + 1;
    datesInWeek = [];

    if (lastNext > 27) lastNext = 1;

    for (let i = lastNext; i < lastNext + 7; i++) {
      datesInWeek.push(i);
    }

    dates.push(datesInWeek);
  }

  return dates;
};

const changeTarget = (t: Element | null, day: number) => {
  // TODO: 이전 달이나 다음 달의 날짜를 누르면 해당 달로 이동하도록 수정하면 좋을 듯
  if (!t?.classList.contains("gray")) {
    targetDate.value = targetDate.value.set("date", day);

    emit("changedTarget", dayjs(targetDate.value));
  }
};

const syncDatesWithWork = () => {
  const dailyList: Map<number, Progress> = new Map();

  const listOfWorkInMonth = useWorkList().value.getMap(
    targetDate.value.year(),
    targetDate.value.month()
  );

  listOfWorkInMonth.forEach((v) => {
    if (v.date) {
      const date = dayjs(v.date).date();

      let w = dailyList.get(date);

      if (w) {
        w.works += 1;

        if (v.checked) {
          w.checks += 1;
        }
      } else {
        w = { checks: v.checked ? 1 : 0, works: 1 };
      }

      dailyList.set(date, w);
    }
  });

  dailyProgresList.value = dailyList;
};

const printDailyProgress = (day: number): string => {
  const w = dailyProgresList.value.get(day);

  return w ? `${w.works - w.checks}/${w.works}` : "";
};

const closeModal = () => {
  openedModal.value = false;
};

const chooseDateHandler = (date: Dayjs) => {
  targetDate.value = date;
  calculateCalender();
  closeModal();
};

defineExpose({ syncDatesWithWork });

onMounted(() => {
  calculateCalender();
});
</script>

<style lang="scss" scoped>
.calendar {
  display: flex;
  flex-direction: column;
  border: 1px solid gray;
  border-radius: 7px;
  margin-bottom: 10px;

  .handler {
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
    margin: 10px;
    border-bottom: 1px solid gray;

    button {
      margin: 0 5px;
    }

    span {
      cursor: pointer;

      &:hover {
        color: rgb(110, 110, 110);
      }
    }
  }

  table {
    text-align: center;

    td {
      cursor: pointer;
      border: 1px solid white;
      border-radius: 7px;
      position: relative;

      &.gray {
        cursor: default;
        color: gray !important;
        border-color: white !important;
      }

      &.red {
        color: red;
      }

      &.blue {
        color: blue;
      }

      &.today {
        font-weight: 700;
        color: green;

        p:first-child {
          text-decoration: underline;
        }
      }

      &.target {
        border-color: skyblue;
      }

      &:hover {
        border-color: red;
      }

      p {
        margin: 0;

        &:last-child {
          height: 13px;
          color: black;
          font-size: 10px;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
