<template>
    <el-dialog
            title="器材租借"
            width="600px"
            @close="cancel"
            :close-on-click-modal="false"
            :visible.sync="visible">
        <el-form :model="repairList" ref="Form" label-width="80px">
<!--                        <el-form-item label="器材ID" prop="id">-->
<!--                        <el-input v-model="repairList.id"></el-input>-->
<!--                    </el-form-item>-->
                        <el-form-item label="器材名称" prop="equipName">
                            <el-input v-model="repairList.equipName"></el-input>
                        </el-form-item>
            <el-form-item label="使用时间" prop="time">
                <date-time-picker :start.sync="repairList.startTime" :end.sync="repairList.endTime"/>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <submit-button ref="Submit" @submit="submit"/>
        </div>
    </el-dialog>
</template>

<script>
    import {resetForm} from "@/utils/common";
    import {addRentEquipmentApi,editEquipApi} from "../../../api/equip";


    export default {
        name: "edit",

        data() {
            return {
                visible: false,
                change:{
                    id:"",
                    status:4,// 0空闲1报修2赛事3报废4租借
                },
                repairList: {
                    equipId: "",
                    status:4, // 0空闲1报修2赛事3报废4租借
                    equipName:"",
                    startTime:"",
                    endTime:"",
                },
                // rules: {
                //     // id: {required: true, message: '请输入器材ID', trigger: 'blur'},
                // }
            }
        },
        methods: {
            submit() {
                this.$refs['Form'].validate(valid => {
                    if (!valid) return false;
                    let data = {...this.repairList};
                    this.$refs.Submit.start();
                    addRentEquipmentApi(data).then(result => {
                        this.$refs.Submit.stop();
                        if (result.status !== 200) return;
                        // this.$emit('update');
                        this.visible = false;
                    }).catch(() => {
                        this.$refs.Submit.stop();
                    });
                    let date={...this.change};
                    editEquipApi(date).then(result => {
                        this.$refs.Submit.stop();
                        if (result.status !== 200) return;
                        this.$emit('update');
                        this.visible = false;
                    }).catch(() => {
                        this.$refs.Submit.stop();
                    });
                });
            },
            cancel() {
                resetForm(this)
            }
        }
    }
</script>
