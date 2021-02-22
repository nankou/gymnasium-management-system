<template>
  <el-dialog
      title="抽签"
      :width="formData.length > 0 ? '80%' : '400px'"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form label-width="80px" v-show="formData.length === 0">
      <el-form-item label="人数">
        <el-input-number
            v-model="count"
            controls-position="right"
            :precision="0"
            :min="1">
        </el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-show="formData.length === 0">
      <submit-button ref="Submit" @submit="getData" text="确定，下一步"/>
    </div>

    <card v-show="formData.length > 0">
      <el-table :data="formData">
        <el-table-column prop="name" label="姓名"/>
        <el-table-column prop="phone" label="手机号"/>
        <el-table-column prop="job" label="职务"/>
        <el-table-column prop="brief" label="简介"/>
        <el-table-column prop="photo" label="照片">
          <template slot-scope="scope">
            <el-image
                fit="contain"
                style="height: 100px"
                :src="$getImage(scope.row.photo)"
                :preview-src-list="[$getImage(scope.row.photo)]">
              <div slot="error">
                <img src="../../assets/notFound.png" alt="" style="height: 100px"/>
              </div>
            </el-image>
          </template>
        </el-table-column>
      </el-table>
    </card>
  </el-dialog>
</template>

<script>
  import {listRandomExpertApi} from '@/api/professor';
  import {resetData} from "@/utils/common";

  export default {
    name: "Lot",
    data() {
      return {
        visible: false,
        formData: [],
        count: 1
      }
    },
    methods: {
      getData() {
        this.$refs.Submit.start();
        listRandomExpertApi({count: this.count}).then(result => {
          this.$refs.Submit.stop();
          if (result.status !== 200) return
          this.formData = result.resultParam.resultList;
        }).catch(() => {
          this.$refs.Submit.stop();
        })
      },
      cancel() {
        resetData(this)
      }
    }
  }
</script>
