<template>
  <el-dialog
    title="添加公告"
    :visible.sync="visible"
    width="30%"
  >
    <el-input v-model="announcement" placeholder="请输入公告内容"></el-input>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'AddNoticeVisible',
  
    data() {
      return {
        visible: false,
        announcement: '',
      }
    },
    methods: {
      submit() {
        this.$emit('submit', this.announcement)
        this.visible = false
        this.announcement = ''
      },
      show() {
        this.visible = true
      },
    },
  }
</script>

<style lang="scss" scoped>
  .dialog-footer {
    text-align: right;
  }
</style>