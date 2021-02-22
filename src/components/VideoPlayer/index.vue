<template>
  <div class="player">
    <video-player
        class="video-player vjs-custom-skin"
        ref="VideoPlayer"
        :playsinline="true"
        style="object-fit:fill"
        :options="playerOptions"
        :x5-video-player-fullscreen="true"
        @play="onPlayerPlay($event)"
    >
    </video-player>
  </div>
</template>

<script>
  import {videoPlayer} from 'vue-video-player';
  import 'video.js/dist/video-js.css'
  import 'vue-video-player/src/custom-theme.css'

  export default {
    name: 'VideoPlayer',
    components: {
      videoPlayer
    },
    props: {
      sources: {
        required: true
      }
    },
    data() {
      return {
        timer: null,
        playerOptions: {
          autoplay: false, // 如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "video/mp4",
            src: this.sources
          }],
          poster: "封面地址",
          width: 900,
          notSupportedMessage: '此视频暂无法播放', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            // timeDivider: true,
            // durationDisplay: true,
            // remainingTimeDisplay: false,
            fullscreenToggle: true  // 全屏按钮
          }
        }
      }
    },
    mounted() {
      this.timer = setInterval(() => {
        let duration = this.player.cache_.duration
        if (!duration) duration = 0
        duration = parseInt(duration)
        this.$emit('getDuration', duration)
      }, 1000)
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    methods: {
      onPlayerPlay(player) {
        player.play()
      }
    },
    computed: {
      player() {
        return this.$refs.VideoPlayer.player
      }
    },
    watch: {
      sources(value) {
        this.player.src(value)
        this.player.reset()
      }
    }
  }
</script>

<style>
  .player {
    width: 460px;
    margin: 0 auto;
  }
</style>
