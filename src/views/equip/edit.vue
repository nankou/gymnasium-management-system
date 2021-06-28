<template>
    <el-dialog
            title="编辑器材"
            width="600px"
            @close="cancel"
            :close-on-click-modal="false"
            :visible.sync="visible">
        <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
            <!--            <el-form-item label="器材ID" prop="id">-->
            <!--            <el-input v-model="form.id"></el-input>-->
            <!--        </el-form-item>-->
            <el-form-item label="器材名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="租借费用(元/小时)"prop="rent">
                <el-input v-model="form.rent"></el-input>
            </el-form-item>
            <el-form-item label="器材备注" prop="describes">
                <el-input v-model="form.describes"></el-input>
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
    import {editEquipApi} from "../../api/equip";


    export default {
        name: "edit",
        data() {
            return {
                visible: false,
                form: {
                    id:"",
                    name: "",
                    rent: "",
                    describes: "",
                },
                rules: {
                    // id: {required: true, message: '请输入器材ID', trigger: 'blur'},
                    name: {required: true, message: '请输入器材名称', trigger: 'blur'},
                    rent: {required: true, message: '请输入租借费用', trigger: 'blur'},
                }
            }
        },
        methods: {
            submit() {
                this.$refs['Form'].validate(valid => {
                    if (!valid) return false;
                    let data = {...this.form};
                    this.$refs.Submit.start();
                    editEquipApi(data).then(result => {
                        this.$refs.Submit.stop();
                        if (result.status !== 200) return;
                        this.$emit('update');
                        this.visible = false;
                    }).catch(() => {
                        this.$refs.Submit.stop();
                    })
                });
            },
            cancel() {
                resetForm(this)
            }
        }
    }
</script>
