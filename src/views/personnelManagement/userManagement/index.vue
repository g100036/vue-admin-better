<template>
  <div class="userManagement-container">
    <!-- <vab-page-header description="系统用户管理，支持添加、编辑、删除用户信息" :icon="['fas', 'users']" title="用户管理" /> -->

    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-form :inline="true" :model="queryUserForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model.trim="queryUserForm.userfeaturecode" clearable placeholder="请输入用户ID" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryUserData">查询用户</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.username" clearable placeholder="请输入用户编号" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询下级用户</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" @selection-change="setSelectRows">
      <el-table-column show-overflow-tooltip type="selection" />
      <el-table-column label="用户ID" prop="userfeaturecode" show-overflow-tooltip />
      <el-table-column label="在线状态" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tooltip class="item" effect="dark" placement="top-start">
            <el-tag :type="row.isEnable | statusFilter">
              {{ row.isEnable ? '在线' : '离线' }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="卡密数量" prop="userNumber" show-overflow-tooltip />
      <el-table-column label="备注数字" prop="userbakckupnumber" show-overflow-tooltip />
      <!-- <el-table-column label="特征码" prop="userfeaturecode" show-overflow-tooltip /> -->
      <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip />
      <el-table-column label="用户编号" prop="userName" show-overflow-tooltip />
      <!-- <el-table-column label="权限" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag v-for="(item, index) in row.permissions" :key="index">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column> -->

      <!-- <el-table-column label="修改时间" prop="datatime" show-overflow-tooltip /> -->
      <!-- <el-table-column label="操作" show-overflow-tooltip width="200">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { doDelete, getList, getInviteUserList } from '@/api/userManagement'
  import Edit from './components/UserManagementEdit'
  import VabPageHeader from '@/components/VabPageHeader'

  export default {
    name: 'UserManagement',
    components: {
      Edit,
      VabPageHeader,
    },
    filters:{
      statusFilter(status) {
        const statusMap = {
          true: 'success',
          false: 'danger',
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        list: null,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          userfeaturecode: '',
        },
        queryUserForm: {
          userfeaturecode: '',
        },
        timeOutID: null,
      }
    },
    created() {
      this.fetchData()
    },

    beforeDestroy() {
      clearTimeout(this.timeOutID)
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        if (row.id) {
          this.$refs['edit'].showEdit(row)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids })
              this.$baseMessage(msg, 'success')
              this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.getInviteUserList()
      },
      // 查询用户
      queryUserData() {
        this.queryForm.pageNo = 1
        this.fetchUserData()
      },
      async fetchData() {
        this.listLoading = true
        const { data } = await getList()
        this.list = data
        this.total = data.length
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
      // 查询所有下级用户
      async getInviteUserList() {
        this.listLoading = true
        const { data } = await getInviteUserList({ username: this.queryForm.username })
        this.list = data
        this.total = data.length
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
      // 查询用户
      async fetchUserData() {
        this.listLoading = true
        const { data } = await getList({ userFeatureCode: this.queryUserForm.userfeaturecode })
        this.list = data
        this.total = data.length
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>
