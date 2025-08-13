import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEmotionStore } from '@/store/useEmotionStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BreathingAnimation } from '@/components/ui/Loading';
import { ResetDataDialog } from '@/components/ResetDataDialog';
import { getGreeting, getMotivationalQuote, formatDateDisplay } from '@/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { 
  PenTool, 
  Calendar, 
  TrendingUp, 
  Sun, 
  Moon, 
  Cloud,
  Heart,
  Sparkles,
  Settings,
  RotateCcw
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { records, getRecordByDate, initializeMockData, resetAllData } = useEmotionStore();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayRecord = getRecordByDate(today);
  const greeting = getGreeting();
  const quote = getMotivationalQuote();
  
  const handleResetData = () => {
    resetAllData();
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };
  
  // 获取天气图标（模拟）
  const getWeatherIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      return <Sun className="w-6 h-6 text-yellow-500" />;
    } else if (hour >= 18 && hour < 22) {
      return <Cloud className="w-6 h-6 text-orange-400" />;
    } else {
      return <Moon className="w-6 h-6 text-blue-400" />;
    }
  };
  
  const navigationItems = [
    {
      title: '记录心情',
      description: '记录今天的情绪和想法',
      icon: <PenTool className="w-6 h-6" />,
      color: 'from-purple-200 to-pink-200',
      textColor: 'text-purple-700',
      path: '/record'
    },
    {
      title: '历史记录',
      description: '回顾过往的情绪历程',
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-blue-200 to-cyan-200',
      textColor: 'text-blue-700',
      path: '/history'
    },
    {
      title: '趋势分析',
      description: '了解你的情绪变化规律',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-200 to-teal-200',
      textColor: 'text-green-700',
      path: '/trends'
    }
  ];
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4 md:py-8 space-y-4 md:space-y-8">
        {/* 欢迎区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            {getWeatherIcon()}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {greeting}
            </h1>
            <Sparkles className="w-6 h-6 text-pink-500" />
          </div>
          
          <p className="text-lg text-gray-600 mb-2">
            {format(new Date(), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
          </p>
          
          <motion.p
            key={quote}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 italic max-w-md mx-auto"
          >
            {quote}
          </motion.p>
        </motion.div>
        
        {/* 今日状态 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-white/90 to-purple-50/90 border-purple-200">
            <CardContent className="text-center py-8">
              {todayRecord ? (
                <div className="space-y-4">
                  <BreathingAnimation>
                    <div className="text-6xl mb-4">{todayRecord.emotion.icon}</div>
                  </BreathingAnimation>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      今天你感到 {todayRecord.emotion.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      强度: {['很轻微', '轻微', '一般', '强烈', '非常强烈'][todayRecord.intensity - 1]}
                    </p>
                    
                    {todayRecord.diary && (
                      <div className="bg-white/60 rounded-2xl p-4 max-w-md mx-auto">
                        <p className="text-gray-700 text-sm italic">
                          "{todayRecord.diary.length > 100 
                            ? todayRecord.diary.substring(0, 100) + '...' 
                            : todayRecord.diary}"
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/record')}
                    className="mt-4"
                  >
                    编辑今日记录
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    <Heart className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      还没有记录今天的心情
                    </h3>
                    <p className="text-gray-600 mb-6">
                      花一分钟时间，记录下此刻的感受吧
                    </p>
                  </div>
                  
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/record')}
                    className="shadow-xl"
                  >
                    <PenTool className="w-5 h-5 mr-2" />
                    开始记录
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* 快速导航 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card
                className={`bg-gradient-to-br ${item.color} border-white/30 cursor-pointer group hover:shadow-xl transition-shadow duration-200`}
                onClick={() => navigate(item.path)}
              >
                <CardContent className="text-center py-8">
                  <motion.div
                    className={`${item.textColor} mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    {item.icon}
                  </motion.div>
                  
                  <h3 className={`text-xl font-semibold ${item.textColor} mb-2`}>
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* 统计概览 */}
        {records.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="py-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{records.length}</div>
                    <div className="text-sm text-gray-600">总记录数</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {records.filter(r => {
                        const recordDate = new Date(r.date);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return recordDate >= weekAgo;
                      }).length}
                    </div>
                    <div className="text-sm text-gray-600">本周记录</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(records.reduce((sum, r) => sum + r.emotion.value, 0) / records.length) || 0}
                    </div>
                    <div className="text-sm text-gray-600">平均心情</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-pink-600">
                      {Math.max(...records.map(r => new Date(r.date).getDate() - new Date().getDate() + 1), 0)}
                    </div>
                    <div className="text-sm text-gray-600">连续天数</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* 设置区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-200 rounded-full">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">应用设置</h3>
                    <p className="text-sm text-gray-600">管理您的数据和偏好设置</p>
                  </div>
                </div>
                
                <Button
                  variant="secondary"
                  onClick={() => setShowResetDialog(true)}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>重置数据</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* 成功提示 */}
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-green-500 text-white border-green-600">
              <CardContent className="px-6 py-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">数据重置成功！应用已恢复到初始状态</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* 重置确认对话框 */}
        <ResetDataDialog
          isOpen={showResetDialog}
          onClose={() => setShowResetDialog(false)}
          onConfirm={handleResetData}
        />
      </div>
    </div>
  );
}