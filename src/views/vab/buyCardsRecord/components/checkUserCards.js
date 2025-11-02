
import { getList } from '@/api/table'
/**
 * 查询传入 userid 的未过期购买卡片数量
 * @param {string|number} userFeatureCode - 用户 ID
 * @returns {Promise<number>} 未过期卡片的数量
 */
async function getUnExpiredCardCount(userFeatureCode) {
  try {
    // 调用 getList 查询用户购买记录，注意getList返回的是包含data属性的对象
    const result = await getList({ userFeatureCode });
    
    // 检查返回结果的结构是否正确
    if (!result || !result.data || !Array.isArray(result.data)) {
      return 0;
    }

    // 获取当前时间戳
    const now = Date.now();
    // 筛选出未过期的卡片
    const unExpiredCards = result.data.filter(record => {
      // 假设每条记录中有 expireDate 字段表示过期时间戳
      if (record.expireDate && typeof record.expireDate === 'number') {
        return record.expireDate > now;
      }
      return false;
    });

    // 统计未过期卡片总数
    return unExpiredCards.length;
  } catch (error) {
    console.error('查询未过期卡片数量时出错:', error);
    return 0;
  }
}

export { getUnExpiredCardCount }
