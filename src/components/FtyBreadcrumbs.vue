<template>
    <q-breadcrumbs active-color="white" color="grey-4">
      <template v-for="item in currentPath">
          <q-breadcrumbs-el v-if="item.name==='home_index'"  :to="{ name: item.name}" :key="item.name" :label="$t(item.title)" v-ripple/>
          <q-breadcrumbs-el v-else  :key="item.name" :label="$t(item.title)" v-ripple/>
      </template>
      
    </q-breadcrumbs>
</template>
<script>
export default {
  name: "FtyBreadcrumbs",
  props: {
    currentPath: {
      type: Array,
      required: true
    }
  }
};
</script>

