/**
 * 根据状态标签获取对应的CSS类名
 * @param {string} statusLabel - 状态标签
 * @returns {string} - 对应的CSS类名
 */
export const getStatusClass = (statusLabel) => {
  const labelMap = {
    在线: 'status-online',
    Q我吧: 'status-happy',
    离开: 'status-away',
    忙碌: 'status-busy',
    请勿打扰: 'status-dnd',
    隐身: 'status-invisible',
    我的电量: 'status-battery',
    听歌中: 'status-music',
    做好事: 'status-working',
    出去浪: 'status-travel',
    被掏空: 'status-empty',
    今日步数: 'status-steps',
    今日天气: 'status-weather',
    我crush了: 'status-crush',
  }
  return labelMap[statusLabel] || 'status-online'
}

/**
 * 状态标签列表，用于选择状态
 */
export const statusOptions = [
  { label: '在线', value: '在线' },
  { label: 'Q我吧', value: 'Q我吧' },
  { label: '离开', value: '离开' },
  { label: '忙碌', value: '忙碌' },
  { label: '请勿打扰', value: '请勿打扰' },
  { label: '隐身', value: '隐身' },
  { label: '我的电量', value: '我的电量' },
  { label: '听歌中', value: '听歌中' },
  { label: '做好事', value: '做好事' },
  { label: '出去浪', value: '出去浪' },
  { label: '被掏空', value: '被掏空' },
  { label: '今日步数', value: '今日步数' },
  { label: '今日天气', value: '今日天气' },
  { label: '我crush了', value: '我crush了' },
]