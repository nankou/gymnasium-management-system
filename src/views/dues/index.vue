<template>
  <card ref="Card">
    <div slot="header">
      <tree-select v-model="searchDept" style="float: left;width: 200px;" :tree="dept" placeholder="选择部门搜索" @get="getData"/>
      <el-select v-model="searchQuarter" @change="getData" class="ml-5" clearable>
        <el-option v-for="item in quarter" :label="item" :value="item" :key="item"/>
      </el-select>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">上传</el-button>
      <el-button class="float-right" type="success" icon="el-icon-download" @click="exportExcel">导出</el-button>
      <el-button class="float-right" type="warning" icon="el-icon-warning-outline" @click="remind">提醒缴费</el-button>
    </div>
    <el-table :data="formData">
      <el-table-column prop="quarter" label="季度"/>
      <el-table-column prop="price" label="金额(元)"/>
      <el-table-column prop="quarter" label="党员人数"/>
      <el-table-column label="部门">
        <template slot-scope="scope">
          {{scope.row.dept | formatObj}}
        </template>
      </el-table-column>
      <el-table-column prop="picture" label="图片">
        <template slot-scope="scope">
          <el-image
              fit="contain"
              style="height: 100px"
              :src="$getFirstImage(scope.row.picture)"
              :preview-src-list="$getImageList(scope.row.picture)">
            <div slot="error">
              <img src="../../assets/notFound.png" alt="" style="height: 100px"/>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)"/>
          <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @update="getData"/>
    <add ref="Add" @update="getData"></add>
    <edit ref="Edit" @update="getData"></edit>
  </card>
</template>

<script>
  import {pagePayApi, delPayApi, remindApi, exportPayApi} from '@/api/dues';
  import {delNullKey, objectEvaluate} from "@/utils/common";
  import {treeDeptApi} from "@/api/system/dept";
  import Add from './add';
  import Edit from './edit';

  export default {
    name: "Dues",
    components: {Add, Edit},
    data() {
      return {
        formData: [],
        dept: [],
        searchDept: null,
        quarter: [1, 2, 3, 4],
        searchQuarter: null
      }
    },
    mounted() {
      this.getDept()
      this.getData()
    },
    methods: {
      exportExcel() {
        this.$msgBox('确定导出？').then(() => {
          this.$startLoading()
          exportPayApi()
            .then(result => {
              this.$stopLoading()
              const blob = new Blob([result]);
              this.$fileSaver.saveAs(blob, '党费管理.xlsx');
              this.cancel();
            })
            .catch(err => {
              this.$stopLoading()
              err.response.data.text().then(res => {
                this.$errorMsg(JSON.parse(res).message)
              })
            })
        })
      },
      remind() {
        this.$msgBox('确定提醒缴费？').then(() => {
          remindApi()
        })
      },
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
          deptId: this.searchDept,
          quarter: this.searchQuarter
        };
        delNullKey(param)
        this.$refs.Card.start();
        pagePayApi(param).then(result => {
          let response = result.resultParam.payDtoPage;
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
        delPayApi({id: id})
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
