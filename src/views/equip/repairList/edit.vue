<template>
        <el-dialog
                title="器材修复"
                width="600px"
                @close="cancel"
                :close-on-click-modal="false"
                :visible.sync="visible">
            <el-form :model="repairList" ref="Form" label-width="80px">
<!--                <el-form-item label="报修描述" prop="describes">-->
<!--                    <el-input v-model="repairList.describes"></el-input>-->
<!--                </el-form-item>-->
                <div><h1>确定修复</h1></div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <submit-button ref="Submit" @submit="submit"/>
            </div>
        </el-dialog>
</template>

<script>
    import {resetForm} from "@/utils/common";
    import {editRentEquipmentApi, editEquipApi, addRentEquipmentApi} from "../../../api/equip";
    export default {
        name: "edit",
        data() {
            return {
                visible: false,
                change:{
                    id:"",
                    status:0, // 0空闲1报修2赛事3报废4租借
                },
                repairList: {
                    id:"",
                    // equipId: "",
                    status:0, // 0空闲1报修2赛事3报废4租借
                    // describes:"",
                    // equipName:""
                },
            }
        },
        methods: {
            submit() {
                this.$refs['Form'].validate(valid => {
                    if (!valid) return false;
                    let data = {...this.repairList};
                    this.$refs.Submit.start();
                    editRentEquipmentApi(data).then(result => {
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

<style scoped>

</style>