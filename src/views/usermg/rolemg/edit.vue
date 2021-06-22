<template>
    <el-dialog
            title="编辑角色"
            width="600px"
            @close="cancel"
            :close-on-click-modal="false"
            :visible.sync="visible">
        <el-form :model="form" :rules="rules" ref="Form" label-width="120px">
            <row-col>
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item slot="r" label="角色权限" prop="permission">
                    <el-input v-model.trim="form.permission"></el-input>
                </el-form-item>
            </row-col>
            <el-form-item label="描述">
                <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <submit-button ref="Submit" @submit="submit"/>
        </div>
    </el-dialog>
</template>

<script>
    import {editRoleApi} from '@/api/system/role';
    import {resetForm} from "@/utils/common";

    export default {
        name: "Edit",
        props: {
            dept: {
                type: Array,
                default: () => []
            },
            level: {
                type: Number
            }
        },
        data() {
            return {
                visible: false,
                form: {
                    id: null,
                    name: '',
                    nameZh: '',
                    permission: '',
                    dataScope: '本级',
                    level: 1,
                    deptIds: [],
                    remark: ''
                },
                rules: {
                    name: {required: true, message: '请输入名称', trigger: 'blur'},
                    level: {required: true, message: '请输入角色级别', trigger: 'blur'}
                }
            }
        },
        methods: {
            submit() {
                this.$refs['Form'].validate(valid => {
                    if (!valid) return false;
                    let data = {...this.form};
                    if (data.dataScope !== '自定义') data.deptIds = [];
                    this.$refs.Submit.start();
                    editRoleApi(data).then(result => {
                        this.$refs.Submit.stop();
                        if (result.status !== 200) return
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
