<template>
  <div class="userManagement-container">
    <!-- <vab-page-header description="系统用户管理，支持添加、编辑、删除用户信息" :icon="['fas', 'users']" title="用户管理" /> -->

    <vab-query-form>
      <!-- <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleEdit">添加</el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">批量删除</el-button>
      </vab-query-form-left-panel> -->
      <!-- <vab-query-form-left-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.username" clearable placeholder="请输入用户编号" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel> -->
    </vab-query-form>

    <el-table v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" @selection-change="setSelectRows">
      <el-table-column show-overflow-tooltip type="selection" />
      <el-table-column label="订单编号" prop="id" show-overflow-tooltip />
      <el-table-column label="用户ID" prop="userFeatureCode" show-overflow-tooltip />
      <el-table-column label="用户编号" prop="userName" show-overflow-tooltip />
      <el-table-column label="审核状态" prop="status" >
        <template #default="{ row }">
          <el-tag v-if="row.status === 'pending'" type="danger">待处理</el-tag>
          <el-tag v-else type="success">已处理</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提取积分数量" prop="points"  />
      <el-table-column label="提币地址" prop="paymentAddress" min-width="200" />
      <el-table-column label="申请时间" prop="requestTime" show-overflow-tooltip />

      <!-- <el-table-column label="权限" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag v-for="(item, index) in row.permissions" :key="index">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column> -->

      <!-- <el-table-column label="修改时间" prop="datatime" show-overflow-tooltip /> -->
      <el-table-column label="操作" show-overflow-tooltip width="200">
        <template #default="{ row }">
          <el-button v-if="row.status === 'pending'" type="primary" @click="handleEdit(row)">通过</el-button> 
          <!-- <el-button type="text" @click="handleDelete(row)">删除</el-button> -->
        </template>
      </el-table-column>
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
  import { getUserPointsGetRecord } from '@/api/userManagement'
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
          pageNo: 1,
          pageSize: 10,
          userFeatureCode: '',
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
        this.$refs['edit'].showEdit(row)
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
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const { data } = await getUserPointsGetRecord({})
        this.list = data.list
        this.total = data.length
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>
