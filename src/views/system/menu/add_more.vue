<template>
  <el-dialog
      title="批量新增菜单"
      width="800px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="120px">
      <el-form-item label="Js接口">
        <el-input type="textarea" v-model="text" placeholder="粘贴文档进行转换"></el-input>
      </el-form-item>
      <el-form-item label="Swagger接口">
        <el-input type="textarea" v-model="txt" placeholder="粘贴文档进行转换"></el-input>
      </el-form-item>
      <row-col>
        <el-form-item label="菜单标题" prop="title">
          <el-input type="textarea" v-model="form.title" :placeholder="'新增\n编辑'"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="permission" slot="r">
          <el-input type="textarea" v-model="form.permission" :placeholder="'add\nedit'"></el-input>
        </el-form-item>
      </row-col>
      <el-form-item label="上级类目">
        <tree-select
            v-model="form.pid"
            :tree="menu"
            :normalizer="normalizer"
            placeholder="默认顶级菜单"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {addMenuApi} from '@/api/system/menu';
  import {resetForm} from "@/utils/common";

  export default {
    name: "AddMore",
    props: {
      menu: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        normalizer(node) {
          return {
            label: node.title
          }
        },
        visible: false,
        text: '',
        txt: '',
        form: {
          title: '',
          permission: '',
          name: '',
          child: '',
          icon: '',
          iframe: false,
          hidden: true,
          cache: false,
          sort: 999,
          pid: null
        },
        rules: {
          title: {required: true, message: '请输入标题', trigger: 'blur'},
          permission: {required: true, message: '请输入权限', trigger: 'blur'}
        }
      }
    },
    watch: {
      text(value) {
        if (!value) return
        let titleArr = []
        let permissionArr = []
        value.replace(/(\/\/)(.+)/g, item => {
          item = item.replace("//", "").trim()
          titleArr.push(item)
          return ''
        })
        value.replace(/[/](.+)(",|',)/g, item => {
          permissionArr.push(item.substring(1, item.length - 2))
          return ''
        })
        if (titleArr.length !== permissionArr.length) {
          this.$warnMsg('接口格式错误，无法转换！')
          return
        }
        this.form.title = titleArr.join('\n')
        this.form.permission = permissionArr.join('\n')
      },
      txt(value) {
        if (!value) return
        // 分割成数组
        let apiList = value.trim().split('\n')
        apiList = apiList.filter(item => !!item)
        // 判断格式
        if (parseInt(apiList.length / 3) !== apiList.length / 3) {
          this.$warnMsg('接口格式错误，无法转换！')
          return
        }
        // 三个一组
        let apiArr = []
        for (let i = 0; i < apiList.length; i += 3) {
          apiArr.push(apiList.slice(i, i + 3));
        }
        // 赋值
        let titleArr = []
        let permissionArr = []
        apiArr.forEach(item => {
          let permission = item[1].substring(item[1].lastIndexOf("/") + 1)
          titleArr.push(item[2])
          permissionArr.push(permission)
        })
        this.form.title = titleArr.join('\n')
        this.form.permission = permissionArr.join('\n')
      },
    },
    methods: {
      getArr(value) {
        let list = [];
        value = value.split('\n');
        value.forEach(item => { // 去空格
          item = item.trim();
          if (item !== '') list.push(item)
        });
        for (let i = 0; i < list.length; i++) { // 去重
          for (let j = i + 1; j < list.length; j++) {
            if (list[i] === list[j]) {
              list.splice(j, 1);
              j--;
            }
          }
        }
        return list
      },
      submit() {
        this.$refs['Form'].validate(async valid => {
          if (!valid) return false;
          let titleArr = this.getArr(this.form.title)
          let permissionArr = this.getArr(this.form.permission)
          if (titleArr.length !== permissionArr.length) {
            this.$warnMsg('菜单标题与权限标识不匹配！')
            return
          }
          this.$refs.Submit.start();
          for (let i = 0; i < titleArr.length; i++) {
            let data = {...this.form};
            if (!data.pid) data.pid = 0;
            data.title = titleArr[i]
            data.permission = permissionArr[i]
            await addMenuApi(data)
          }
          this.$refs.Submit.stop();
          this.$emit('update');
          this.visible = false
        });
      },
      cancel() {
        resetForm(this)
      }
    }
  }
</script>
