<template>
  <div id="app">
    <img src="./assets/logo.png" />
    <div class="id-input-wrapper">
      <span>输入干员ID|文件名</span>
      <el-input style="width: 200px; padding-left: 20px" v-model="id"></el-input>
    </div>
    <div class="spine-panel-container">
      <spine-panel ref="spine" :id="id" :replaceBuild="false"></spine-panel>
    </div>
    <div class="id-arrary">
      <div v-for="aId in idArr" :key="aId">
        <el-button @click="id = aId">{{aId}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Input } from 'element-ui'
Vue.use(Input)

import SpinePanel from './components/SpinePanel'

import localforage from 'localforage'

export default {
  name: 'app',
  components: {
    SpinePanel
  },
  data() {
    const set = new Set()
    set.add('char_002_amiya')
    console.log(set)
    return {
      id: 'char_002_amiya',
      store: null,
      idArr: set
    }
  },
  async mounted() {
    const store = this.store = await localforage.createInstance('id')
    store.getItem('id')
      .then(id => {
        this.id = id
        this.idArr.add(id)
      })

    store.getItem('idArr')
      .then(arr => arr && (this.idArr = arr))
  },
  watch: {
    id(v) {
      v = this.id = this.id.replace('build_', '')
      this.store.setItem('id', v)
      this.$refs.spine.init()
      this.idArr.add(v)
    }
  }
}
</script>

<style lang="stylus" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60px
}

.id-input-wrapper {
  display: flex
  justify-content: center
  align-items: center
  padding-top: 30px
}

.spine-panel-container {
  position: relative
  width: 300px
  height: 360px
  margin: 0 auto
}

.id-arrary {
  position: absolute
  right: 0
  top: 0
}
</style>
