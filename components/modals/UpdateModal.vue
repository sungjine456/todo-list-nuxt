<template>
  <modal-wrapper @close-modal="emit('closeModal')">
    <template #main>
      <div class="radios">
        <label for="memo">메모</label>
        <input
          id="memo"
          v-model="type"
          type="radio"
          name="type"
          :value="TYPE.Memo"
          @change="changeType"
        />
        <label for="date">할 일</label>
        <input
          id="date"
          v-model="type"
          type="radio"
          name="type"
          :value="TYPE.Date"
          @change="changeType"
        />
      </div>
      <div class="input">
        <label for="work">할 일 : </label>
        <input id="work" v-model="work" type="text" />
      </div>
      <show-and-hide :show="type === TYPE.Date" style="padding: 0px 10px">
        <template #main>
          <calendar-component
            :hide-progress="true"
            @changed-target="selectedDate"
          />
        </template>
      </show-and-hide>
      <div class="buttons">
        <button @click="update">수정</button>
        <button @click="emit('closeModal')">취소</button>
      </div>
    </template>
  </modal-wrapper>
</template>

<script lang="ts" setup>
import { type Dayjs } from "dayjs";
import ModalWrapper from "./ModalWrapper.vue";
import ShowAndHide from "../animations/ShowAndHide.vue";
import { type WorkItem } from "~/utils/WorkList";

const TYPE = {
  Memo: "memo",
  Date: "date"
};

const props = defineProps<{ workItem: WorkItem }>();
const emit = defineEmits<{
  (e: "closeModal"): void;
  (e: "update", value: WorkItem): void;
}>();

const work = ref<string>(props.workItem.work);
const date = ref<Dayjs | undefined>(props.workItem.date);
const type = ref<string>(date.value ? TYPE.Date : TYPE.Memo);

const changeType = () => {
  if (type.value === TYPE.Memo) {
    date.value = undefined;
  }
};

const update = () => {
  emit("update", {
    work: work.value,
    date: date.value,
    checked: props.workItem.checked
  });
};

const selectedDate = (dayjs: Dayjs) => {
  date.value = dayjs;
};
</script>

<style lang="scss" scoped>
.radios {
  margin: 10px;
}

.input {
  margin: 0 10px 10px 10px;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  margin: 0 10px 10px 0;

  button:first-child {
    margin-right: 10px;
  }
}
</style>
