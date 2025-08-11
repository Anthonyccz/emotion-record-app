import { create } from 'zustand';
import { EmotionRecord, Emotion, EMOTIONS } from '@/types';
import { format, subDays } from 'date-fns';

interface EmotionStore {
  records: EmotionRecord[];
  selectedDate: string;
  currentRecord?: EmotionRecord;
  isLoading: boolean;
  error?: string;
  
  // Actions
  addRecord: (record: Omit<EmotionRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecord: (id: string, updates: Partial<EmotionRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecordByDate: (date: string) => EmotionRecord | undefined;
  getRecordsInRange: (startDate: string, endDate: string) => EmotionRecord[];
  setSelectedDate: (date: string) => void;
  setCurrentRecord: (record?: EmotionRecord) => void;
  initializeMockData: () => void;
}

// 生成模拟数据
const generateMockData = (): EmotionRecord[] => {
  const mockRecords: EmotionRecord[] = [];
  const today = new Date();
  
  // 生成过去30天的随机数据
  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // 随机选择是否有记录（80%概率有记录）
    if (Math.random() > 0.2) {
      const emotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
      const intensity = Math.floor(Math.random() * 5) + 1;
      
      const diaries = [
        '今天心情不错，工作进展顺利，和朋友聊天很开心。',
        '感觉有些焦虑，明天有重要的会议，希望一切顺利。',
        '今天很平静，在公园散步，看到了美丽的夕阳。',
        '有点累，但是完成了很多任务，感觉很有成就感。',
        '和家人一起吃饭，感觉很温暖，很感恩拥有这样的时光。',
        '今天遇到了一些挫折，但是学到了很多东西。',
        '心情很好，听了喜欢的音乐，做了美味的晚餐。',
        '感觉有些迷茫，不知道未来的方向，需要好好思考。',
        '今天很兴奋，收到了好消息，想要分享给所有人。',
        '平静的一天，读了一本好书，内心很充实。'
      ];
      
      const record: EmotionRecord = {
        id: `record_${dateStr}_${Math.random().toString(36).substr(2, 9)}`,
        date: dateStr,
        emotion,
        intensity,
        diary: diaries[Math.floor(Math.random() * diaries.length)],
        createdAt: date.toISOString(),
        updatedAt: date.toISOString()
      };
      
      mockRecords.push(record);
    }
  }
  
  return mockRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const useEmotionStore = create<EmotionStore>((set, get) => ({
  records: [],
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  currentRecord: undefined,
  isLoading: false,
  error: undefined,
  
  addRecord: (recordData) => {
    const now = new Date().toISOString();
    const newRecord: EmotionRecord = {
      ...recordData,
      id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now
    };
    
    set((state) => ({
      records: [newRecord, ...state.records.filter(r => r.date !== newRecord.date)]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }));
    
    // 保存到localStorage
    const { records } = get();
    localStorage.setItem('emotion_records', JSON.stringify(records));
  },
  
  updateRecord: (id, updates) => {
    set((state) => ({
      records: state.records.map(record => 
        record.id === id 
          ? { ...record, ...updates, updatedAt: new Date().toISOString() }
          : record
      )
    }));
    
    // 保存到localStorage
    const { records } = get();
    localStorage.setItem('emotion_records', JSON.stringify(records));
  },
  
  deleteRecord: (id) => {
    set((state) => ({
      records: state.records.filter(record => record.id !== id)
    }));
    
    // 保存到localStorage
    const { records } = get();
    localStorage.setItem('emotion_records', JSON.stringify(records));
  },
  
  getRecordByDate: (date) => {
    const { records } = get();
    return records.find(record => record.date === date);
  },
  
  getRecordsInRange: (startDate, endDate) => {
    const { records } = get();
    return records.filter(record => {
      const recordDate = new Date(record.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return recordDate >= start && recordDate <= end;
    });
  },
  
  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },
  
  setCurrentRecord: (record) => {
    set({ currentRecord: record });
  },
  
  initializeMockData: () => {
    // 检查localStorage中是否已有数据
    const savedRecords = localStorage.getItem('emotion_records');
    if (savedRecords) {
      try {
        const parsedRecords = JSON.parse(savedRecords);
        set({ records: parsedRecords });
        return;
      } catch (error) {
        console.error('Failed to parse saved records:', error);
      }
    }
    
    // 如果没有保存的数据，生成模拟数据
    const mockRecords = generateMockData();
    set({ records: mockRecords });
    localStorage.setItem('emotion_records', JSON.stringify(mockRecords));
  }
}));