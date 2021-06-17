<template>
  <div id="code-copy">
    <i class="el-icon-copy-document" @click="visible=true"></i>
    <el-dialog
        width="90%"
        :close-on-click-modal="false"
        :visible.sync="visible">

      <card class="mb-20">
        <div slot="header">
          <span>代码复制</span>
          <clipboard class="float-right ml-5" :text="code.tree">
            <el-button type="warning">树形</el-button>
          </clipboard>
          <clipboard class="float-right" :text="token">
            <el-button type="success">Token</el-button>
          </clipboard>
        </div>
        <el-form>
          <!--表单-->
          <el-form-item label="表单:">
            <clipboard :text="code.input">
              <el-button>input</el-button>
            </clipboard>
            <clipboard :text="code.number">
              <el-button>number</el-button>
            </clipboard>
            <clipboard :text="code.checkbox">
              <el-button>checkbox</el-button>
            </clipboard>
            <clipboard :text="code.radio">
              <el-button>radio</el-button>
            </clipboard>
            <clipboard :text="code.select">
              <el-button>select</el-button>
            </clipboard>
            <clipboard :text="code.switch">
              <el-button>switch</el-button>
            </clipboard>
            <clipboard :text="code.timePicker">
              <el-button>timePicker</el-button>
            </clipboard>
            <clipboard :text="code.yearPicker">
              <el-button>yearPicker</el-button>
            </clipboard>
            <clipboard :text="code.datePicker">
              <el-button>datePicker</el-button>
            </clipboard>
            <clipboard :text="code.datetimePicker">
              <el-button>datetimePicker</el-button>
            </clipboard>
          </el-form-item>

          <!--弹出框-->
          <el-form-item label="弹出框:">
            <clipboard :text="code.dialog">
              <el-button>index.vue</el-button>
            </clipboard>
            <clipboard :text="code.dialogHtml">
              <el-button>template</el-button>
            </clipboard>
            <clipboard :text="code.dialogRules">
              <el-button>rules</el-button>
            </clipboard>
            <clipboard :text="code.dialogSubmit">
              <el-button>submit</el-button>
            </clipboard>
          </el-form-item>

          <!--表格-->
          <el-form-item label="表格:">
            <clipboard :text="code.table">
              <el-button>index.vue</el-button>
            </clipboard>
            <clipboard :text="code.tableMiddleware">
              <el-button>中间件</el-button>
            </clipboard>
            <clipboard :text="code.routerMiddleware">
              <el-button>路由</el-button>
            </clipboard>
            <clipboard :text="code.tableHeader">
              <el-button>头部</el-button>
            </clipboard>
            <clipboard :text="code.tableSelect">
              <el-button>选择</el-button>
            </clipboard>
            <clipboard :text="code.tableDate">
              <el-button>日期</el-button>
            </clipboard>
            <clipboard :text="code.tableImage">
              <el-button>图片</el-button>
            </clipboard>
            <clipboard :text="code.tableSwitch">
              <el-button>状态</el-button>
            </clipboard>
            <clipboard :text="code.tableGet">
              <el-button>获取</el-button>
            </clipboard>
          </el-form-item>

          <!--操作-->
          <el-form-item label="操作:">
            <clipboard :text="code.operateHtml">
              <el-button>template</el-button>
            </clipboard>
            <clipboard :text="code.operateEditJs">
              <el-button>editJs</el-button>
            </clipboard>
            <clipboard :text="code.operateDelJs">
              <el-button>delJS</el-button>
            </clipboard>
          </el-form-item>
        </el-form>
      </card>

      <card>
        <div slot="header">
          <span>接口复制</span>
        </div>
        <el-form>
          <row-col :gutter="20">
            <el-input type="textarea" v-model="api"></el-input>
            <el-input type="textarea" v-model="apiStr" slot="r"></el-input>
          </row-col>
        </el-form>
        <div slot="footer">
          <clipboard :text="apiStr">
            <el-button>复制</el-button>
          </clipboard>
        </div>
      </card>

      <card>
        <div slot="header">
          <span>对象复制</span>
        </div>
        <el-form>
          <row-col :gutter="20">
            <el-input type="textarea" v-model="obj"></el-input>
            <el-input type="textarea" v-model="objStr" slot="r"></el-input>
          </row-col>
        </el-form>
        <div slot="footer">
          <clipboard :text="objStr">
            <el-button>复制</el-button>
          </clipboard>
        </div>
      </card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Code from './code'
  import {jsonPretty} from "@/utils/common";

  export default {
    name: "CodeCopy",
    data() {
      return {
        visible: false,
        api: '',
        apiStr: '',
        obj: '',
        objStr: ''
      }
    },
    computed: {
      code() {
        return Code
      },
      token() {
        return this.$storeGet.token
      }
    },
    watch: {
      api(value) {
        // 分割成数组
        let apiList = value.trim().split('\n')
        apiList = apiList.filter(item => !!item)

        // 判断格式
        if (parseInt(apiList.length / 3) !== apiList.length / 3) {
          this.$warnMsg('接口格式错误，无法转换！')
          return
        }

        // 三个一组
        let apiArr = []
        for (let i = 0; i < apiList.length; i += 3) {
          apiArr.push(apiList.slice(i, i + 3));
        }

        // 组合
        let apiStr = ''
        apiArr.forEach(item => {
          let api = ''
          let name = item[1].substring(item[1].lastIndexOf("/") + 1)
          let path = item[1].substring(1)
          if (item[0] === 'GET') {
            if (item[2].includes('导出')) {
              api = `export const ${name}Api = data => axiosL("${path}", data); // ${item[2]}`
            } else {
              api = `export const ${name}Api = data => axiosG("${path}", data); // ${item[2]}`
            }
          }
          if (item[0] === 'POST') {
            api = `export const ${name}Api = data => axiosK("${path}", data); // ${item[2]}`
          }
          if (item[0] === 'PUT') {
            api = `export const ${name}Api = data => axiosP("${path}", data); // ${item[2]}`
          }
          if (item[0] === 'DELETE') {
            api = `export const ${name}Api = data => axiosD("${path}", data); // ${item[2]}`
          }
          apiStr += api + '\n'
        })

        this.apiStr = apiStr
      },
      obj(value) {
        let keyArr = []
        let typeArr = []
        let commentArr = []
        value.replace(/(private)(.+)[;]/g, item => {
          let list = item.split(' ')
          list = list.filter(obj => !!obj)
          let lastOne = list[2]
          let key = lastOne.substring(0, lastOne.length - 1)
          keyArr.push(key)
          typeArr.push(list[1])
          return ''
        })
        value.replace(/(comment)(.+)["](.+)["]/g, item => {
          let list = item.split(`"`)
          commentArr.push(list[1].trim())
          return ''
        })
        let object = {}
        for (let i = 0; i < keyArr.length; i++) {
          let type = typeArr[i]
          let key = keyArr[i]
          if (type === 'Long') {
            if (key === 'id') object[key] = null
            else object[key] = 0
          }
          if (type === 'Integer') {
            object[key] = 0
          }
          if (type === 'Double' || type === 'BigDecimal') {
            object[key] = 0
          }
          if (type === 'String' || type === 'Timestamp') {
            object[key] = ''
          }
          if (type === 'Boolean') {
            object[key] = false
          }
        }
        object = jsonPretty(object)
        let i = 0
        object = object.replace(/(")(.+)[\n]/g, item => {
          item = item.trim()
          let list = item.split(':')
          list[0] = list[0].replace(/(")/g, '')
          item = list[0] + ':' + list[1]
          return `${item} // ${commentArr[i++]}\n`
        })

        this.objStr = object
      }
    }
  }
</script>

<style lang="scss">
  @import '../scss/index';

  #code-copy {
    line-height: $header-height;
    font-size: 22px;

    i {
      color: #909399;
      cursor: pointer;
    }

    i:hover {
      color: rgb(80, 80, 80);
    }
  }
</style>
