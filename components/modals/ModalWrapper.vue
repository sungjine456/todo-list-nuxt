<template>
  <div class="background" @click="closeModal">
    <div class="main">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["closeModal"]);

const closeModal = (event: MouseEvent) => {
  if (!event) {
    emit("closeModal");
  } else if ((event.target as Element).classList.contains("background")) {
    emit("closeModal");
  }

  event.stopPropagation();
};
</script>

<style lang="scss" scoped>
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.35);

  .main {
    width: 285px;
    min-height: 200px;
    background-color: white;
    border: 1px solid black;
    border-radius: 15px;
  }
}
</style>
