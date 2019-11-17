<template>
  <div id="app">
    <div class="spine-panel-container">
      <spine-panel v-if="showSpine" ref="spine" :id="enCodeId" :replaceBuild="replaceBuild" debug></spine-panel>
    </div>
    <div class="id-arrary">
      <div v-for="aId in idArrShow" :key="aId">
        <el-button closable @click="id = aId">{{aId}}</el-button>
        <el-button @click="deleteId(aId)" type="mini" icon="el-icon-delete"></el-button>
      </div>
    </div>
    <div style="padding-top: 50px">更多信息去看readme</div>
    <div class="id-input-wrapper">
      <span>输入干员ID|文件名</span>
      <el-input style="width: 200px; padding-left: 20px" v-model="id"></el-input>
    </div>
    <div class="id-input-wrapper">
      <span>获取文件时是否加"build_"</span>
      <el-switch style="width: 200px; padding-left: 20px" v-model="replaceBuild"></el-switch>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Input, Tag, Switch } from 'element-ui'
Vue.use(Input)
Vue.use(Tag)
Vue.use(Switch)

import SpinePanel from './components/SpinePanel'
import localforage from 'localforage'

import { debounce } from './utils'

const test = (self, v) =>
  debounce(v => {
    console.log("???????????????")
    v = self.id = v.replace('build_', '')
    self.store.setItem('id', v)
    self.idArr.add(v)
    self.setItem('idArr', JSON.stringify([...this.idArr]))
  }, 500, v)

export default {
  name: 'app',
  components: {
    SpinePanel
  },
  data() {
    const set = new Set()
    set.add('char_002_amiya')
    console.log(set)
    const defaultId = 'char_002_amiya'
    return {
      id: defaultId,
      store: null,
      idArr: set,
      idArrShow: [...set],
      replaceBuild: true,
      enCodeId: encodeURIComponent(defaultId),
      showSpine: false
    }
  },
  async mounted() {
    this.showSpine = true
    const store = this.store = await localforage.createInstance('id')
    store.getItem('id')
      .then(id => {
        if (id) {
          this.id = id
          this.idArr.add(id)
          this.$nextTick().then(() => {
            // this.$refs.spine.init()
          })
        }
      })

    store.getItem('idArr')
      .then(arr => {
        if (arr) {
          const temp = JSON.parse(arr)
          temp.forEach(el => this.idArr.add(el))
          this.idArrShow = [...this.idArr]
        }
      })

  },
  watch: {
    id(v) {
      this.watchId(v, this)
    },
    replaceBuild() {
      this.$refs.spine.init()
    }
  },
  methods: {
    watchId: debounce((v, self) => {
      if (!v) return
      v = self.id = v.replace('build_', '')
      self.store.setItem('id', v)
      self.idArr.add(v)
      self.enCodeId = encodeURIComponent(v)
      self.idArrShow = [...self.idArr]
      self.store.setItem('idArr', JSON.stringify([...self.idArr]))
    }, 1000),

    deleteId(id) {
      this.idArr.delete(id)
      this.idArrShow = [...this.idArr]
      this.store.setItem('idArr', JSON.stringify([...this.idArr]))
    },
    test(v) {
      return test(this, v)
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
