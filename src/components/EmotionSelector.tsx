import React from 'react';
import { motion } from 'framer-motion';
import { Emotion, EMOTIONS } from '@/types';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface EmotionSelectorProps {
  selectedEmotion?: Emotion;
  onEmotionSelect: (emotion: Emotion) => void;
  className?: string;
}

export const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  selectedEmotion,
  onEmotionSelect,
  className
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">今天的心情如何？</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {EMOTIONS.map((emotion) => {
          const isSelected = selectedEmotion?.id === emotion.id;
          
          return (
            <motion.div
              key={emotion.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              onClick={() => onEmotionSelect(emotion)}
            >
              <Card
                className={cn(
                  'text-center transition-all duration-200 border-2',
                  isSelected
                    ? 'border-purple-300 bg-purple-50/80 shadow-xl'
                    : 'border-transparent hover:border-purple-200 hover:shadow-lg'
                )}
                padding="sm"
              >
                <div className="flex flex-col items-center space-y-2">
                  <motion.div
                    className="text-3xl"
                    animate={isSelected ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {emotion.icon}
                  </motion.div>
                  
                  <span className={cn(
                    'text-sm font-medium transition-colors',
                    isSelected ? 'text-purple-700' : 'text-gray-600'
                  )}>
                    {emotion.name}
                  </span>
                  
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-2 h-2 bg-purple-500 rounded-full"
                    />
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {selectedEmotion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{selectedEmotion.icon}</div>
              <div>
                <p className="text-purple-800 font-medium">
                  你选择了：{selectedEmotion.name}
                </p>
                <p className="text-purple-600 text-sm">
                  很好，让我们记录下这个时刻
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

// 情绪强度选择器
interface IntensitySelectorProps {
  intensity: number;
  onIntensityChange: (intensity: number) => void;
  className?: string;
}

export const IntensitySelector: React.FC<IntensitySelectorProps> = ({
  intensity,
  onIntensityChange,
  className
}) => {
  const intensityLabels = ['很轻微', '轻微', '一般', '强烈', '非常强烈'];
  
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-gray-800">情绪强度</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">轻微</span>
          <span className="text-sm text-gray-500">强烈</span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="1"
            max="5"
            value={intensity}
            onChange={(e) => onIntensityChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-purple-200 to-purple-400 rounded-lg appearance-none cursor-pointer"
            style={{
              background: 'linear-gradient(to right, rgb(196 181 253), rgb(147 51 234))',
            }}
          />
        </div>
        
        <div className="text-center">
          <motion.span
            key={intensity}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
          >
            {intensityLabels[intensity - 1]}
          </motion.span>
        </div>
      </div>
    </div>
  );
};