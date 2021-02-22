<template>
  <card ref="Card">
    <div slot="header" v-permission="'addPicture'">
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <el-table :data="formData">
      <el-table-column prop="name" label="图片">
        <template slot-scope="scope">
          <el-image
              fit="contain"
              style="height: 100px"
              :src="$baseApi + scope.row.name"
              :preview-src-list="[$baseApi + scope.row.name]">
            <div slot="error">
              <img src="../../../assets/notFound.png" alt="" style="height: 100px"/>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="链接"/>
      <el-table-column prop="sort" label="排序"/>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="80">
        <template slot-scope="scope">
          <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delPicture'"/>
        </template>
      </el-table-column>
    </el-table>
    <add ref="Add" @update="getData"></add>
  </card>
</template>

<script>
  import {listPictureApi, delPictureApi} from '@/api/picture';
  import Add from './add';

  export default {
    name: "Picture",
    components: {Add},
    data() {
      return {
        formData: [],
        type: 0
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        this.$refs.Card.start();
        listPictureApi({type: this.type}).then(result => {
          this.formData = result.resultParam.pictureList;
          this.$refs.Card.stop();
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      add() {
        this.$refs.Add.visible = true
      },
      delData(id) {
        delPictureApi({id: id})
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
