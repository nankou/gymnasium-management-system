<template>
  <card ref="Card">
    <div slot="header">
      <tree-select
          v-model="searchByDept"
          style="float: left;width: 200px;"
          :tree="dept"
          placeholder="选择部门搜索"
          @get="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <el-table :data="formData">
      <el-table-column label="年份" prop="year"/>
      <el-table-column label="总学分要求" prop="allLearnTime"/>
      <el-table-column label="性质" prop="nature">
        <template slot-scope="scope">
          <span v-if="scope.row.nature === 0">选修</span>
          <span v-if="scope.row.nature === 1">必修</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" prop="dept">
        <template slot-scope="scope">
          {{scope.row.dept | formatObj}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)"></el-button>
          <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @update="getData"/>
    <add ref="Add" :dept="dept" @update="getData"></add>
    <edit ref="Edit" :dept="dept" @update="getData"></edit>
  </card>
</template>

<script>
  import {treeDeptApi} from '@/api/system/dept';
  import {pageLearnTimeApi, delLearnTimeApi} from '@/api/study/time';
  import {objectEvaluate} from "@/utils/common";
  import Add from './add';
  import Edit from './edit';
  import TreeSelect from '@/components/TreeSelect';

  export default {
    name: "TotalHours",
    components: {Add, Edit, TreeSelect},
    data() {
      return {
        formData: [],
        dept: [],
        searchByDept: null
      }
    },
    mounted() {
      this.getData()
      this.getDept()
    },
    methods: {
      getDept() {
        treeDeptApi({deptName: ''}).then(result => {
          this.dept = result.resultParam.deptTree;
        })
      },
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          deptId: this.searchByDept
        };
        this.$refs.Card.start();
        pageLearnTimeApi(param).then(result => {
          let response = result.resultParam.learnTimeDtoPage;
          this.formData = response.records;
          pagination.total = response.total;
          this.$refs.Card.stop();
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      add() {
        this.$refs.Add.visible = true
      },
      edit(obj) {
        let _this = this.$refs.Edit;
        objectEvaluate(_this.form, obj, this);
        _this.visible = true
      },
      delData(id) {
        delLearnTimeApi({id: id})
          .then(() => {
            this.getData();
            this.$refs[id].close()
          })
          .catch(() => {
            this.$refs[id].stop();
          })
      }
    }
  }
</script>
