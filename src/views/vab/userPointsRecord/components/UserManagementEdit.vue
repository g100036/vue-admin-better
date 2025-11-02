<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model.trim="form.userName"  autocomplete="off" disabled />
      </el-form-item>
      <el-form-item label="可用积分" prop="userpoints">
        <el-input v-model.trim="form.userpoints" autocomplete="off" type="text" disabled />
      </el-form-item>
      <el-form-item label="提取数量" prop="points">
        <el-input v-model.trim="form.points" autocomplete="off" type="number" />
      </el-form-item>
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
  import { userPointExtract } from '@/api/userManagement'

  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        form: {
          userName: '',
          userpoints: '',
          points: '',
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
          this.title = '编辑'
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
            const { msg, data } = await userPointExtract({
              userName: this.form.userName,
              points: this.form.points,
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
