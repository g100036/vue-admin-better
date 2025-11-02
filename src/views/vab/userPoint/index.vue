<template>
  <div class="userManagement-container">
    <!-- <vab-page-header description="系统用户管理，支持添加、编辑、删除用户信息" :icon="['fas', 'users']" title="用户管理" /> -->

    <vab-query-form>
      <!-- <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleEdit">添加</el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handlePoint">批量删除</el-button>
      </vab-query-form-left-panel> -->
      <vab-query-form-left-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.username" clearable placeholder="请输入用户编号" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" @selection-change="setSelectRows">
      <el-table-column show-overflow-tooltip type="selection" />
      <el-table-column label="用户ID" prop="userName" show-overflow-tooltip />
      <el-table-column label="提取积分状态" prop="isExtract" show-overflow-tooltip >
        <template #default="{ row }">
          <el-tag v-if="row.isExtract" type="success">已提取</el-tag>
          <el-tag v-else type="danger">未提取</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="有效积分数" prop="userpoints" show-overflow-tooltip >
        <template #default="{ row }">
          {{ Math.round(row.userpoints / 90 * 100) / 100 }}
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
      <el-table-column label="操作" show-overflow-tooltip width="200">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">提取积分</el-button>
          <el-button type="text" @click="handlePoint(row)">加积分</el-button>
        </template>
      </el-table-column>
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
    <addPoint ref="addPoint" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { getUserPointTotal, getUserPointsRecordByUserName } from '@/api/userManagement'
  import Edit from './components/UserManagementEdit'
  import VabPageHeader from '@/components/VabPageHeader'
  import AddPoint from './components/addPoint'

  export default {
    name: 'UserManagement',
    components: {
      Edit,
      VabPageHeader,
      AddPoint,
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
          pageSize: 10,
          username: '',
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
      handlePoint(row) {
        if (row.userName) {
          this.$refs['addPoint'].showAddPoint(row)
        } else {
          this.$refs['addPoint'].showAddPoint()
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
        this.fetchDataByUserName()
      },
      async fetchData() {
        this.listLoading = true
        const { data } = await getUserPointTotal()
        this.list = data
        this.total = data.length
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
      async fetchDataByUserName() {
        this.listLoading = true
        const { data } = await getUserPointsRecordByUserName({ userName: this.queryForm.username })
        this.list = data
        this.total = data.length
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>
