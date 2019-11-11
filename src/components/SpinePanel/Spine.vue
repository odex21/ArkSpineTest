<template>
  <div class="spine-panel" :style="'--border-width:' + borderWidth + 'px'">
    <div class="spine-id">
      <p v-if="debug">当前状态： {{mode[0]}} {{state ? '正常加载' : '加载失败'}}</p>
    </div>

    <div class="control-button-wrapper">
      <div>
        <el-button
          @click="swtichId"
          circle
          type="primary"
          size="mini"
          class="el-icon-sort icon-switch"
        ></el-button>
      </div>
      <div class="control-button">
        <el-button type="primary" size="mini" @click="changeAnimate(false)" class="el-icon-back"></el-button>
        <span
          style="display: inline-block;text-align: center; font-size: 13px"
          v-if="animates"
        >{{animates[curAnimate]}}</span>
        <el-button type="primary" size="mini" @click="changeAnimate(true)" class="el-icon-right"></el-button>
      </div>
    </div>
    <canvas class="spine-canvas" :style="{width, height}" ref="container"></canvas>
  </div>
</template>

<script>

import { Button } from 'element-ui';
import Spine from '../../utils/Spine/initSpine';

import Vue from 'vue';
import { debounce } from '../../utils';
Vue.use(Button);

export default {
  props: {
    canvasWidth: {
      default: 300,
      type: Number,
    },
    id: {
      required: true,
      type: String
    },
    replaceBuild: {
      type: Boolean,
      default: false
    },
    debug: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const width = (this.canvasWidth);
    return {
      animates: [],
      curAnimate: 0,
      skeletons: {},
      skins: [],
      height: (width * 1.2) + 'px',
      width: this.canvasWidth + 'px',
      curSkeleton: null,
      spinePath: '/',
      mode: ['build', 'fight_f', 'fight_b'],
      state: false
    };
  },
  watch: {
    id() {
      this.watchId(this)
    }
  },
  computed: {
    borderWidth() {
      return this.canvasWidth / 300 * 25;
    }
  },
  methods: {
    watchId: debounce(self => {
      self.init()
    }, 1000),
    swtichId() {
      this.mode.push(this.mode.shift());
      this.init();
    },
    changeAnimate(t) {
      if (!this.animates) return
      this.curAnimate = t ? this.curAnimate + 1 : this.curAnimate - 1;
      if (this.curAnimate >= this.animates.length) this.curAnimate = 0;
      else if (this.curAnimate < 0)
        this.curAnimate = this.animates.length !== 0 ? this.animates.length - 1 : 0;

      const id = this.mode[0] === 'build' ? 'build_' + this.id : this.id
      const { state, skeleton } = this.spine.skeletons[id];
      const animate = this.spine.animates[this.curAnimate];
      const loop = (/Start|Begin|End/.test(animate) ? false : true);
      state.setAnimation(0, animate, loop);
      skeleton.setToSetupPose();
    },
    async init() {
      this.spine = new Spine(this.$refs.container, this.replaceBuild);
      const id = this.mode[0] === 'build' && this.replaceBuild ? 'build_' + this.id : this.id,
        pathd = this.spinePath + this.mode[0] + '/';
      console.log(id)

      this.spine.init({ id, path: pathd })
        .then(skel => {
          this.skeletons = skel
          this.animates = this.spine.animates;
          this.state = true
        })
        .catch(error => {
          this.state = false
          console.error(error)
          return
        })
    }
  }

};
</script>

<style lang="stylus">
.spine-panel {
  position: absolute
  bottom: 0
  left: 0
  --border-width: 25px
  --border-size: calc(var(--border-width) * 3.2)

  &:hover {
    z-index: 10

    .spin-id {
      display: block
    }

    &:after, &:before {
      display: none
    }
  }

  .control-button-wrapper {
    position: absolute
    bottom: 0
    display: flex
    justify-content: space-between
    align-items: center
    z-index: 10
    width: 225px
    //padding-left: 50px
    height: 36px
  }

  .control-button {
    display: flex
    justify-content: space-between
    align-items: center
    width: 180px
  }

  .icon-switch {
    transform: rotate(90deg)
  }

  .spine-id {
    position: absolute
    top: 0
    left: 0
    text-decoration: underline
  }

  .spine-canvas {
    background: url('./spine_back_2_0.5.png') no-repeat center
    background-size: contain
  }
}
</style>
