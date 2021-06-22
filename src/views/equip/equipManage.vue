<template>
    <card ref="Card">
        <div slot="header">
            <span class="title">器材管理</span>
            <el-input placeholder="输入器材名称搜索" v-model="searchName" clearable class="w-200" @keyup.enter.native="getData"/>
            <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
            <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">增添器材</el-button>
        </div>
        <expand-table :data="formData">
            <el-table-column prop="id" label="器材ID">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="器材名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="rent" label="租借费用(元/小时)">
                <template slot-scope="scope">
                    <span>{{scope.row.rent}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="器材备注">
                <template slot-scope="scope">
                    <span>{{scope.row.status}}</span>
                </template>
            </el-table-column>
            <!--      <el-table-column prop="fieldStatus" label="场地审批状态">-->
            <!--        <template slot-scope="scope">-->
            <!--          <el-tag v-if="scope.row.fieldOrder===0" type="danger">未通过</el-tag>-->
            <!--          <el-tag v-if="scope.row.fieldOrder===1" type="warning">审核中</el-tag>-->
            <!--          <el-tag v-if="scope.row.fieldOrder===2" type="success">已通过</el-tag>-->
            <!--        </template>-->
            <!--      </el-table-column>-->
            <!--      <el-table-column prop="equipStatus" label="器材审批状态">-->
            <!--        <template slot-scope="scope">-->
            <!--          <el-tag v-if="scope.row.equipOrder===0" type="danger">未通过</el-tag>-->
            <!--          <el-tag v-if="scope.row.equipOrder===1" type="warning">审核中</el-tag>-->
            <!--          <el-tag v-if="scope.row.equipOrder===2" type="success">已通过</el-tag>-->
            <!--        </template>-->
            <!--      </el-table-column>-->
            <el-table-column label="操作" align="center" width="150">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)" ></el-button>
                    <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delRole'"/>
                </template>
            </el-table-column>
        </expand-table>
        <add ref="Add" @update="getData"></add>
        <pagination ref="Pagination" @update="getData"/>
        <edit ref="Edit" @update="getData"/>
    </card>
</template>

<script>
    import Add from'./add'
    import Edit from'./edit'
    import {delEquipApi,pageEquipApi,getEquipApi} from "../../api/equip";
    import {objectEvaluate} from "@/utils/common";

    export default {
        name: "equipManage",
        components:{Add,Edit},
        data(){
            return{
                formData:[],
                searchName:''
            }
        },
        mounted() {
            this.getData();
        },
        methods:{
            getData() {
                this.$refs.Card.start();
                let pagination = this.$refs.Pagination;
                let param = {
                    current: pagination.current,
                    size: pagination.size,
                    name : this.searchName
                };
                pageEquipApi(param).then(result => {
                    let response = result.resultParam.equipPage;
                    this.formData = response.records;
                    pagination.total = response.total;
                    this.$refs.Card.stop();
                })
            },
            add() {
                this.$refs.Add.visible = true
            },
            // 删除
            delData(id) {
                delEquipApi({ids: id})
                    .then(() => {
                        this.getData();
                        this.$refs[id].close()
                    })
                    .catch(() => {
                        this.$refs[id].stop();
                    })
            },
            // 编辑
            edit(obj) {
                this.$refs.Card.start();
                this.$refs.Edit.visible = true
                getEquipApi({id: obj.id}).then(result => {
                    let response = result.resultParam.event;
                    let _this = this.$refs.Edit;
                    _this.form.id = obj.id; // 添加编辑的id
                    objectEvaluate(_this.form, response, this);
                    _this.visible = true;
                    this.$refs.Card.stop();
                }).catch(() => {
                    this.$refs.Card.stop();
                })
            },
        }

    }
</script>

<style scoped>

</style>