<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="用户编号" prop="username">
        <el-input v-model.trim="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="数量" prop="userNumber">
        <el-input v-model.trim="form.userNumber" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { addKeys } from '@/api/table'

  export default {
    name: 'TableEdit',
    data() {
      return {
        form: {
          username: '',
          userNumber: '',
        },
        rules: {
          username: [{ required: true, trigger: 'blur', message: '请输入编号' }],
          userNumber: [{ required: true, trigger: 'blur', message: '请输入数量' }],
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
        this.$emit('fetch-data')
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { data } = await addKeys(this.form)
            if(data){
              this.$baseMessage('添加成功', 'success')
              this.$refs['form'].resetFields()
              this.dialogFormVisible = false
              this.form = this.$options.data().form
              setTimeout(() => {
                this.$emit('fetch-data')
              }, 1000)
            } else {
              this.$baseMessage('添加失败', 'error')
            }
          } else {
            return false
          }
          
        })
      },
    },
  }
</script>
