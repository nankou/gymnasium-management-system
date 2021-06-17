<template>
  <card ref="Card">
    <go-back content="代码生成配置" @back="goBack"/>
    <el-row :gutter="15">
      <el-col class="mb-20">
        <card>
          <div slot="header">
            <span>字段配置：{{this.name}}</span>
            <el-button :loading="genLoading" icon="el-icon-s-promotion" class="float-right ml-10" type="success" @click="toGen">保存&生成</el-button>
            <el-button :loading="columnLoading" icon="el-icon-check" class="float-right ml-10" type="primary" @click="editColumns">保存</el-button>
            <el-tooltip class="item" effect="dark" content="数据库中表字段变动时使用该功能" placement="top-start">
              <el-button :loading="syncLoading" icon="el-icon-refresh" class="float-right" type="info" @click="syncColumns">同步</el-button>
            </el-tooltip>
          </div>
          <el-form label-width="90px">
            <el-table :data="formData" :max-height="tableHeight">
              <el-table-column prop="columnName" label="字段名称"/>
              <el-table-column prop="columnType" label="字段类型"/>
              <el-table-column prop="remark" label="字段描述"/>
              <el-table-column label="必填">
                <template slot-scope="scope">
                  <el-checkbox v-model="formData[scope.$index].notNull" disabled/>
                </template>
              </el-table-column>
              <el-table-column label="查询方式">
                <template slot-scope="scope">
                  <el-select v-model="formData[scope.$index].queryType" filterable clearable placeholder="请选择">
                    <el-option label="精确搜索" value="EQ"/>
                    <el-option label="精确不搜索" value="NE"/>
                    <el-option label="模糊搜索" value="LIKE"/>
                    <el-option label="模糊不搜索" value="NOTLIKE"/>
                    <el-option label="大于" value="GT"/>
                    <el-option label="大于等于" value="GE"/>
                    <el-option label="小于" value="LT"/>
                    <el-option label="小于等于" value="LE"/>
                    <el-option label="不为空" value="ISNOTNULL"/>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="查询方式">
                <template slot-scope="scope">
                  <el-select v-model="formData[scope.$index].orderType" filterable clearable placeholder="请选择">
                    <el-option label="顺序" value="ASC"/>
                    <el-option label="逆序" value="DESC"/>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </card>
      </el-col>
      <el-col>
        <card>
          <div slot="header">
            <span>生成配置</span>
            <el-button :loading="configLoading" icon="el-icon-check" class="float-right" type="primary" @click="editGenConfig">保存</el-button>
          </div>
          <el-form ref="Form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="作者名称" prop="author">
              <el-input v-model="form.author" style="width: 40%"/>
              <span style="color: #C0C0C0;margin-left: 10px;">类上面的作者名称</span>
            </el-form-item>
            <el-form-item label="模块名称" prop="moduleName">
              <el-input v-model="form.moduleName" style="width: 40%"/>
              <span style="color: #C0C0C0;margin-left: 10px;">模块的名称，请选择项目中已存在的模块</span>
            </el-form-item>
            <el-form-item label="至于包下" prop="pack">
              <el-input v-model="form.pack" style="width: 40%"/>
              <span style="color: #C0C0C0;margin-left: 10px;">项目包的名称，生成的代码放到哪个包里面</span>
            </el-form-item>
            <el-form-item label="接口名称" prop="apiAlias">
              <el-input v-model="form.apiAlias" style="width: 40%"/>
              <span style="color: #C0C0C0;margin-left: 10px;">接口的名称，用于控制器与接口文档中</span>
            </el-form-item>
            <el-form-item label="去表前缀" prop="prefix">
              <el-input v-model="form.prefix" placeholder="默认不去除表前缀" style="width: 40%"/>
              <span style="color: #C0C0C0;margin-left: 10px;">默认不去除表前缀，可自定义</span>
            </el-form-item>
            <el-form-item label="是否覆盖" prop="cover">
              <el-radio-group v-model="form.cover" style="width: 40%">
                <el-radio-button label="true">是</el-radio-button>
                <el-radio-button label="false">否</el-radio-button>
              </el-radio-group>
              <span style="color: #C0C0C0;margin-left: 10px;">谨防误操作，请慎重选择</span>
            </el-form-item>
          </el-form>
        </card>
      </el-col>
    </el-row>
  </card>
</template>

<script>
  import {editColumns, editGenConfig, generator, getGenConfig, listColumns, syncColumns} from "@/api/tools/generator";
  import {jsonPretty, objectEvaluate, resetForm} from "@/utils/common";

  export default {
    name: "Config",
    data() {
      return {
        tableHeight: 550,
        columnLoading: false,
        configLoading: false,
        syncLoading: false,
        genLoading: false,
        formData: [],
        form: {
          id: null,
          tableName: '',
          author: '',
          pack: '',
          path: '',
          moduleName: '',
          cover: 'false',
          apiPath: '',
          prefix: '',
          apiAlias: null
        },
        rules: {
          author: {required: true, message: '作者不能为空', trigger: 'blur'},
          pack: {required: true, message: '包路径不能为空', trigger: 'blur'},
          path: {required: true, message: '前端路径不能为空', trigger: 'blur'},
          apiAlias: {required: true, message: '接口名称不能为空', trigger: 'blur'},
          cover: {required: true, message: '不能为空', trigger: 'blur'}
        }
      }
    },
    computed: {
      name() {
        return this.$route.params.name
      }
    },
    activated() {
      this.tableHeight = document.documentElement.clientHeight - 385
      this.getData()
    },
    methods: {
      getData() {
        let param = {
          tableName: this.name,
        };
        this.$refs.Card.start();
        Promise.all([listColumns(param), getGenConfig(param)]).then(result => {
          this.$refs.Card.stop();
          this.formData = result[0].resultParam.columnInfoList;
          if (!result[1].resultParam.genConfig) return;
          objectEvaluate(this.form, result[1].resultParam.genConfig);
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      syncColumns() {
        let param = {
          tableName: this.name
        };
        this.syncLoading = true
        syncColumns(param).then(() => {
          this.syncLoading = false
          this.getData()
        }).catch(() => {
          this.syncLoading = false
        })
      },
      editColumns() {
        let param = {
          columnInfoListJson: jsonPretty(this.formData)
        };
        this.columnLoading = true;
        editColumns(param).then(() => {
          this.columnLoading = false
        }).catch(() => {
          this.columnLoading = false
        })
      },
      async toGen() {
        this.genLoading = true
        await editColumns({columnInfoListJson: jsonPretty(this.formData)})
        await generator({tableName: this.name})
        this.genLoading = false
      },
      editGenConfig() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          data.tableName = this.name
          this.configLoading = true
          editGenConfig(data).then(() => {
            this.configLoading = false
          }).catch(() => {
            this.configLoading = false
          })
        });
      },
      goBack() {
        resetForm(this)
        this.$router.push({
          name: 'generator_list'
        })
      }
    }
  }
</script>
