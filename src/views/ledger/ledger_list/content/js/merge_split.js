/**
 * @author 王业鹏
 * @description 合并拆分单元格
 * */
import {editLedgerRowApi} from "@/api/ledger";
import {deepClone} from "@/utils/common";

export default {
  data() {
    return {
      mergeLoading: false,
      splitLoading: false,
      checkboxRefs: []
    }
  },
  methods: {
    /**
     * @author 王业鹏
     * @param {Array} arr
     * @param {Number|String} id
     * @return {string} data
     * @description 修改行参数转换
     * */
    getJsonRows(arr, id) {
      let data = []
      arr.forEach(item => {
        item.content.forEach(obj => {
          if (obj.type === 0) {
            delete obj.originalValue
          }
          if ([4, 5, 6].includes(obj.type)) {
            delete obj.originalScoreCeiling
          }
        })
        data.push({
          id: item.id,
          content: item.content,
          ledgerId: parseInt(id),
          sort: item.sort
        })
      })
      data = JSON.stringify(data)
      return data
    },

    // 点击选中框
    clickCheckbox(rI, cI) {
      let ref = this.$refs[`Checkbox-${rI}-${cI}`][0]
      if (ref.model) { // 添加
        this.checkboxRefs.push({ref, rI, cI})
      } else { // 删除
        this.checkboxRefs.some((item, index) => {
          if (item.rI === rI && item.cI === cI) {
            this.checkboxRefs.splice(index, 1)
            return true
          }
        })
      }
    },

    // 合并单元格
    merge() {
      let arr = this.checkboxRefs
      let len = arr.length;
      // 不支持行合并
      for (let i = 0; i < len - 1; i++) {
        if (arr[i].cI !== arr[i + 1].cI) {
          this.$warnMsg('不支持行合并！')
          return
        }
      }
      // 排序
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
          if (arr[j].rI > arr[j + 1].rI) {
            let temp = arr[j + 1];
            arr[j + 1] = arr[j];
            arr[j] = temp;
          }
        }
      }
      // 只支持相邻的单元格合并
      let cI = arr[0].cI
      for (let i = 0; i < len - 1; i++) {
        let currentRI = arr[i].rI;
        let currentRow = this.formData[currentRI].content[cI].row;
        let nextRI = arr[i + 1].rI;
        if (currentRI + currentRow !== nextRI) {
          this.$warnMsg('非相邻单元格不能合并！')
          return
        }
      }
      // 开始合并
      // 克隆行 -> 修改克隆 -> 集合克隆 -> 转换克隆,获取参数 -> 发送请求 -> success:改变表格 fail:不做改变
      let cloneData = []
      let rI = arr[0].rI
      let totalRow = 0
      arr.forEach((item, index) => {
        if (index !== 0) {
          totalRow += this.formData[item.rI].content[item.cI].row
          let clone = deepClone(this.formData[item.rI])
          clone.content[item.cI].row = 0
          cloneData.push(clone)
        }
      })
      let clone = deepClone(this.formData[rI])
      clone.content[cI].row += totalRow
      cloneData.unshift(clone)
      cloneData = this.getJsonRows(cloneData, this.id)
      let param = {
        jsonLedgerRowList: cloneData,
        isChangeMyScore: false,
        isChangeOtherScore: false,
        isChangeLeaderScore: false
      }
      this.mergeLoading = true
      editLedgerRowApi(param).then(result => {
        this.mergeLoading = false
        if (result.status !== 200) return

        // 改变表格
        arr.forEach((item, index) => {
          if (index === 0) {
            this.formData[rI].content[cI].row += totalRow
          } else {
            this.formData[item.rI].content[item.cI].row = 0
          }
        })

        this.clearSelected()
      }).catch(() => {
        this.mergeLoading = false
        this.getData()
      })
    },

    // 拆分单元格
    split() {
      let ref = this.checkboxRefs[0];
      let rI = ref.rI
      let cI = ref.cI
      let cell = this.formData[rI].content[cI]
      let row = cell.row
      if (row === 1) {
        this.$infoMsg('无需拆分！')
        return
      }
      // 开始拆分
      // 克隆行 -> 修改克隆 -> 集合克隆 -> 转换克隆,获取参数 -> 发送请求 -> success:改变表格 fail:不做改变
      let cloneData = []
      for (let i = rI; i < rI + row; i++) {
        let clone = deepClone(this.formData[i])
        clone.content[cI].row = 1
        cloneData.push(clone)
      }
      cloneData = this.getJsonRows(cloneData, this.id)
      let param = {
        jsonLedgerRowList: cloneData,
        isChangeMyScore: false,
        isChangeOtherScore: false,
        isChangeLeaderScore: false
      }
      this.splitLoading = true
      editLedgerRowApi(param).then(result => {
        this.splitLoading = false
        if (result.status !== 200) return

        // 改变表格
        for (let i = rI; i < rI + row; i++) {
          this.formData[i].content[cI].row = 1
        }

        this.clearSelected()
      }).catch(() => {
        this.splitLoading = false
        this.getData()
      })
    },

    // 清楚选中
    clearSelected() {
      this.checkboxRefs.forEach(item => {
        item.ref.model = false
      })
      this.checkboxRefs = []
    },

    // 表格合并单元格过滤器
    // eslint-disable-next-line no-unused-vars
    objectSpanMethod({row, column, rowIndex, columnIndex}) {
      let i = -1
      let content = this.formData[rowIndex].content
      for (let c = 0; c < content.length; c++) {
        i++
        if (columnIndex === i && Object.prototype.hasOwnProperty.call(content, c)) {
          return {
            rowspan: content[c]['row'],
            colspan: content[c]['col']
          };
        }
      }
    }
  }
}
