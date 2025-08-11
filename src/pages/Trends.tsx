import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEmotionStore } from '@/store/useEmotionStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading, SkeletonCard } from '@/components/ui/Loading';
import { generateTrendData, generateEmotionStats, extractWordCloudData, calculateStreakDays } from '@/utils';
import { EMOTIONS } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import {
  ArrowLeft,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Heart,
  Smile,
  Target,
  Award
} from 'lucide-react';

type TimeRange = '7d' | '30d' | '90d' | 'all';
type ChartType = 'line' | 'bar' | 'pie' | 'area';

export default function Trends() {
  const navigate = useNavigate();
  const { records, initializeMockData } = useEmotionStore();
  
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      await initializeMockData();
      setIsLoading(false);
    };
    loadData();
  }, [initializeMockData]);
  
  // 生成趋势数据
  const trendData = generateTrendData(records, 30);
  const emotionStats = generateEmotionStats(records);
  const wordCloudData = extractWordCloudData(records);
  
  // 计算统计指标
  const totalRecords = records.length;
  const avgMood = records.length > 0 
    ? (records.reduce((sum, r) => sum + r.intensity, 0) / records.length).toFixed(1)
    : '0';
  const mostFrequentEmotion = emotionStats.length > 0 
    ? emotionStats.reduce((prev, current) => prev.count > current.count ? prev : current)
    : null;
  const mostFrequentEmotionData = mostFrequentEmotion ? EMOTIONS.find(e => e.name === mostFrequentEmotion.emotion) : null;
  const streakDays = calculateStreakDays(records);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-20 h-10 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
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
            <h1 className="text-2xl font-bold text-gray-800">趋势分析</h1>
            <p className="text-gray-600 text-sm">了解你的情绪变化规律</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="7d">最近7天</option>
              <option value="30d">最近30天</option>
              <option value="90d">最近90天</option>
              <option value="all">全部时间</option>
            </select>
          </div>
        </motion.div>
        
        {/* 统计卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            title="总记录数"
            value={totalRecords.toString()}
            subtitle="条记录"
            color="bg-blue-500"
          />
          
          <StatCard
            icon={<Heart className="w-6 h-6" />}
            title="平均心情"
            value={avgMood}
            subtitle="/ 10"
            color="bg-pink-500"
          />
          
          <StatCard
            icon={<Smile className="w-6 h-6" />}
            title="主要情绪"
            value={mostFrequentEmotionData?.icon || '😊'}
            subtitle={mostFrequentEmotionData?.name || '暂无'}
            color="bg-yellow-500"
          />
          
          <StatCard
            icon={<Award className="w-6 h-6" />}
            title="连续记录"
            value={streakDays.toString()}
            subtitle="天"
            color="bg-green-500"
          />
        </motion.div>
        
        {/* 图表控制 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">情绪趋势图表</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={chartType === 'line' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setChartType('line')}
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    折线图
                  </Button>
                  <Button
                    variant={chartType === 'area' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setChartType('area')}
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    面积图
                  </Button>
                  <Button
                    variant={chartType === 'bar' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    柱状图
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* 主要图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 情绪趋势图 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>情绪强度变化</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {chartType === 'line' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#666"
                          fontSize={12}
                        />
                        <YAxis 
                          domain={[0, 10]}
                          stroke="#666"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="emotionValue" 
                          stroke="#8b5cf6" 
                          strokeWidth={3}
                          dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                  
                  {chartType === 'area' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#666"
                          fontSize={12}
                        />
                        <YAxis 
                          domain={[0, 10]}
                          stroke="#666"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="emotionValue" 
                          stroke="#8b5cf6" 
                          fill="url(#colorGradient)"
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                  
                  {chartType === 'bar' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#666"
                          fontSize={12}
                        />
                        <YAxis 
                          domain={[0, 10]}
                          stroke="#666"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar 
                          dataKey="emotionValue" 
                          fill="#8b5cf6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* 情绪分布饼图 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>情绪分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emotionStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="count"
                        label={({ emotion, percentage }) => `${emotion.name} ${percentage}%`}
                        labelLine={false}
                      >
                        {emotionStats.map((entry, index) => {
                          const emotionData = EMOTIONS.find(e => e.name === entry.emotion);
                          return (
                            <Cell key={`cell-${index}`} fill={emotionData?.color || '#E5E5E5'} />
                          );
                        })}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: number, name: string, props: any) => [
                          `${value} 次 (${props.payload.percentage}%)`,
                          props.payload.emotion
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* 情绪统计列表和词云 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 情绪统计列表 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>情绪统计详情</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emotionStats.map((stat, index) => {
                    const emotionData = EMOTIONS.find(e => e.name === stat.emotion);
                    return (
                      <motion.div
                        key={stat.emotion}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{emotionData?.icon || '😊'}</span>
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {emotionData?.name || stat.emotion}
                            </h4>
                            <p className="text-sm text-gray-600">
                              出现频率: {stat.percentage}%
                            </p>
                          </div>
                        </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-800">
                          {stat.count} 次
                        </div>
                        <div className="text-sm text-gray-600">
                          {stat.percentage}%
                        </div>
                      </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* 词云 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>关键词云</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {wordCloudData.slice(0, 9).map((word, index) => (
                      <motion.div
                        key={word.text}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl"
                        style={{
                          fontSize: `${Math.max(12, Math.min(24, word.value * 2))}px`
                        }}
                      >
                        <div className="font-medium text-gray-800">
                          {word.text}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {word.value} 次
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* 洞察和建议 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>个性化洞察</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800">情绪模式分析</h4>
                  <div className="space-y-3">
                    {generateInsights(emotionStats, parseFloat(avgMood), streakDays).map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl"
                      >
                        <div className="text-blue-600 mt-0.5">
                          {insight.icon}
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{insight.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800">改善建议</h4>
                  <div className="space-y-3">
                    {generateSuggestions(emotionStats, parseFloat(avgMood)).map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl"
                      >
                        <div className="text-green-600 mt-0.5">
                          {suggestion.icon}
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{suggestion.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// 统计卡片组件
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle, color }) => {
  return (
    <Card hover>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-gray-800">{value}</span>
              <span className="text-sm text-gray-500">{subtitle}</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl text-white ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};



// 生成洞察
function generateInsights(emotionStats: any[], avgMood: number, streakDays: number) {
  const insights = [];
  
  if (emotionStats.length > 0) {
    const mostFrequent = emotionStats[0];
    insights.push({
      icon: '📊',
      text: `你最常体验的情绪是${mostFrequent.emotion.name}，占总记录的${mostFrequent.percentage}%`
    });
  }
  
  if (avgMood >= 7) {
    insights.push({
      icon: '😊',
      text: `你的平均心情指数为${avgMood}，整体情绪状态良好`
    });
  } else if (avgMood < 5) {
    insights.push({
      icon: '💙',
      text: `你的平均心情指数为${avgMood}，可能需要更多关注和调节`
    });
  }
  
  if (streakDays >= 7) {
    insights.push({
      icon: '🔥',
      text: `你已经连续记录了${streakDays}天，坚持记录的习惯很棒！`
    });
  }
  
  return insights;
}

// 生成建议
function generateSuggestions(emotionStats: any[], avgMood: number) {
  const suggestions = [];
  
  if (avgMood < 6) {
    suggestions.push({
      icon: '🌱',
      text: '尝试每天进行10分钟的冥想或深呼吸练习'
    });
    
    suggestions.push({
      icon: '🚶',
      text: '增加户外活动时间，阳光和运动有助于改善心情'
    });
  }
  
  suggestions.push({
    icon: '📝',
    text: '继续坚持记录情绪，这有助于更好地了解自己'
  });
  
  suggestions.push({
    icon: '🤝',
    text: '与朋友或家人分享你的感受，社交支持很重要'
  });
  
  return suggestions.slice(0, 3);
}