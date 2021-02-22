/**
 * @author 王业鹏
 * @description 编辑表格
 * */
import {deepClone} from "@/utils/common";
import {editLedgerRowApi} from "@/api/ledger";

export default {
  data() {
    return {
      isEdit: false,
      editLoading: false
    }
  },
  methods: {
    // 开启编辑
    openEdit() {
      if (this.formData.length === 0) {
        this.$warnMsg('请先添加行！')
        return
      }
      this.formData.forEach(item => {
        item.content.forEach(obj => {
          if (obj.type === 0) {
            obj.originalValue = obj.value
          }
          if ([4, 5, 6].includes(obj.type)) {
            obj.originalScoreCeiling = obj.scoreCeiling
          }
        })
      })
      this.isEdit = true
    },

    // 取消编辑
    cancelEdit() {
      this.$msgBox('确认取消编辑，编辑的信息将不保存？').then(() => {
        this.formData.forEach(item => {
          item.content.forEach(obj => {
            if (obj.type === 0) {
              obj.value = obj.originalValue
              delete obj.originalValue
            }
            if ([4, 5, 6].includes(obj.type)) {
              obj.scoreCeiling = obj.originalScoreCeiling
              delete obj.originalScoreCeiling
            }
          })
        })
        this.isEdit = false
      })
    },

    // 提交编辑
    submitEdit() {
      let editData = [];
      this.formData.forEach(item => {
        let isChange = false
        item.content.forEach(obj => {
          if (obj.type === 0 && obj.value !== obj.originalValue) {
            isChange = true
          }
          if ([4, 5, 6].includes(obj.type)) {
            if (!obj.scoreCeiling) obj.scoreCeiling = 0
            if (obj.scoreCeiling !== obj.originalScoreCeiling) isChange = true
          }
          if (isChange) {
            editData.push(item)
          }
        })
      })
      if (editData.length === 0) {
        this.$warnMsg('未修改数据！')
        return;
      }
      let cloneData = deepClone(editData)
      cloneData = this.getJsonRows(cloneData, this.id)
      let param = {
        jsonLedgerRowList: cloneData,
        isChangeMyScore: false,
        isChangeOtherScore: false,
        isChangeLeaderScore: false
      }
      this.$refs.Card.start()
      this.editLoading = true
      editLedgerRowApi(param).then(result => {
        this.$refs.Card.stop()
        this.editLoading = false
        if (result.status !== 200) return
        this.isEdit = false
      }).catch(() => {
        this.$refs.Card.stop()
        this.editLoading = false
      })
    }
  }
}
