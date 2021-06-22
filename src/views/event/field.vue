<template>
  <el-dialog
      title="安排场地"
      width="600px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item  label="场地列表">
        <el-select v-model="form.fieldId " @change="selectModel($event)">
          <el-option
              v-for="item in fieldList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="使用时间" prop="time">
        <date-time-picker :start.sync="form.startTime" :end.sync="form.endTime"/>
      </el-form-item>
    </el-form>
    <div slot="" class="float-right">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
    <div class="title">已安排场地</div>
    <expand-table :data="fieldReserveList" >
      <el-table-column prop="fieldId" label="场地Id">
        <template slot-scope="scope">
          <span>{{scope.row.fieldId}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fieldName" label="场地名称">
        <template slot-scope="scope">
          <span>{{scope.row.fieldName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间">
        <template slot-scope="scope">
          <span>{{scope.row.endTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="审核状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==0" type="warning">未审核</el-tag>
          <el-tag v-if="scope.row.status==1" type="successful">已审核</el-tag>
          <el-tag v-if="scope.row.status==2" type="danger">未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData"/>
        </template>
      </el-table-column>
    </expand-table>
  </el-dialog>
</template>

<script>
  import {resetForm} from "@/utils/common";
  import {addFieldReservationApi, delEventApi, delFieldReservationApi, pageFieldReservationApi} from "../../api/event";
  import {pageFieldApi} from "@/api/field";

  export default {
    name: "addEvent",
    data() {
      return {
        visible: false,
        form: {
          fieldId:"",
          eventId:"",
          startTime:"",
          endTime:"",
          status:0, // 审核状态0未审核1已审核2未通过
          type: 2, // 状态0未预约1个人2赛事3上课4校队
          fieldName:""
        },
        fieldList:[],
        fieldReserveList:[],
        rules: {
          name: {required: true, message: '请输入赛事名称', trigger: 'blur'},
          beginTime: {required: true, message: '请选择使用时间', trigger: 'change'},
          type: {required: true, message: '请输入赛事类型', trigger: 'blur'},
          phone: {required: true, message: '请输入联系方式', trigger: 'blur'},
          purpose: {required: true, message: '请输入赛事目的', trigger: 'blur'}
        }
      }
    },
    mounted() {

    },
    methods: {
      selectModel(id){
        for(let i =0;i< this.fieldList.length;i++){
          if(this.fieldList[i].id === id){
            this.form.fieldName = this.fieldList[i].name
          }
        }
      },
      getFieldList(){
        let param = {
          current: 1,
          size: 20,
        };
        pageFieldApi(param).then(result => {
          let response = result.resultParam.fieldPage;
          this.fieldList = response.records;
        })
      },
      getFieldReserveList(eventId){
        let param = {
          current: 1,
          size: 20,
          type: 2,
          eventId: eventId
        };
        pageFieldReservationApi(param).then(result => {
          let response = result.resultParam.fieldReservationPage;
          this.fieldReserveList = response.records;
        })
      },
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          this.$refs.Submit.start();
          addFieldReservationApi(data).then(result => {
            this.$refs.Submit.stop();
            if (result.status !== 200) return;
            this.getFieldReserveList(this.form.eventId);
            // this.$emit('update');
          }).catch(() => {
            this.$refs.Submit.stop();
          })
        });
      },
      cancel() {
        resetForm(this)
      },
      delData(id){
        delFieldReservationApi({ids: id})
            .then(() => {
              this.getFieldReserveList(this.form.eventId);
              this.$refs[id].close()
            })
            .catch(() => {
              this.$refs[id].stop();
            })
      }

    }
  }
</script>
<style>
.title{
  text-align: center;
  margin-top: 50px;
  font-size: large;
  font-weight: bolder;
}
</style>
