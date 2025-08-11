import { EmotionRecord, WordCloudData, TrendData, EmotionStats, EMOTIONS } from '@/types';
import { format, parseISO, isToday, isYesterday, differenceInDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 格式化日期显示
export const formatDateDisplay = (dateString: string): string => {
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return '今天';
  }
  
  if (isYesterday(date)) {
    return '昨天';
  }
  
  const daysDiff = differenceInDays(new Date(), date);
  if (daysDiff <= 7) {
    return `${daysDiff}天前`;
  }
  
  return format(date, 'MM月dd日', { locale: zhCN });
};

// 格式化完整日期
export const formatFullDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'yyyy年MM月dd日 EEEE', { locale: zhCN });
};

// 获取问候语
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 6) {
    return '夜深了，记录一下今天的心情吧';
  } else if (hour < 12) {
    return '早上好，新的一天开始了';
  } else if (hour < 18) {
    return '下午好，今天过得怎么样';
  } else {
    return '晚上好，今天有什么想记录的吗';
  }
};

// 获取激励语句
export const getMotivationalQuote = (): string => {
  const quotes = [
    '每一天都是新的开始，拥抱你的情绪',
    '记录情绪是了解自己的第一步',
    '无论今天如何，你都值得被关爱',
    '情绪没有对错，只有感受和成长',
    '今天的你比昨天更了解自己一点',
    '每个情绪都在告诉你一些重要的事情',
    '温柔地对待自己，就像对待好朋友一样',
    '记录是为了更好地理解，而不是评判',
    '你的感受很重要，值得被记录和珍视',
    '每一次记录都是对自己的一次关怀'
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
};

// 从文本中提取词云数据
export const extractWordCloudData = (records: EmotionRecord[]): WordCloudData[] => {
  const wordCount: { [key: string]: number } = {};
  
  // 简单的中文分词（基于常见词汇）
  const commonWords = [
    '今天', '昨天', '明天', '工作', '学习', '家人', '朋友', '心情', '感觉',
    '开心', '快乐', '难过', '焦虑', '平静', '愤怒', '兴奋', '疲惫', '感恩',
    '美好', '温暖', '阳光', '希望', '梦想', '努力', '坚持', '成长', '收获',
    '挫折', '困难', '挑战', '机会', '变化', '进步', '反思', '感动', '惊喜',
    '放松', '休息', '运动', '音乐', '电影', '书籍', '旅行', '美食', '自然'
  ];
  
  records.forEach(record => {
    const text = record.diary;
    commonWords.forEach(word => {
      const count = (text.match(new RegExp(word, 'g')) || []).length;
      if (count > 0) {
        wordCount[word] = (wordCount[word] || 0) + count;
      }
    });
  });
  
  // 转换为词云数据格式
  const wordCloudData = Object.entries(wordCount)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 50); // 只取前50个高频词
  
  return wordCloudData;
};

// 生成趋势分析数据
export const generateTrendData = (records: EmotionRecord[], days: number = 30): TrendData[] => {
  const trendData: TrendData[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = format(date, 'yyyy-MM-dd');
    
    const record = records.find(r => r.date === dateString);
    
    if (record) {
      trendData.push({
        date: dateString,
        emotionValue: record.emotion.value,
        emotionName: record.emotion.name
      });
    } else {
      // 如果没有记录，使用中性值
      trendData.push({
        date: dateString,
        emotionValue: 5,
        emotionName: '无记录'
      });
    }
  }
  
  return trendData;
};

// 生成情绪统计数据
export const generateEmotionStats = (records: EmotionRecord[]): EmotionStats[] => {
  const emotionCount: { [key: string]: number } = {};
  const total = records.length;
  
  if (total === 0) {
    return [];
  }
  
  records.forEach(record => {
    const emotionName = record.emotion.name;
    emotionCount[emotionName] = (emotionCount[emotionName] || 0) + 1;
  });
  
  const stats = Object.entries(emotionCount).map(([emotion, count]) => {
    const emotionData = EMOTIONS.find(e => e.name === emotion);
    return {
      emotion,
      count,
      percentage: Math.round((count / total) * 100),
      color: emotionData?.color || '#E5E5E5'
    };
  });
  
  return stats.sort((a, b) => b.count - a.count);
};

// 截取文本摘要
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + '...';
};

// 获取情绪强度描述
export const getIntensityLabel = (intensity: number): string => {
  const labels = ['很轻微', '轻微', '一般', '强烈', '非常强烈'];
  return labels[intensity - 1] || '一般';
};

// 生成随机ID
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 文件转换为base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// 验证日期格式
export const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// 计算连续记录天数
export const calculateStreakDays = (records: EmotionRecord[]): number => {
  if (records.length === 0) {
    return 0;
  }
  
  // 按日期排序
  const sortedRecords = records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < sortedRecords.length; i++) {
    const recordDate = new Date(sortedRecords[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    // 检查是否是连续的日期
    if (format(recordDate, 'yyyy-MM-dd') === format(expectedDate, 'yyyy-MM-dd')) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};