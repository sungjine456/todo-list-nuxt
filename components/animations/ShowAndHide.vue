<template>
  <div ref="container" class="container">
    <div ref="main" class="main">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({ show: Boolean });

const container = ref<HTMLDivElement>();
const main = ref<HTMLDivElement>();

const trigger = async () => {
  if (main.value?.style.display === "block") {
    container.value?.style.setProperty(
      "height",
      `${container.value?.offsetHeight}px`
    );

    await new Promise((wait) => setInterval(wait, 1));

    main.value?.style.setProperty("opacity", "0");
    container.value?.style.setProperty("height", "0px");

    await new Promise((wait) => setInterval(wait, 1000));

    main.value?.style.setProperty("display", "none");
  } else {
    container.value?.style.setProperty("height", "0px");
    main.value?.style.setProperty("display", "block");

    await new Promise((wait) => setInterval(wait, 1));

    main.value?.style.setProperty("opacity", "1");
    container.value?.style.setProperty(
      "height",
      `${main.value?.offsetHeight}px`
    );

    await new Promise((wait) => setInterval(wait, 1000));

    container.value?.style.setProperty("height", "auto");
  }
};

onMounted(() => {
  if (props.show) {
    trigger();
  }
});

watch(
  () => props.show,
  () => {
    trigger();
  }
);
</script>

<style lang="scss" scoped>
.container {
  transition: all 1s;
  overflow-y: hidden;
}

.main {
  display: none;
  opacity: 0;
  transition: all 1s;
  margin: 0;
}
</style>
