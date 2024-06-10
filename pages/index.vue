<template>
  <div>
    <div class="form">
      <input v-model="value" />
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
          <button @click="indexToUpdate = -1">취소</button>
        </div>
      </template>
      <template v-else>
        <span @click="showUpdate(i)">{{ item }}</span>
        <div>
          <button @click="showUpdate(i)">수정</button>
          <button @click="remove(i)">삭제</button>
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

const add = () => {
  list.value.push(value.value);
  value.value = "";

  syncStorage();
};

const remove = (index: number) => {
  list.value.splice(index, 1);

  syncStorage();
};

const update = (index: number) => {
  list.value.splice(index, 1, target.value);
  indexToUpdate.value = -1;
  target.value = "";

  syncStorage();
};

const showUpdate = (index: number) => {
  indexToUpdate.value = index;
  target.value = list.value[index];
};

const syncStorage = () => {
  localStorage.setItem("list", JSON.stringify(list.value));
};

onMounted(() => {
  list.value = JSON.parse(localStorage.getItem("list") ?? "") ?? [];
});
</script>

<style lang="scss" scoped>
.form {
  margin-bottom: 10px;

  input {
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

  span {
    width: 125px;
    cursor: pointer;
    border: solid white 1px;
    border-radius: 3px;

    &:hover {
      text-decoration: underline;
      border: solid black 1px;
    }
  }

  input {
    width: 125px;
  }
}
</style>
