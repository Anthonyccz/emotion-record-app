// 情绪类型定义
export interface Emotion {
  id: string;
  name: string;
  icon: string;
  color: string;
  value: number; // 1-10的数值，用于趋势分析
}

// 情绪记录类型
export interface EmotionRecord {
  id: string;
  date: string; // YYYY-MM-DD格式
  emotion: Emotion;
  intensity: number; // 1-5的强度等级
  diary: string;
  photos?: string[]; // base64编码的图片
  audio?: string; // base64编码的音频
  createdAt: string; // ISO时间戳
  updatedAt: string;
}

// 词云数据类型
export interface WordCloudData {
  text: string;
  value: number;
  color?: string;
}

// 趋势分析数据类型
export interface TrendData {
  date: string;
  emotionValue: number;
  emotionName: string;
}

// 情绪统计数据类型
export interface EmotionStats {
  emotion: string;
  count: number;
  percentage: number;
  color: string;
}

// 应用状态类型
export interface AppState {
  records: EmotionRecord[];
  selectedDate: string;
  currentRecord?: EmotionRecord;
  isLoading: boolean;
  error?: string;
}

// 预定义的情绪类型
export const EMOTIONS: Emotion[] = [
  { id: 'happy', name: '开心', icon: '😊', color: '#FFE4B5', value: 8 },
  { id: 'sad', name: '难过', icon: '😢', color: '#E6E0F8', value: 3 },
  { id: 'anxious', name: '焦虑', icon: '😰', color: '#FFB6C1', value: 2 },
  { id: 'calm', name: '平静', icon: '😌', color: '#E8F4FD', value: 6 },
  { id: 'angry', name: '愤怒', icon: '😠', color: '#FFA07A', value: 1 },
  { id: 'excited', name: '兴奋', icon: '🤩', color: '#98FB98', value: 9 },
  { id: 'tired', name: '疲惫', icon: '😴', color: '#D3D3D3', value: 4 },
  { id: 'grateful', name: '感恩', icon: '🙏', color: '#F0E68C', value: 7 },
  { id: 'confused', name: '困惑', icon: '😕', color: '#DDA0DD', value: 5 },
  { id: 'hopeful', name: '充满希望', icon: '🌟', color: '#87CEEB', value: 8 }
];