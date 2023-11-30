<template>

    <router-view/>
</template>

<script>
import {NMessageProvider} from 'naive-ui'
export default {
  components:{
    NMessageProvider
  },
name: 'App',
setup() {
  document.getElementById('loadingPage').remove()
}
}
</script>
<style lang="less"></style>
