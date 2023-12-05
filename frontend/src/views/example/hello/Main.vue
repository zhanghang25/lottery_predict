<template>
<div>
    <div style="display: flex;justify-content: space-between;margin-inline: 20px;margin-block: 10px">


      <n-button @click="goTo">返回首页</n-button>
      <span>预测人：{{ route.query.name }} / 日期 {{ route.query.date }}</span>
    </div>
    <div style="height:100px;overflow-y: scroll">

    <p :key="index" v-for="(item,index) in records">{{ item.value.split("").join(",") }}</p>
    </div>
    <n-input placeholder="今日预测值" style="margin-bottom: 10px" type="textarea" :rows="3" v-model:value="curText" :allow-input="onlyAllowNumber" />
    <n-button @click="submitResult" type="info">提交预测</n-button>
    <div style="display: flex;justify-content: center;margin-block:20px">
   <n-input-number
      v-model:value="predict"
      placeholder="输入预测值"
      :min="1"
      :max="4"
      width="200"
      style="margin-right:10px"
    />
  <n-button @click="predictValue" type="primary">输入并预测</n-button>
</div>
  <div style="font-size: 16px">
    预测结果：<div :key="index" v-for="(item,index) in text">
        {{item}}
      </div>  
  </div>
</div>
</template>

<script>
  import { defineComponent,onMounted,ref } from 'vue'
  import { NButton,NInputNumber ,NInput} from 'naive-ui'
import {ipc} from '@/utils/ipcRenderer.js'
import {ipcApiRoute} from '@/api/main.js'
import {useRouter,useRoute} from 'vue-router'

  export default defineComponent({
    name: 'Main',
    components: {
        NButton,
        NInputNumber,
        NInput
    },
    setup(props) {
        onMounted(() => {
            list()
        })
        const curText =ref("")
        const predict =ref("")
        const records = ref([])
        const text = ref("")
        const route = useRoute()
        async function predictValue(){
          curText.value += "" + predict.value
          console.log(route)
          console.log(11122)
          let result = await ipc.invoke(ipcApiRoute.predict,{num:predict.value,value:curText.value,name:route.query.name})
          console.log(result)
          predict.value = ""
          text.value = result.split("\n")
        }
        async function  list(){
          records.value =  await ipc.invoke(ipcApiRoute.getRecord,route.query.name)
          console.log(records.value)
            console.log(111)
        }
        async function submitResult() {
            console.log(curText)
            console.log(curText.value)
            if(curText.value == ""){
                return
            }
            ipc.invoke(ipcApiRoute.add,{value:curText.value,date:new Date(),name:route.query.name},records.value.length)
            curText.value = ""
            list()
            console.log(predict.value)

        }

        const router = useRouter()        
        function goTo(){
            router.push("/example")
        }

        return {
          route,
            predict,
            records,
            curText,
            list,
            submitResult, 
            onlyAllowNumber: (value) => {
                return /^[1-4]*$/.test(value)
            },
            goTo,
            predictValue,
            text
        }
    }
  })
</script>
<style scoped>
::-webkit-scrollbar {
    display: none;
}
</style>