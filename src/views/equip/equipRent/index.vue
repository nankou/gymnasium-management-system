<template>
    <card ref="Card">
        <div slot="header">
            <span class="title">器材列表</span>
            <el-input placeholder="输入器材名称搜索" v-model="searchName" clearable class="w-200" @keyup.enter.native="getData"/>
            <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
        </div>
        <expand-table :data="formData">
            <el-table-column prop="id" label="器材编号">
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
            <el-table-column prop="describes" label="器材备注">
                <template slot-scope="scope">
                    <span>{{scope.row.describes}}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="150">
                <template slot-scope="scope">
                    <el-button type="primary"  @click.stop="edit(scope.row)" >租借</el-button>
                    <!--                    <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delRole'"/>-->
                </template>
            </el-table-column>
        </expand-table>
        <pagination ref="Pagination" @update="getData"/>

        <edit ref="Edit" @update="getData"/>

    </card>

</template>

<script>
    import Edit from'./edit'
    import {pageEquipApi,getEquipApi,pageRentEquipmentApi} from "../../../api/equip";
    import {objectEvaluate} from "@/utils/common";

    export default {
        name: "equipRent",
        components:{Edit},
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
                    status:0,
                };
                pageEquipApi(param).then(result => {
                    let response = result.resultParam.equipPage;
                    this.formData = response.records;
                    pagination.total = response.total;
                    this.$refs.Card.stop();
                })
            },
            // 编辑
            edit(obj) {
                this.$refs.Card.start();
                this.$refs.Edit.visible = true
                getEquipApi({id: obj.id}).then(result => {
                    let response = result.resultParam.equip;
                    let _this = this.$refs.Edit;
                    _this.repairList.equipId = obj.id; // 添加编辑的id
                    _this.repairList.equipName = obj.name;
                    _this.change.id = obj.id;
                    // objectEvaluate(_this.form, response, this);
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