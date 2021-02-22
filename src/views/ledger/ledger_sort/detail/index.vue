<template>
  <card ref="Card" style="overflow: auto">
    <div slot="header">
      <go-back :content="name" @back="goBack"/>
    </div>

    <div ref="Print">
      <!--标题-->
      <p style="font-family: 'SimSun',serif; color:black;font-weight:bold;text-align:center;font-size:23px;margin:50px 0 30px 0;">
        {{title}}
      </p>
      <!--内容表格-->
      <table id="stretchableTable" border="1" cellspacing="0" cellpadding="0" :width="width+'px'" style="margin: 0 auto;">
        <thead>
        <tr>
          <th v-for="item in header" :key="item.name">{{item.name}}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in formData" :key='item.id'>
          <template v-for="(obj,col) in item.content">
            <td :key='col' v-if="obj.row" :rowspan="obj.row">

              <!--文字-->
              <span v-if="obj.type===0">{{obj.value}}</span>

              <!--文件-->
              <span v-if="obj.type===1" @click="openUploadFile(col,item)" class="span-100">
                <!--有文件-->
                <span v-if="hasFile(obj.value)" class="cursorFile">已上传</span>
                <!--无文件-->
                <span v-else class="uploadFileHover">未上传</span>
              </span>

              <!--完成情况-->
              <span v-if="obj.type===3">
                <span v-if="equals(obj.value,0)" style="color: red">未完成</span>
                <span v-if="equals(obj.value,1)" style="color: green">完成</span>
                <span v-if="equals(obj.value,2)" style="color: #E6A23C">完成部分</span>
              </span>

              <!--自评评分 互评评分 专家评分-->
              <span
                  v-if="obj.type===4"
                  :class="{'red': obj.name, 'span-100': true}"
                  @click="openChangeScore(col,item)">
                {{obj.value}}
              </span>
              <span
                  v-if="[5,6].includes(obj.type) && !isAdmin"
                  :class="{'red': obj.name, 'span-100': true}"
                  @click="openChangeScore(col,item)">
                {{obj.value}}
              </span>
              <span
                  v-if="[5,6].includes(obj.type) && isAdmin"
                  :class="{'red': obj.name, 'span-100': true}"
                  @click="openChangeScore(col,item)"
                  @contextmenu.prevent="$refs.ContextMenu.showMenu($event,{id:item.id,type:obj.type})">
                {{obj.value}}
              </span>
              <!--<el-popover-->
              <!--    placement="top-start"-->
              <!--    title="最后得分修改人为："-->
              <!--    width="100"-->
              <!--    trigger="hover"-->
              <!--    :content="!obj.name ? '无' : obj.name">-->
              <!--  <span slot="reference" style="display: inline-block;padding: 0;cursor: pointer">{{obj.value}}</span>-->
              <!--</el-popover>-->

            </td>
          </template>
        </tr>
        </tbody>
      </table>
      <!--分数表格-->
      <table id="scoreTable" v-show="isShow" border="1" cellspacing="0" cellpadding="0" :width="width+'px'" style="margin: 0 auto">
        <tbody>
        <tr>
          <td rowspan="4" style="width: 90px">分数评定</td>
          <td>自评比例</td>
          <td>{{score.myWeight}}</td>
          <td></td>
          <td>自评得分</td>
          <td>{{$fixScore(score.myScore)}}</td>
          <td>{{$fixScore(score.myScore*score.myWeight/100)}}</td>
        </tr>
        <tr>
          <td>互评比例</td>
          <td>{{score.otherWeight}}</td>
          <td></td>
          <td>互评得分</td>
          <td>{{$fixScore(score.otherScore)}}</td>
          <td>{{$fixScore(score.otherScore*score.otherWeight/100)}}</td>
        </tr>
        <tr>
          <td>专家比例</td>
          <td>{{score.leaderWeight}}</td>
          <td></td>
          <td>专家得分</td>
          <td>{{$fixScore(score.leaderScore)}}</td>
          <td>{{$fixScore(score.leaderScore*score.leaderWeight/100)}}</td>
        </tr>
        <tr>
          <td>总分</td>
          <td>100</td>
          <td></td>
          <td>总分</td>
          <td></td>
          <td>{{$fixScore(score.totalScore)}}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div slot="footer" v-show="isShow" style="margin-top: 50px">
      <el-popover ref="AdjustWidth" placement="top" width="180">
        <el-input-number v-model="width" :min="0" style="margin: 0 0 10px 25px"/>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="width = 900">复原</el-button>
          <el-button type="primary" size="mini" @click="$refs['AdjustWidth'].doClose()">确定
          </el-button>
        </div>
        <el-button slot="reference" type="success" style="margin-right: 10px">调整宽度</el-button>
      </el-popover>
      <el-button type="warning" @click="print">打印</el-button>
      <el-button type="warning" @click="exportWord">导出Word文档</el-button>
    </div>

    <e-vue-contextmenu ref="ContextMenu" class="contextmenu" @ctx-show="showMenu">
      <ul>
        <li @click="viewScore()">评分详情</li>
      </ul>
    </e-vue-contextmenu>

    <upload-file ref="UploadFile" @update="getScore"/>
    <change-score ref="ChangeScore" @update="getScore"/>
    <other-score ref="OtherScore"/>
    <leader-score ref="LeaderScore"/>
  </card>
