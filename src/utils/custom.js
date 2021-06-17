import Vue from "vue";

/**
 * @description 自定义组件引用
 * */
import Card from "@/components/Card"
import RowCol from "@/components/RowCol"
import TreeSelect from "@/components/TreeSelect"
import ExpandTable from "@/components/ExpandTable"
import SelectionTable from "@/components/SelectionTable"
import DeleteButton from "@/components/DeleteButton"
import SubmitButton from "@/components/SubmitButton"
import Pagination from "@/components/Pagination"
import Clipboard from "@/components/Clipboard"
import GoBack from "@/components/GoBack"

Vue.component("Card", Card); // 卡片
Vue.component("RowCol", RowCol); // 行列
Vue.component("TreeSelect", TreeSelect); // 树形选择器
Vue.component("ExpandTable", ExpandTable); // 展开表格
Vue.component("SelectionTable", SelectionTable); // 选择表格
Vue.component("DeleteButton", DeleteButton); // 删除按钮
Vue.component("SubmitButton", SubmitButton); // 提交按钮
Vue.component("Pagination", Pagination); // 分页
Vue.component("Clipboard", Clipboard); // 复制
Vue.component("GoBack", GoBack); // 返回

Vue.component("RegionSelect", () => import("@/components/RegionSelect")); // 地区选择
Vue.component("DateTimePicker", () => import("@/components/DateTimePicker")); // 日期区间
Vue.component("ImageUploader", () => import("@/components/ImageUploader")); // 图片上传
Vue.component("ImageUploaderPlus", () => import("@/components/ImageUploaderPlus")); // 图片剪辑上传
Vue.component("ImageUploaderBatch", () => import("@/components/ImageUploaderBatch")); // 多图片上传
Vue.component("ImageUploaderBatchPlus", () => import("@/components/ImageUploaderBatchPlus")); // 多图片剪辑上传
// Vue.component("CustomEditor", () => import("@/components/CustomEditor")); // 富文本
// Vue.component("VideoUploader", () => import("@/components/VideoUploader")); // 视频上传
