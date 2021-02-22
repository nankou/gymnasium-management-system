<template>
  <el-dialog
      title="课程学习情况"
      width="80%"
      @close="cancel"
      @opened="opened"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-tabs v-model="active">
      <el-tab-pane label="视频" name="first">
        <card ref="Card_0">
          <el-table :data="formData_0">
            <el-table-column prop="name" label="课程名称"/>
            <el-table-column prop="nature" label="性质">
              <template slot-scope="scope">
                <span v-if="scope.row.nature === 0">选修</span>
                <span v-if="scope.row.nature === 1">必修</span>
              </template>
            </el-table-column>
            <el-table-column prop="learnTime" label="学分"/>
            <el-table-column prop="progress" label="学习进度">
              <template slot-scope="scope">
                <el-progress :percentage="$getProgress(scope.row.progress)"/>
              </template>
            </el-table-column>
            <el-table-column label="截止时间">
              <template slot-scope="scope">
                <span>{{scope.row.deadline | formatDateTime}}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination ref="Pagination_0" @update="getData_0"></pagination>
        </card>
      </el-tab-pane>

      <el-tab-pane label="文章" name="second">
        <card ref="Card_1">
          <el-table :data="formData_1">
            <el-table-column prop="name" label="课程名称"/>
            <el-table-column prop="nature" label="性质">
              <template slot-scope="scope">
                <span v-if="scope.row.nature === 0">选修</span>
                <span v-if="scope.row.nature === 1">必修</span>
              </template>
            </el-table-column>
            <el-table-column prop="learnTime" label="学分"/>
            <el-table-column prop="progress" label="学习进度">
              <template slot-scope="scope">
                <el-progress :percentage="$getProgress(scope.row.progress)"/>
              </template>
            </el-table-column>
            <el-table-column label="截止时间">
              <template slot-scope="scope">
                <span>{{scope.row.deadline | formatDateTime}}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination ref="Pagination_1" @update="getData_1"></pagination>
        </card>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
  import {pageUserVideoProgressApi} from '@/api/study/video'
  import {pageUserArticleProgressApi} from '@/api/study/article'
  import {resetData} from "@/utils/common";

  export default {
    name: "Condition",
    props: {
      id: {
        required: true
      }
    },
    data() {
      return {
        active: 'first',
        visible: false,
        formData_0: [],
        formData_1: []
      }
    },
    methods: {
      opened() {
        this.getData_0()
        this.getData_1()
      },
      getData_0() {
        let pagination = this.$refs.Pagination_0;
        let param = {
          id: this.id,
          current: pagination.current,
          size: pagination.size
        };
        this.$refs.Card_0.start();
        pageUserVideoProgressApi(param).then(result => {
          this.$refs.Card_0.stop();
          let response = result.resultParam.videoManageUserDtoPage;
          this.formData_0 = response.records;
          pagination.total = response.total;
        }).catch(() => {
          this.$refs.Card_0.stop();
        })
      },
      getData_1() {
        let pagination = this.$refs.Pagination_1;
        let param = {
          id: this.id,
          current: pagination.current,
          size: pagination.size
        };
        this.$refs.Card_1.start();
        pageUserArticleProgressApi(param).then(result => {
          this.$refs.Card_1.stop();
          let response = result.resultParam.articleManageUserDtoPage;
          this.formData_1 = response.records;
          pagination.total = response.total;
        }).catch(() => {
          this.$refs.Card_1.stop();
        })
      },
      cancel() {
        resetData(this)
      }
    }
  }
</script>