</template>

<script>
  import {getLedgerApi, getLedgerDetailApi} from '@/api/ledger';
  import {objectEvaluate} from "@/utils/common";
  import UploadFile from "@/views/ledger/ledger_list/detail/components/UploadFile";
  import ChangeScore from "@/views/ledger/ledger_list/detail/components/ChangeScore";
  import OtherScore from "@/views/ledger/ledger_list/detail/components/OtherScore";
  import LeaderScore from "@/views/ledger/ledger_list/detail/components/LeaderScore";
  import JS from "@/views/ledger/ledger_list/detail/js";

  export default {
    name: "Detail",
    components: {UploadFile, ChangeScore, OtherScore, LeaderScore},
    mixins: [JS],
    data() {
      return {
        title: '',
        width: 900,
        isShow: false,
        createId: null,
        isScorer: null, // 评分人
        isLeader: null, // 领导
        deptId: null,
        header: [],
        formData: [],
        score: {}
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      },
      name() {
        return this.$route.query.name
      }
    },
    activated() {
      this.getData()
    },
    methods: {
      getData() {
        this.$refs.Card.start();
        getLedgerDetailApi({ledgerId: this.id}).then(result => {
          let response = result.resultParam;
          this.isScorer = response.isScoreUser
          this.isLeader = response.isLeader
          this.title = result.resultParam.ledgerDto.name
          this.createId = result.resultParam.ledgerDto.createId
          this.deptId = result.resultParam.ledgerDto.deptId
          this.header = JSON.parse(response.ledgerDto.title);
          response.ledgerRowList.forEach(item => {
            item.content = JSON.parse(item.content)
          })
          this.formData = response.ledgerRowList;
          this.getScore(response.ledgerDto)
          this.$refs.Card.stop();
          this.$nextTick(() => {
            this.addTableListening()
            this.isShow = true
          })
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },

      // 数字赋值
      getScore: async function (response) {
        if (!response) {
          await getLedgerApi({id: this.id}).then(result => {
            response = result.resultParam.ledgerDto;
          })
        }
        this.score = {
          weight: 0, // 权重
          fixedScore: 0, // 定量得分

          myWeight: 0, // 自评权重
          myScore: 0, // 自评得分

          otherWeight: 0, // 互评权重
          otherScore: 0, // 互评得分

          leaderWeight: 0, // 领导权重
          leaderScore: 0, // 领导评分得分

          totalScore: 0 // 总分
        }
        await objectEvaluate(this.score, response)
      },

      // 判断是否有文件
      hasFile(value) {
        return !!(value.includes('[')
          && value.includes(']')
          && value.includes('name')
          && value.includes('path'));
      },

      // 比较是否相等
      equals(value1, value2) {
        return value1.toString() === value2.toString();
      },

      // 打开上传文件
      openUploadFile(colIndex, row) {
        let cell = row.content[colIndex]
        let _this = this.$refs.UploadFile
        if (this.hasFile(cell.value)) { // 有文件
          _this.formData = JSON.parse(cell.value)
          _this.copyFormDate = cell.value
        } else { // 无文件
          _this.formData = []
          _this.copyFormDate = "[]"
        }
        _this.colIndex = colIndex
        _this.row = row
        _this.visible = true
      },

      // 打开分数修改
      openChangeScore(colIndex, row) {
        let cell = row.content[colIndex]
        if (cell.type === 4 && !this.isCreator) return
        if (cell.type === 5 && !this.isScorer) return
        if (cell.type === 6 && !this.isLeader) return
        let _this = this.$refs.ChangeScore
        _this.maxScore = cell.scoreCeiling
        _this.type = cell.type
        _this.form.score = cell.value
        _this.colIndex = colIndex
        _this.row = row
        _this.visible = true
      },

      // 右键菜单打开回调
      showMenu(obj) {
        this.activedCell = obj
      },

      // 查看分数详情
      viewScore() {
        let cell = this.activedCell
        if (cell.type === 5) {
          let _this = this.$refs.OtherScore
          _this.ledgerRowId = cell.id
          _this.visible = true
        }
        if (cell.type === 6) {
          let _this = this.$refs.LeaderScore
          _this.ledgerRowId = cell.id
          _this.visible = true
        }
        this.$refs.ContextMenu.hideMenu();
      },

      goBack() {
        this.$router.push({
          name: 'ledger_sort_list'
        })
      }
    }
  }
</script>
