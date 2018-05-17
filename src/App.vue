<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    setTimeout(() => {
      document.body.removeChild(document.getElementById("StartLoading"));
    }, 200);
  }
};
</script>

<style>

</style>
