<template>
  <el-dialog
      title="安排器材"
      width="600px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item  label="器材列表">
        <el-select v-model="form.equipId " @change="selectModel($event)">
          <el-option
              v-for="item in equipList"
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
    <div class="title">已安排器材</div>
    <expand-table :data="rentEquipList" >
      <el-table-column prop="equipId" label="器材编号">
        <template slot-scope="scope">
          <span>{{scope.row.equipId}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="equipName" label="器材名称">
      <template slot-scope="scope">
          <span>{{scope.row.equipName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="租用开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="租用结束时间">
        <template slot-scope="scope">
          <span>{{scope.row.endTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
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
import {addRentEquipmentApi, delRentEquipmentApi, pageRentEquipmentApi} from "../../api/event";
import {pageEquipApi} from "@/api/equip";

export default {
  name: "addEvent",
  data() {
    return {
      visible: false,
      form: {
        equipId:"",
        eventId:"",
        startTime:"",
        endTime:"",
        status:2, // 器材状态0空闲1租用2赛事3报修4报废
        equipName:""
      },
      equipList:[],
      rentEquipList:[],
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
      for(let i =0;i< this.equipList.length;i++){
        if(this.equipList[i].id === id){
          this.form.equipName = this.equipList[i].name
        }
      }
    },
    getEquipList(){
      let param = {
        current: 1,
        size: 20,
      };
      pageEquipApi(param).then(result => {
        let response = result.resultParam.equipPage;
        this.equipList = response.records;
      })
    },
    getRentEquipmentList(eventId){
      let param = {
        current: 1,
        size: 20,
        type: 2,
        eventId: eventId
      };
      pageRentEquipmentApi(param).then(result => {
        let response = result.resultParam.rentEquipmentPage;
        this.rentEquipList = response.records;
      })
    },
    submit() {
      this.$refs['Form'].validate(valid => {
        if (!valid) return false;
        let data = {...this.form};
        this.$refs.Submit.start();
        addRentEquipmentApi(data).then(result => {
          this.$refs.Submit.stop();
          if (result.status !== 200) return;
          this.getRentEquipmentList(this.form.eventId);
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
      delRentEquipmentApi({ids: id})
          .then(() => {
            this.getRentEquipmentList(this.form.eventId);
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
