<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" >
      <el-form-item label="订单编号" prop="id">
        <el-input v-model.trim="form.id"  autocomplete="off" disabled />
      </el-form-item>
      <el-form-item label="用户编号" prop="userFeatureCode">
        <el-input v-model.trim="form.userFeatureCode"  autocomplete="off" disabled />
      </el-form-item>
      <el-form-item label="提取数量" prop="points">
        <el-input v-model.trim="form.points" autocomplete="off" type="text" disabled />
      </el-form-item>
      <!-- <el-form-item label="提取数量" prop="points">
        <el-input v-model.trim="form.points" autocomplete="off" type="number" />
      </el-form-item> -->
      <!-- <el-form-item label="权限" prop="permissions">
        <el-checkbox-group v-model="form.permissions">
          <el-checkbox label="admin" />
          <el-checkbox label="editor" />
        </el-checkbox-group>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { updateUserPointsGetRecordStatus } from '@/api/userManagement'

  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        form: {
          userFeatureCode: '',
          points: '',
          id: '',
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '审核提币'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg, data } = await updateUserPointsGetRecordStatus({
              userFeatureCode: this.form.userFeatureCode,
              points: this.form.points,
              id: this.form.id,
              status: 'success'
            })
            this.$baseMessage(data?'提取成功':'提取失败', 'success')
            this.$emit('fetch-data')
            this.close()
          } else {
            return false
          }
        })
      },
    },
  }
</script>
