<template>
  <NuxtPage />
</template>

<style lang="scss">
html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
}

#__nuxt {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

button {
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
}
</style>
