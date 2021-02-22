<template>
  <el-date-picker
      v-model="value"
      clearable
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      :default-time="['00:00:00', '23:59:59']"
      @change="emitTime"
  >
  </el-date-picker>
</template>

<script>
  import {format} from "@/utils/format";

  export default {
    name: "DateTimePicker",
    props: {
      start: [String, Number, Date],
      end: [String, Number, Date]
    },
    data() {
      return {
        value: null
      }
    },
    watch: {
      start() {
        this.setTime()
      },
      end() {
        this.setTime()
      }
    },
    methods: {
      format(time) {
        return format(time, 'YYYY-MM-DD HH:mm:ss');
      },
      setTime() {
        if (this.start && this.end) {
          this.value = [];
          this.value[0] = this.format(this.start);
          this.value[1] = this.format(this.end);
          this.$emit('update:start', this.value[0]);
          this.$emit('update:end', this.value[1]);
        } else {
          this.value = null;
        }
      },
      emitTime(value) {
        if (!value) {
          this.$emit('update:start', '');
          this.$emit('update:end', '');
        } else {
          this.$emit('update:start', value[0]);
          this.$emit('update:end', value[1]);
        }
      }
    }
  }
</script>
