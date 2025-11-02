<template>
  <div class="userManagement-container">
    <!-- <vab-page-header description="系统用户管理，支持添加、编辑、删除用户信息" :icon="['fas', 'users']" title="用户管理" /> -->

    <vab-query-form>
      <!-- <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleEdit">添加</el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">批量删除</el-button>
      </vab-query-form-left-panel> -->
      <vab-query-form-left-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.userfeaturecode" clearable placeholder="请输入用户ID" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" @selection-change="setSelectRows">
      <el-table-column show-overflow-tooltip type="selection" />
      <el-table-column label="用户编号" prop="userName" show-overflow-tooltip />
      <!-- <el-table-column label="提取积分状态" prop="isExtract" show-overflow-tooltip >
        <template #default="{ row }">
          <el-tag v-if="row.isExtract" type="success">已提取</el-tag>
          <el-tag v-else type="danger">未提取</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="积分变动" prop="userpoints" show-overflow-tooltip >
        <template #default="{ row }">
          <el-tag v-if="row.isExtract" type="danger">-{{ Math.round(row.userpoints / 90 * 100) / 100 }}</el-tag>
          <el-tag v-else type="success">+{{ Math.round(row.userpoints / 90 * 100) / 100 }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上次积分入账时间" prop="userPointsDate" show-overflow-tooltip />

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
          <el-button type="text" @click="handleEdit(row)">提取积分</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNumber"
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
  import { doDelete, getUserPointsRecord } from '@/api/userManagement'
  import Edit from './components/UserManagementEdit'
  import VabPageHeader from '@/components/VabPageHeader'

  export default {
    name: 'UserManagement',
    components: {
      Edit,
      VabPageHeader,
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
          pageNumber: 1,
          pageSize: 20,
          username: '',
          userFeatureCode: ''
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
        if (row.userName) {
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
        this.queryForm.pageNumber = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNumber = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const { data } = await getUserPointsRecord(this.queryForm)
        this.list = data.pointInfo
        this.total = data.length
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>
