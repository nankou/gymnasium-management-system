<template>
<card ref="Card">
    <div slot="header">
        <span class="title">报修清单</span>
        <el-input placeholder="输入器材名称搜索" v-model="searchName" clearable class="w-200" @keyup.enter.native="getData"/>
        <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
    </div>
    <expand-table :data="formData">
        <el-table-column prop="equipId" label="器材ID">
            <template slot-scope="scope">
                <span>{{scope.row.equipId}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="equipName" label="器材名称">
            <template slot-scope="scope">
                <span>{{scope.row.equipName}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="describes" label="报修描述">
            <template slot-scope="scope">
                <span>{{scope.row.describes}}</span>
            </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
                <el-button type="primary"  @click.stop="edit(scope.row)" >修复</el-button>
                <!--                    <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delRole'"/>-->
            </template>
        </el-table-column>
    </expand-table>
    <pagination ref="Pagination" @update="getData"/>
    <edit ref="Edit" @update="getData"/>

</card>
</template>

<script>
    import Edit from "./edit";
    import {pageRentEquipmentApi, getEquipApi,editEquipApi,getRentEquipmentApi, editRentEquipmentApi} from "../../../api/equip";
    export default {
        name: "repairList",
        components:{Edit},
        data() {
            return {
                formData: [],
                searchName: '',
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.$refs.Card.start();
                let pagination = this.$refs.Pagination;
                let param = {
                    current: pagination.current,
                    size: pagination.size,
                    status: 1,
                };
                pageRentEquipmentApi(param).then(result => {
                    let response = result.resultParam.rentEquipmentPage;
                    this.formData = response.records;
                    pagination.total = response.total;
                    this.$refs.Card.stop();
                })
            },
            edit(obj) {
                this.$refs.Card.start();
                this.$refs.Edit.visible = true
                getRentEquipmentApi({id: obj.id}).then(result => {
                    let response = result.resultParam.rentEquipmentPage;
                    let _this = this.$refs.Edit;
                    // _this.repairList.equipId = obj.id; // 添加编辑的id
                    // _this.repairList.equipName = obj.name;
                    _this.repairList.id = obj.id;
                    // objectEvaluate(_this.form, response, this);
                    _this.visible = true;
                    this.$refs.Card.stop();
                }).catch(() => {
                    this.$refs.Card.stop();
                });
                getEquipApi({id: obj.id}).then(result => {
                    let response = result.resultParam.equip;
                    let _this = this.$refs.Edit;
                    // _this.repairList.equipId = obj.id; // 添加编辑的id
                    // _this.repairList.equipName = obj.name;
                    _this.change.id = obj.equipId;
                    // objectEvaluate(_this.form, response, this);
                    _this.visible = true;
                    this.$refs.Card.stop();
                }).catch(() => {
                    this.$refs.Card.stop();
                });
            },
        }
    }
</script>

<style scoped>

</style>