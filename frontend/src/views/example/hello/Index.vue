<template>
  
  <section id="hero">
    <h1 class="tagline">
      <span class="accent" @click="test2">Predict-Master</span>
    </h1>
    <p class="description">
      您身边的预言家
    </p>
    <div style="display: flex;justify-content: center;">
      <n-popover @clickoutside="out" :show="see" trigger="click">
      <template #trigger>
        <n-button  @click="see = true" >新增人员</n-button>
      </template>
      <div style="display: flex;"> <n-input v-model:value="addName" type="text" placeholder="请输入预测人" /> <n-button type="warning" @click="addUser">新增</n-button> </div>
    </n-popover>
    </div>
    <n-select 
    style="display: inline-block;width: 350px;margin: 0 auto;"
    v-model:value="name" 
    :render-option="renderLabel"
    filterable 
    :options="options" 
    @search="handleSearch" 
    placeholder="请选择预测人" 
    clearable
    label-field="value"
    value-field="value"
    remote />
      

    <p class="actions">
      <span style="cursor: pointer;" class="setup" @click="goMain" >Get Started</span>
    </p>
  </section>
</template>
<script>
import {ipc} from '@/utils/ipcRenderer.js'
import {ipcApiRoute} from '@/api/main.js'
import { NInput,NSelect,NButton,NPopover,useMessage,createDiscreteApi, NSpace,NTooltip } from 'naive-ui';
import {h} from 'vue'
const { message, notification, dialog, loadingBar } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar']
)
export default {
  components: {
    useMessage,createDiscreteApi,
    NSelect,
    NPopover,
    NButton,
    NInput,
    NSpace,
    NTooltip,
  },
  data() {
    return {
      test: '',
      name: '',
      see: false,
      addName: '',
      options: [
        {
          label: '张三',
          value: '张三',
        },
        {
          label: '李四',
          value: '李四',
        },
        {
          label: '王五',
          value: '王五',
        },
      ],
    };
  },
  mounted(){

    this.handleSearch("")
  },
  methods: {
    out(){
      console.log(222)
      this.see = false;
    },  
    renderLabel({option,node}) {
    return   h(NTooltip, null, {
          trigger: () => node,
          default: () => h(NButton, { type:"error",style:"display:inline-block",onClick: async ()=>{
            console.log(option)
            let result = await ipc.invoke(ipcApiRoute.deleteUser,option.value)
            this.handleSearch("")
            message.info("删除成功！")
          } }, '删除')
        })
      // return option.value;
      // return h("div",{
      //   style: 'display: flex; justify-content: space-evenly;align-items:center;width: 100%'
      // }, [
      //   h('div', option.value),
      //   option.value ? h(NButton, { type:"error",style:"display:inline-block" }, '删除') : "",
      // ])
    },
   async addUser(){

      if(!this.addName){
        message.info("请输入预测人")
        return
      }
      // const message = useMessage()
      let result = await ipc.invoke(ipcApiRoute.addUser,{value:this.addName,date:new Date()})
      this.name = this.addName
      this.see = false;
      this.handleSearch("")
      console.log(result)
      message.info("插入成功！")
    },
    test2 () {
      //
      ipc.invoke(ipcApiRoute.getRecord)
      console.log(111)
      console.log(this.options)
    },
async handleSearch(str){
  this.options = await ipc.invoke(ipcApiRoute.selectUser,str)

  console.log(str)
},
    goMain(){
      if(!this.name){
        message.info("请选择预测人")
        return
      }
      this.$router.push({path: '/main',query:{name:this.name,date:(new Date()).toLocaleDateString()}})
    }
  }
};
</script>
<style scoped>
section {
  padding: 42px 32px;
}

#hero {
  padding: 150px 32px;
  text-align: center;
  height: 100%;
}

.tagline {
  font-size: 52px;
  line-height: 1.25;
  font-weight: bold;
  letter-spacing: -1.5px;
  max-width: 960px;
  margin: 0px auto;
}
html:not(.dark) .accent,
.dark .tagline {
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  max-width: 960px;
  line-height: 1.5;
  color: var(--vt-c-text-2);
  transition: color 0.5s;
  font-size: 22px;
  margin: 24px auto 40px;
}
.actions span {
  font-size: 16px;
  display: inline-block;
  background-color: var(--vt-c-bg-mute);
  padding: 8px 18px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.5s, color 0.5s;
  text-decoration:none;
}
.actions .setup {
  color: var(--vt-c-text-code);
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
}
.actions .setup:hover {
  background-color: var(--vt-c-gray-light-4);
  transition-duration: 0.2s;
}
</style>
  