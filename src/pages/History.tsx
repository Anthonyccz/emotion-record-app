import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEmotionStore } from '@/store/useEmotionStore';
import { EmotionRecord } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading, SkeletonCard } from '@/components/ui/Loading';
import { formatDateDisplay, truncateText, getIntensityLabel } from '@/utils';
import { format, parseISO, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  List, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

type ViewMode = 'calendar' | 'list';

export default function History() {
  const navigate = useNavigate();
  const { records, initializeMockData, deleteRecord } = useEmotionStore();
  
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRecord, setSelectedRecord] = useState<EmotionRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      await initializeMockData();
      setIsLoading(false);
    };
    loadData();
  }, [initializeMockData]);
  
  // 过滤记录
  const filteredRecords = records.filter(record => {
    if (!searchQuery) return true;
    return (
      record.emotion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // 获取当前月份的记录
  const currentMonthRecords = filteredRecords.filter(record => 
    isSameMonth(parseISO(record.date), currentDate)
  );
  
  // 生成日历天数
  const calendarDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });
  
  // 获取指定日期的记录
  const getRecordForDate = (date: Date) => {
    return currentMonthRecords.find(record => 
      isSameDay(parseISO(record.date), date)
    );
  };
  
  // 处理日期点击
  const handleDateClick = (date: Date) => {
    const record = getRecordForDate(date);
    if (record) {
      setSelectedRecord(record);
    }
  };
  
  // 处理记录删除
  const handleDeleteRecord = (recordId: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      deleteRecord(recordId);
      setSelectedRecord(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto py-4 md:py-6 space-y-4 md:space-y-6 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="w-20 h-10 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
            <div>
              <SkeletonCard />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4 md:py-6 space-y-4 md:space-y-6 max-w-6xl">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">历史记录</h1>
            <p className="text-gray-600 text-sm">回顾你的情绪历程</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'calendar' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <CalendarIcon className="w-4 h-4 mr-1" />
              日历
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-1" />
              列表
            </Button>
          </div>
        </motion.div>
        
        {/* 搜索栏 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索情绪或日记内容..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  共 {filteredRecords.length} 条记录
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主内容区域 */}
          <div className="lg:col-span-2">
            {viewMode === 'calendar' ? (
              <CalendarView
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                calendarDays={calendarDays}
                getRecordForDate={getRecordForDate}
                onDateClick={handleDateClick}
              />
            ) : (
              <ListView
                records={filteredRecords}
                onRecordClick={setSelectedRecord}
                onDeleteRecord={handleDeleteRecord}
              />
            )}
          </div>
          
          {/* 侧边栏 - 记录详情 */}
          <div>
            <RecordDetail
              record={selectedRecord}
              onClose={() => setSelectedRecord(null)}
              onEdit={(record) => {
                navigate('/record');
              }}
              onDelete={handleDeleteRecord}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 日历视图组件
interface CalendarViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  calendarDays: Date[];
  getRecordForDate: (date: Date) => EmotionRecord | undefined;
  onDateClick: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  onDateChange,
  calendarDays,
  getRecordForDate,
  onDateClick
}) => {
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    onDateChange(prevMonth);
  };
  
  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    onDateChange(nextMonth);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <CardTitle className="text-xl">
              {format(currentDate, 'yyyy年MM月', { locale: zhCN })}
            </CardTitle>
            
            <Button variant="ghost" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* 日历天数 */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map(day => {
              const record = getRecordForDate(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <motion.button
                  key={day.toISOString()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDateClick(day)}
                  className={`
                    relative aspect-square p-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      isToday
                        ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-300'
                        : record
                        ? 'bg-white hover:bg-gray-50 text-gray-700 shadow-md hover:shadow-lg'
                        : 'text-gray-400 hover:bg-gray-50'
                    }
                  `}
                >
                  <span>{format(day, 'd')}</span>
                  
                  {record && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: record.emotion.color }}
                        title={record.emotion.name}
                      />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// 列表视图组件
interface ListViewProps {
  records: EmotionRecord[];
  onRecordClick: (record: EmotionRecord) => void;
  onDeleteRecord: (recordId: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ records, onRecordClick, onDeleteRecord }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <AnimatePresence>
        {records.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="cursor-pointer group hover:shadow-xl transition-shadow duration-200">
              <CardContent className="py-4">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{record.emotion.icon}</div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-800">
                          {record.emotion.name}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          {getIntensityLabel(record.intensity)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        {formatDateDisplay(record.date)}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {truncateText(record.diary, 120)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {record.photos && record.photos.length > 0 && (
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            📷 {record.photos.length}张照片
                          </span>
                        )}
                        {record.audio && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                            🎵 语音记录
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRecordClick(record);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRecord(record.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {records.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CalendarIcon className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500">暂无记录</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

// 记录详情组件
interface RecordDetailProps {
  record: EmotionRecord | null;
  onClose: () => void;
  onEdit: (record: EmotionRecord) => void;
  onDelete: (recordId: string) => void;
}

const RecordDetail: React.FC<RecordDetailProps> = ({ record, onClose, onEdit, onDelete }) => {
  if (!record) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Eye className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">选择一条记录查看详情</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">记录详情</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 情绪信息 */}
          <div className="text-center">
            <div className="text-5xl mb-3">{record.emotion.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              {record.emotion.name}
            </h3>
            <p className="text-gray-600 text-sm">
              强度: {getIntensityLabel(record.intensity)}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              {format(parseISO(record.date), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
            </p>
          </div>
          
          {/* 日记内容 */}
          <div>
            <h4 className="font-medium text-gray-800 mb-2">日记内容</h4>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {record.diary}
              </p>
            </div>
          </div>
          
          {/* 照片 */}
          {record.photos && record.photos.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-800 mb-2">照片</h4>
              <div className="grid grid-cols-2 gap-2">
                {record.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`照片 ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* 语音 */}
          {record.audio && (
            <div>
              <h4 className="font-medium text-gray-800 mb-2">语音记录</h4>
              <audio controls className="w-full">
                <source src={record.audio} type="audio/wav" />
                您的浏览器不支持音频播放。
              </audio>
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(record)}
              className="flex-1"
            >
              <Edit className="w-3 h-3 mr-1" />
              编辑
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(record.id)}
              className="flex-1"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              删除
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};