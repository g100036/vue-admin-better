<template>
  <div class="table-container">
    <!-- <vab-page-header description="功能强大的数据表格组件，支持排序、分页、搜索等功能" :icon="['fas', 'table']" title="表格管理" /> -->
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-switch v-model="buyCardSwitch" @change="handleBuyCardSwitch" active-value="true" inactive-value="false" active-text="开启购买" inactive-text="关闭购买" />
        <!-- <el-button icon="el-icon-delete" type="danger" @click="handleDelete">删除</el-button> -->
      </vab-query-form-left-panel>
      <!-- <vab-query-form-right-panel>
        <el-form ref="form" :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="queryForm.userfeaturecode" placeholder="输入用户ID" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" native-type="submit" type="primary" @click="handleQuery">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel> -->
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      :height="height"
      @selection-change="setSelectRows"
      @sort-change="tableSortChange"
    >
      <el-table-column show-overflow-tooltip type="selection" width="55" />
      <el-table-column label="序号" show-overflow-tooltip width="95">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="用户ID" prop="userfeaturecode" show-overflow-tooltip />
      <el-table-column label="购买时间" prop="buyTime" />
      <el-table-column label="购买数量" prop="cardCount" show-overflow-tooltip />
      <el-table-column label="是否已生成卡号" prop="isCreated" show-overflow-tooltip >
        <template #default="{ row }">
          <el-tag v-if="row.isCreated" type="success">已生成</el-tag>
          <el-tag v-else type="danger">未生成</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="ip" prop="ip" show-overflow-tooltip /> -->
      <el-table-column label="用户编号" prop="userName" show-overflow-tooltip />
      <el-table-column label="收款地址" prop="paymentAddress" show-overflow-tooltip />
      <el-table-column label="付款备注" prop="remark" show-overflow-tooltip />
      <!-- <el-table-column label="头像" show-overflow-tooltip>
        <template #default="{ row }">
          <el-image v-if="imgShow" :preview-src-list="imageList" :src="row.img" />
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="点击量" prop="pageViews" show-overflow-tooltip sortable /> -->
      <!-- <el-table-column label="状态" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tooltip class="item" effect="dark" placement="top-start">
            <el-tag :type="row.isonline | statusFilter">
              {{ row.isonline ? '在线' : '离线' }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="到期时间" prop="expireDate" show-overflow-tooltip width="200" /> -->
      <el-table-column label="操作" show-overflow-tooltip width="180px">
        <template #default="{ row }">
          <el-button v-if="row.cards.length < 1 && !row.isCreated" type="primary" @click="handleAddUserCards(row)">生成卡号</el-button>
          <el-button v-else type="primary" @click="showCardsInfo(row)">查看卡号</el-button>
          <!-- <el-button type="text" @click="handleDelete(row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <table-edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { getBuyCardsRecord, addKeys, setCardsList, setSystemSetting } from '@/api/table'
  import { getList } from '@/api/userManagement'

  import TableEdit from './components/TableEdit'
  import VabPageHeader from '@/components/VabPageHeader'
  import { getUnExpiredCardCount } from './components/checkUserCards'

  export default {
    name: 'BuyCardsRecord',
    components: {
      TableEdit,
      VabPageHeader,
    },
    filters: {
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
        imgShow: true,
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          userfeaturecode: '',
        },
        timeOutID: null,
        buyCardSwitch: true
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {
      this.fetchData()
    },
    beforeDestroy() {
      clearTimeout(this.timeOutID)
    },
    mounted() {
      this.handleBuyCardSwitch()
    },
    methods: {
      tableSortChange() {
        const imageList = []
        this.$refs.tableSort.tableData.forEach((item, index) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      async handleAddUserCards(row) {
        // 设置奖励卡
        let rewardCardCount = 0
        // 根据row.userFeatureCode获取用户信息中的userInviteUserName
        let temp = await getList({ userFeatureCode: row.userFeatureCode })
        const userInviteUserName = temp.data[0].userInviteUserName
        if (userInviteUserName) {
          const unExpiredCount = await getUnExpiredCardCount(row.userFeatureCode)
          const inviteUserUnExpiredCount = await getUnExpiredCardCount(userInviteUserName)
          if (unExpiredCount > 49 && inviteUserUnExpiredCount > 49) {
              rewardCardCount = Math.floor(row.cardCount * 0.1)
          }
        }
        this.$baseConfirm(`预计生成${row.cardCount}张卡号，请核对备注！！\n\n
奖励推荐人${userInviteUserName}卡${rewardCardCount}张!`, null, async () => {
            const { data } = await addKeys({ userName: row.userName, userNumber: row.cardCount })
            this.$baseMessage('生成成功', 'success')
            const cardsList = data
            console.log(cardsList);
            const res = await setCardsList({
              id: row.id,
              cards: cardsList,
            })
            if (res.code === 200) {
              this.$baseMessage('保存成功', 'success')
            } else {
              this.$baseMessage('保存失败', 'danger')
            }
            await this.fetchData()
          })
      },
      // 购买卡开关
      async handleBuyCardSwitch(newVal) {
        if(!newVal) {
          let res = await setSystemSetting({})
          this.buyCardSwitch = res.data.userBuyCardSwitch
          return
        }
        const { data } = await setSystemSetting({ userBuyCardSwitch: newVal })
        this.buyCardSwitch = data.userBuyCardSwitch
        this.$baseMessage('保存成功', 'success')
      },
      // 查看卡号
      showCardsInfo(row) {
        const list = [
          `<p>订单编号:${row.id}</p>`,
          `<p>🔔 购买成功</p>`
        ]
        
        row.cards.forEach((item, index) => {
          let t = `<div>序号:${index+1}  账号: ${item.userkeyid} 密码: ${item.userkey}</div>`
          list.push(t)
        })
        this.$alert(list.join(''), {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '关闭',
          showClose: false
        })
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const { data } = await getBuyCardsRecord(this.queryForm)
        this.list = data.list
        this.total = data.total
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 500)
      }
    },
  }
</script>
