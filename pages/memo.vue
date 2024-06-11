<template>
  <div>
    <div class="form">
      <input v-model="value" @keypress.enter="add" />
      <button @click="add">추가</button>
    </div>
    <div v-if="!list.length">
      <p>비었습니다.</p>
    </div>
    <div v-for="(item, i) in list" :key="i" class="item">
      <template v-if="indexToUpdate === i">
        <input v-model="target" />
        <div>
          <button @click="update(i)">확인</button>
          <button @click="cancelUpdate()">취소</button>
        </div>
      </template>
      <template v-else>
        <span @click="showUpdate(i)">{{ item }}</span>
        <div v-show="!isUpdating" class="buttons">
          <div>
            <button @click="showUpdate(i)">수정</button>
            <button @click="remove(i)">삭제</button>
          </div>
          <div class="arrows">
            <button class="arrow" :disabled="i === 0" @click="clickUp(i)">
              ↑
            </button>
            <button
              class="arrow"
              :disabled="i === list.length - 1"
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
const target = ref<string>("");
const indexToUpdate = ref<number>(-1);
const value = ref<string>("");
const list = ref<string[]>([]);
const isUpdating = ref<boolean>(false);

const add = () => {
  list.value.push(value.value);
  value.value = "";

  syncStorage();
};

const remove = (index: number) => {
  if (window.confirm("삭제 하시겠습니까?")) {
    list.value.splice(index, 1);

    syncStorage();
  }
};

const update = (index: number) => {
  list.value.splice(index, 1, target.value);
  indexToUpdate.value = -1;
  target.value = "";
  isUpdating.value = false;

  syncStorage();
};

const showUpdate = (index: number) => {
  indexToUpdate.value = index;
  target.value = list.value[index];
  isUpdating.value = true;
};

const cancelUpdate = () => {
  indexToUpdate.value = -1;
  isUpdating.value = false;
};

const syncStorage = () => {
  localStorage.setItem("list", JSON.stringify(list.value));
};

const clickUp = (index: number) => {
  if (index !== 0) {
    changeValue(index, index - 1);
  }
};

const clickDown = (index: number) => {
  if (index !== list.value.length - 1) {
    changeValue(index, index + 1);
  }
};

const changeValue = (target: number, next: number) => {
  const temp = list.value[next];
  list.value[next] = list.value[target];
  list.value[target] = temp;

  syncStorage();
};

onMounted(() => {
  list.value = JSON.parse(localStorage.getItem("list") ?? "") ?? [];
});
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  margin-bottom: 10px;

  input {
    width: 225px;
    height: 19px;
    margin-right: 5px;
  }

  button {
    height: 25px;
  }
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
