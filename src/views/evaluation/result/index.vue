<template>
  <card ref="Card" class="mb-20">
    <div slot="header">
      <go-back :content="title" @back="goBack"/>
      <span v-if="type===1">单选题</span>
      <span v-if="type===2">多选题</span>
      <span v-if="type===3">简答题</span>
    </div>
    <el-table :data="formData" v-if="this.type === 1 || this.type === 2">
      <el-table-column prop="name" label="姓名"/>
      <el-table-column :label="'选项' + $alphabet[index]" align="center" v-for="(item, index) in columns" :key="item">
        <template slot-scope="scope">
          <span v-if="scope.row.resultList.length -1 < index">无</span>
          <el-progress v-else :percentage="$getProgress(scope.row.resultList[index])"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150">
        <template slot-scope="scope">
          <el-tag type="info" v-if="isAnonymity">匿名</el-tag>
          <el-button @click.stop="view(scope.row)" v-else>查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="formData" v-if="this.type === 3">
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="dept" label="部门"/>
      <el-table-column prop="job" label="职位"/>
      <el-table-column label="操作" fixed="right" align="center" width="150">
        <template slot-scope="scope">
          <el-tag type="info" v-if="isAnonymity">匿名</el-tag>
          <el-button @click.stop="view(scope.row)" v-else>查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @update="getData"/>
    <detail ref="Detail" :topicId="topicId"/>
  </card>
</template>

<script>
  import {pageResultApi} from '@/api/evaluation';
  import Detail from './detail'

  export default {
    name: "Result",
    components: {Detail},
    data() {
      return {
        formData: [],
        columns: [],
        type: null,
        isAnonymity: null,
        title: '',
        topicId: null
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
    methods: {
      view(obj) {
        this.topicId = obj.id
        this.$refs.Detail.visible = true;
      },
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          evaluateId: this.id
        };
        this.$refs.Card.start();
        pageResultApi(param).then(result => {
          this.type = result.resultParam.evaluate.type
          this.title = result.resultParam.evaluate.title
          this.isAnonymity = result.resultParam.evaluate.isAnonymity
          let response = result.resultParam.topicDtoPage;
          this.formData = response.records;
          if (this.type === 1 || this.type === 2) { // 单选题 多选题
            let index = 0
            let length = 0
            this.formData.forEach((item, i) => {
              let list = item.content.split(',')
              if (list.length >= length) {
                list.length = length
                index = i
              }
            })
            this.columns = this.formData[index].content.split(',')
          }
          pagination.total = response.total;
          this.$refs.Card.stop();
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      goBack() {
        this.$router.push({
          name: 'evaluation_project'
        })
      }
    }
  }
</script>
