/**
 * @author 王业鹏
 * @description 新增删除行
 * */
import {addLedgerRowApi, delLedgerRowApi} from "@/api/ledger";

export default {
  data() {
    return {
      addLoading: false
    }
  },
  methods: {
    /**
     * @param {Number} type
     * @description 构造单元格
     * */
    constructionCell(type) {
      if (type === 0) // 0文字
        return {value: '', type: type, scoreCeiling: 0, name: '', row: 1, col: 1}
      if (type === 1) // 1文件
        return {value: '[]', type: type, scoreCeiling: 0, name: '', row: 1, col: 1}
      if ([3, 4, 5, 6].includes(type)) // 3完成情况 4自评评分 5互评评分 6专家评分
        return {value: '0', type: type, scoreCeiling: 0, name: '', row: 1, col: 1}
    },

    getSort(frontSort, backSort) {
      /**
       * @param {string|Number} value
       * @description 获得小数位数
       * */
      function getDigit(value) {
        value = (value / 1).toString()
        let arr = value.split('.')
        if (arr[1]) {
          return arr[1].length
        } else {
          return 0
        }
      }

      /**
       * @param {Number} value
       * @param {Number} digit 小数位数
       * @description 四舍五入
       * */
      function round(value, digit) {
        let pow = Math.pow(10, digit - 1)
        return Math.round(value * pow) / pow
      }

      let middle = (frontSort + backSort) / 2
      let digit = getDigit(middle)
      let fix = round(middle, digit)
      if (fix <= frontSort || fix >= backSort) {
        return middle
      } else {
        return fix
      }
    },

    hasMerge(content) {
      return content.some(item => {
        return item.row !== 1;
      })
    },

    // 新增行
    addRow(index) {
      let length = this.formData.length

      let hasMerge;
      if (length === 0) { // 一行都没有
        hasMerge = false
      } else if (length - 1 === index) { // 最后一行
        hasMerge = false
      } else { // 非最后一行
        hasMerge = this.hasMerge(this.formData[index].content)
      }
      if (hasMerge) {
        this.$warnMsg('请拆分单元格，再进行新增！')
        return
      }

      let param = {
        ledgerId: parseInt(this.id),
        sort: 0,
        content: ''
      }
      if (length === 0) { // 一行都没有
        param.sort = 1
      } else if (length - 1 === index) { // 最后一行
        param.sort = Math.ceil(this.formData[length - 1].sort) + 1
      } else { // 非最后一行
        let frontSort = this.formData[index].sort
        let backSort = this.formData[index + 1].sort
        param.sort = this.getSort(frontSort, backSort)
      }
      let content = []
      this.header.forEach(item => {
        content.push(this.constructionCell(item.type))
      })
      param.content = JSON.stringify(content)
      this.$refs.Card.start();
      this.addLoading = true;
      addLedgerRowApi(param).then(result => {
        this.$refs.Card.stop();
        this.addLoading = false;
        if (result.status !== 200) return
        let response = result.resultParam.ledgerRow
        response.content = JSON.parse(response.content)
        this.formData.splice(index + 1, 0, response);
      }).catch(() => {
        this.addLoading = false;
        this.$refs.Card.stop();
        this.getData()
      })
    },

    // 删除行
    removeRow(row) {
      let hasMerge = this.hasMerge(row.content)
      if (hasMerge) {
        this.$warnMsg('请拆分单元格，再进行删除！')
        return
      }

      this.$refs.Card.start();
      delLedgerRowApi({id: row.id}).then(result => {
        this.$refs.Card.stop();
        if (result.status !== 200) return
        this.formData.some((item, index) => {
          if (item.id === row.id) {
            this.formData.splice(index, 1)
            return true
          }
        })
      }).catch(() => {
        this.$refs.Card.stop();
        this.getData()
      })
    }
  }
}
