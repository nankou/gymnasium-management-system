<template>
    <el-dialog
            title="器材报修"
            width="600px"
            @close="cancel"
            :close-on-click-modal="false"
            :visible.sync="visible">
        <el-form :model="repairList" ref="Form" label-width="80px">
            <!--            <el-form-item label="器材ID" prop="id">-->
            <!--            <el-input v-model="form.id"></el-input>-->
            <!--        </el-form-item>-->
<!--            <el-form-item label="器材名称" prop="name">-->
<!--                <el-input v-model="repairList.name"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="租借费用(元/小时)"prop="rent">-->
<!--                <el-input v-model="repairList.rent"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="器材备注" prop="status">-->
<!--                <el-input v-model="form.status"></el-input>-->
            <!--            </el-form-item>-->
            <el-form-item label="报修描述" prop="describes">
                <el-input v-model="repairList.describes"></el-input>
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
                    status:1, // 0空闲1报修2赛事3报废4租借
                },
                repairList: {
                    equipId: "",
                    status:1, // 0空闲1报修2赛事3报废4租借
                    describes:"",
                    equipName:""
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
