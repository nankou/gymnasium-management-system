<template>
  <textarea :id="`custom-editor-${editorKey}`"></textarea>
</template>

<script>
  import tinymce from "tinymce/tinymce.min";
  import "tinymce/themes/silver/theme.min";
  import 'tinymce/icons/default/icons.min';

  import "tinymce/plugins/image"; // 插入上传图片插件
  import "tinymce/plugins/link"; // 插入上传链接插件
  import "tinymce/plugins/table"; // 插入表格插件
  import "tinymce/plugins/lists"; // 列表插件
  import "tinymce/plugins/nonbreaking"; // 插入空格
  import "tinymce/plugins/contextmenu"; //右键菜单插件
  import "tinymce/plugins/wordcount"; // 字数统计插件
  import "tinymce/plugins/colorpicker"; //选择颜色插件
  import "tinymce/plugins/textcolor"; //文本颜色插件
  import "tinymce/plugins/fullscreen"; //全屏
  import "tinymce/plugins/help"; // 帮助
  import "tinymce/plugins/searchreplace"; // 全屏
  import "tinymce/plugins/insertdatetime"; // 插入时间
  import "tinymce/plugins/toc"; // 内容列表
  import "tinymce/plugins/codesample"; // 插入代码

  import {uploadDocumentsPlusApi, uploadPicturePlusApi} from '@/api/file'
  import {getFile} from "@/utils/common";

  export default {
    name: "CustomEditor",
    props: {
      value: {
        type: String,
        default: ''
      },
      editorKey: { // 同一页面多个富文本要传唯一值
        type: Number,
        default: 0
      },
      typePath: {
        type: String,
        default: 'editor'
      }
    },
    data() {
      return {
        flag: true,
        DefaultInit: {
          language_url: "/assets/tinymce/langs/zh_CN.js", //导入语言文件
          skin_url: "/assets/tinymce/skins/ui/oxide", //主题样式
          language: "zh_CN", //语言设置
          height: 500, //高度
          content_style: "img {max-width:100%;}", // 限制图片大小
          menubar: false, // 最上方menu菜单
          browser_spellcheck: true, // 拼写检查
          branding: false, // 去水印
          statusbar: false, // 隐藏编辑器底部的状态栏
          elementpath: false, // 禁用下角的当前标签路径
          powerpaste_allow_local_images: true,
          powerpaste_word_import: 'prompt',
          powerpaste_html_import: 'prompt',
          relative_urls: false, // 绝对路径
          remove_script_host: true, // 禁止加上http
          nonbreaking_force_tab: true,  // tab加空格
          fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 36px 48px', // 文字大小列表
          toolbar: [
            "bold italic underline | forecolor backcolor lineheight | formatselect | fontsizeselect | alignleft aligncenter alignright alignjustify | outdent indent | codeformat blockformats | removeformat undo redo",
            "bullist numlist toc pastetext | image link table | searchreplace fullscreen help"
          ],
          plugins: "lists image link table nonbreaking wordcount fullscreen help codesample toc searchreplace",
          external_plugins: {'powerpaste': '/assets/tinymce/plugins/powerpaste/plugin.min.js'}
        }
      }
    },
    mounted() {
      this.init();
    },
    watch: {
      value(val, old) {
        if (val && !old) { // 第一次输入执行
          if (this.flag === false) return
          this.set(val)
        }
        if (!val) { // 清空执行
          this.flag = true;
          this.set();
        }
      }
    },
    methods: {
      init() {
        tinymce.init({
          // 挂载的DOM对象
          selector: `#custom-editor-${this.editorKey}`,
          // 默认配置
          ...this.DefaultInit,
          // 图片上传
          images_upload_handler: (blobInfo, success) => {
            let data = {};
            data.file = blobInfo.blob();
            data.typePath = this.typePath;
            uploadPicturePlusApi(data)
              .then(result => {
                let url = this.$baseApi + result.resultParam.uploadFilePath;
                success(url)
              })
          },
          // 文件上传
          file_picker_callback: (callback) => {
            getFile()
              .then(raw => {
                let data = {};
                data.file = raw;
                data.typePath = 'document';
                uploadDocumentsPlusApi(data)
                  .then(result => {
                    let url = this.$baseApi + result.resultParam.uploadFilePath;
                    callback(url, {text: raw.name})
                  })
              }).catch(err => {
              this.$errorMsg(err)
            })
          },
          // 监听富文本内容
          setup: (editor) => {
            editor.on('input change undo redo', () => {
              this.flag = false;
              this.$emit('input', this.get());
              this.$parent.$emit('el.form.change')
            })
          }
        });
      },
      // 获得富文本内容
      get() {
        return tinymce.activeEditor.getContent()
      },
      // 设置富文本内容
      set(value = "") {
        tinymce.editors[`custom-editor-${this.editorKey}`].setContent(value)
      }
    },
    // 退出销毁
    beforeDestroy() {
      tinymce.remove();
      let element = document.getElementById(`custom-editor-${this.editorKey}`);
      element.style.visibility = 'hidden'
    }
  };
</script>
