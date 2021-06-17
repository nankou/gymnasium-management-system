<template>
  <card ref="Card">
    <div slot="header">
      <el-button type="success" @click="objectEvaluate">赋值</el-button>
      <el-button type="danger" @click="reset">重置</el-button>
      <submit-button ref="Submit" @submit="submit"/>
      <el-button class="float-right" @click="stop">停止</el-button>
      <el-button class="float-right" @click="start">旋转</el-button>
      <Clipboard :text='token' class="float-right">
        <el-button type="warning">点击复制Token</el-button>
      </Clipboard>
    </div>
    <el-form :model="form" :rules="rules" ref="Form" label-width="150px">
      <row-col>
        <el-form-item label="上传图片" prop="image">
          <image-uploader v-model="form.image"/>
        </el-form-item>
        <el-form-item slot="r" label="上传剪辑图片" prop="imagePlus">
          <image-uploader-plus v-model="form.imagePlus"/>
        </el-form-item>
      </row-col>
      <el-form-item label="上传多张图片" prop="moreImage">
        <image-uploader-batch v-model="form.moreImage"/>
      </el-form-item>
      <el-form-item label="上传多张剪辑图片" prop="moreImagePlus">
        <image-uploader-batch-plus v-model="form.moreImagePlus"/>
      </el-form-item>
      <el-form-item label="上传视频" prop="video">
        <video-uploader v-model="form.video"/>
      </el-form-item>
      <row-col>
        <el-form-item label="日期" prop="start">
          <date-time-picker :start.sync="form.start" :end.sync="form.end"/>
        </el-form-item>
        <el-form-item slot="r" label="地区" prop="province">
          <region-select :province.sync="form.province" :city.sync="form.city" :area.sync="form.area"/>
        </el-form-item>
      </row-col>
      <el-row>
        <el-col :span="8">
          <el-form-item label="选择部门" prop="dept">
            <tree-select :tree="tree" v-model="form.dept"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="输入职业" prop="job">
            <input-search v-model="form.job"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="选择职业" prop="jobId">
            <search-select v-model="form.jobId"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="内容" prop="content">
        <custom-editor v-model="form.content"/>
      </el-form-item>
    </el-form>
  </card>
</template>

<script>
  import InputSearch from '@/components/InputSearch';
  import SearchSelect from '@/components/SearchSelect';
  import {objectEvaluate, resetForm} from "@/utils/common";

  export default {
    name: "Example",
    components: {InputSearch, SearchSelect},
    data() {
      return {
        tree: [{
          id: 1,
          name: '总部',
          enabled: true,
          children: [{
            id: 2,
            name: '分部',
            enabled: true
          }]
        }],
        obj: {
          image: '/ledger/file/20210105/image/6b7472a2-5c6b-47d9-a67e-9cbf7620ade3.jpg',
          imagePlus: '/ledger/file/20210104/image/799572b0-c49c-494e-867c-a2244caa8c34.jpg',
          moreImage: '/ledger/file/20210105/image/6b7472a2-5c6b-47d9-a67e-9cbf7620ade3.jpg,/ledger/file/20210105/image/35dd9022-e37f-4fe6-ad0a-ef756c168c9a.jpg',
          moreImagePlus: '/ledger/file/20210105/image/6b7472a2-5c6b-47d9-a67e-9cbf7620ade3.jpg,/ledger/file/20210105/image/35dd9022-e37f-4fe6-ad0a-ef756c168c9a.jpg',
          video: '/ledger/file/20210105/video/1ec6e060-e473-45ff-a999-8072e8cedd77.mp4',
          start: '2020-07-16 12:01:02',
          end: '2020-08-17 21:02:16',
          province: '广东省',
          city: '广州市',
          area: '花都区',
          dept: 2,
          job: '董事长',
          content: '<p style="text-align: center;"><strong>富文本</strong></p>',
        },
        form: {
          image: '',
          imagePlus: '',
          moreImage: '',
          moreImagePlus: '',
          video: '',
          start: '',
          end: '',
          province: '',
          city: '',
          area: '',
          dept: null,
          job: '',
          jobId: '',
          content: '',
        },
        rules: {
          image: {required: true, message: '请上传图片', trigger: 'change'},
          imagePlus: {required: true, message: '请上传图片', trigger: 'change'},
          moreImage: {required: true, message: '请至少上传一张图片', trigger: 'change'},
          moreImagePlus: {required: true, message: '请至少上传一张图片', trigger: 'change'},
          video: {required: true, message: '请上传视频', trigger: 'change'},
          start: {required: true, message: '请选择日期', trigger: 'change'},
          province: {required: true, message: '请选择地区', trigger: 'change'},
          dept: {required: true, message: '请选择部门', trigger: 'change'},
          job: {required: true, message: '请输入职业', trigger: 'change'},
          jobId: {required: true, message: '请选择职业', trigger: 'change'},
          content: {required: true, message: '请输入内容', trigger: 'change'},
        }
      }
    },
    computed: {
      token() {
        return this.$storeGet.token
      }
    },
    methods: {
      start() {
        this.$refs.Card.start();
      },
      stop() {
        this.$refs.Card.stop();
      },
      objectEvaluate() {
        objectEvaluate(this.form, this.obj) // 对象赋值
      },
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          this.$refs.Submit.start();
          setTimeout(() => {
            this.$refs.Submit.stop();
            console.log(this.form);
            this.reset();
            this.$successMsg('提交成功')
          }, 2000)
        });
      },
      reset() {
        resetForm(this) // 重置表单
      }
    }
  };
</script>
