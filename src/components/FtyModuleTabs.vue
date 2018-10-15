<template>
  <q-tabs v-model="module" :inverted="$q.theme === 'ios'" :style="$q.theme === 'ios' ? { background: 'rgba(255,255,255,0.95' } : null">
    <q-tab v-for="item in moduleList" :key="item.name" :name="item.name" slot="title" :icon="item.icon" replace :label="$t(item.title)" @select="selectTab" v-ripple/>
  </q-tabs>
</template>
<script>
export default {
  name: "FtyModuleTabs",
  props: {
    moduleList: {
      type: Array,
      required: true
    },
    currentModule: {
      type: String,
      defult:''
    }
  },
  data(){
    return {
       module:this.currentModule
    }
  },
  methods:{
    selectTab(name){
      this.$emit('select',name)
    }
  },
  watch:{
     currentModule(val){
       this.module=val
     }
  }
};
</script>
