<template>
  <card ref="Card" style="min-width: 900px;min-height: 300px">
    <div slot="header">
      <go-back @back="goBack" content="全景图预览"/>
    </div>
    <div id="viewer" style="margin: 0 auto;min-height: 300px"></div>
  </card>
</template>

<script>
  import {getDeptPictureApi} from '@/api/construction';
  import {Viewer} from 'photo-sphere-viewer'
  import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'

  export default {
    name: "ConstructionView",
    data() {
      return {
        width: 798,
        height: 498,
        panorama: null,
        viewer: null
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      }
    },
    activated() {
      this.getData()
    },
    deactivated() {
      this.viewer.destroy()
    },
    methods: {
      getData() {
        this.$refs.Card.start()
        getDeptPictureApi({id: this.id}).then(result => {
          this.$refs.Card.stop()
          let response = result.resultParam.deptPictureDto.path
          if (response.includes(',')) { // 六张
            let list = response.split(',')
            list = list.map(item => this.$baseApi + item)
            this.panorama = {}
            if (list[0]) this.panorama.left = list[0]
            if (list[1]) this.panorama.front = list[1]
            if (list[2]) this.panorama.right = list[2]
            if (list[3]) this.panorama.back = list[3]
            if (list[4]) this.panorama.top = list[4]
            if (list[5]) this.panorama.bottom = list[5]
          } else { // 单张
            this.panorama = this.$baseApi + response
          }
          this.init()
        }).catch(() => {
          this.$refs.Card.stop()
        })
      },
      init() {
        this.viewer = new Viewer({
          container: document.getElementById('viewer'),
          panorama: this.panorama,
          size: {
            width: this.width,
            height: this.height
          },
          navbar: [
            'autorotate',
            'zoom',
            'fullscreen'
          ]
        })
      },
      goBack() {
        this.$router.push({
          name: 'construction_list'
        })
      }
    }
  }
</script>
