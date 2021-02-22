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
      <el-table-column prop="cover" label="封面">
        <template slot-scope="scope">
          <el-image
              fit="contain"
              style="height: 100px"
              :src="$getImage(scope.row.cover)"
              :preview-src-list="[$getImage(scope.row.cover)]">
            <div slot="error">
              <img src="../../../../assets/notFound.png" alt="" style="height: 100px"/>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="全景图">
        <template slot-scope="scope">
          <el-image
              fit="contain"
              style="height: 100px"
              :src="$getFirstImage(scope.row.path)"
              :preview-src-list="$getImageList(scope.row.path)">
            <div slot="error">
              <img src="../../../../assets/notFound.png" alt="" style="height: 100px"/>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="所属部门">
        <template slot-scope="scope">
          {{scope.row.dept | formatObj}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="200">
        <template slot-scope="scope">
          <el-button icon="el-icon-view" @click.stop="view(scope.row)"></el-button>
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
  import {pageDeptPictureApi, delDeptPictureApi} from '@/api/construction';
  import {isIE, objectEvaluate} from "@/utils/common";
  import Add from './add';
  import Edit from './edit';
  import TreeSelect from '@/components/TreeSelect';

  export default {
    name: "ConstructionList",
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
        pageDeptPictureApi(param).then(result => {
          let response = result.resultParam.deptPictureDtoPage;
          this.formData = response.records;
          pagination.total = response.total;
          this.$refs.Card.stop();
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      view(obj) {
        if (isIE()) {
          this.$warnMsg('不支持IE浏览器')
          return
        }
        this.$router.push({
          name: 'construction_view',
          query: {
            id: obj.id
          }
        })
      },
      add() {
        this.$refs.Add.visible = true
      },
      edit(row) {
        let obj = {...row}
        let _this = this.$refs.Edit;
        if (obj.path.includes(',')) { // 六张
          let list = obj.path.split(',')
          obj.path = ''
          obj.type = 1
          if (list[0]) obj.left = list[0]
          if (list[1]) obj.front = list[1]
          if (list[2]) obj.right = list[2]
          if (list[3]) obj.back = list[3]
          if (list[4]) obj.top = list[4]
          if (list[5]) obj.bottom = list[5]
        } else { // 单张
          obj.type = 0
        }
        objectEvaluate(_this.form, obj, this);
        _this.visible = true
      },
      delData(id) {
        delDeptPictureApi({id: id})
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
