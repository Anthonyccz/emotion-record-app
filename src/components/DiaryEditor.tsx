import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Edit3, Save } from 'lucide-react';

interface DiaryEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  autoSave?: boolean;
  onAutoSave?: (value: string) => void;
  className?: string;
}

export const DiaryEditor: React.FC<DiaryEditorProps> = ({
  value,
  onChange,
  placeholder = '写下今天的心情和想法...',
  maxLength = 1000,
  autoSave = true,
  onAutoSave,
  className
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 自动调整文本框高度
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(120, textarea.scrollHeight)}px`;
    }
  };
  
  // 自动保存功能
  useEffect(() => {
    if (autoSave && onAutoSave && value.trim()) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        onAutoSave(value);
        setLastSaved(new Date());
      }, 2000); // 2秒后自动保存
    }
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [value, autoSave, onAutoSave]);
  
  useEffect(() => {
    adjustHeight();
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };
  
  const wordCount = value.length;
  const isNearLimit = wordCount > maxLength * 0.8;
  
  // 情绪引导问题
  const guidingQuestions = [
    '今天发生了什么让你有这种感受？',
    '这种情绪给你带来了什么启发？',
    '你想对现在的自己说些什么？',
    '有什么是你想要记住的吗？',
    '明天你希望自己怎样？'
  ];
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % guidingQuestions.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <Edit3 className="w-5 h-5 text-purple-600" />
          <span>记录你的想法</span>
        </h3>
        
        {lastSaved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-1 text-xs text-green-600"
          >
            <Save className="w-3 h-3" />
            <span>已保存 {lastSaved.toLocaleTimeString()}</span>
          </motion.div>
        )}
      </div>
      
      {/* 引导问题 */}
      {!isFocused && !value && (
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-4"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <p className="text-blue-700 text-sm italic">
              💭 {guidingQuestions[currentQuestion]}
            </p>
          </Card>
        </motion.div>
      )}
      
      <Card className={cn(
        'transition-all duration-200',
        isFocused ? 'ring-2 ring-purple-300 shadow-xl' : 'hover:shadow-lg'
      )}>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full min-h-[120px] p-4 bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-400 leading-relaxed"
            style={{ fontFamily: 'inherit' }}
          />
          
          {/* 字数统计 */}
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-400">
              {value ? '继续写下你的想法...' : '开始记录今天的心情'}
            </div>
            
            <div className={cn(
              'text-xs font-medium',
              isNearLimit ? 'text-orange-500' : 'text-gray-400'
            )}>
              {wordCount}/{maxLength}
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="mt-2">
            <div className="w-full bg-gray-100 rounded-full h-1">
              <motion.div
                className={cn(
                  'h-1 rounded-full transition-colors duration-200',
                  isNearLimit ? 'bg-orange-400' : 'bg-purple-400'
                )}
                initial={{ width: 0 }}
                animate={{ width: `${(wordCount / maxLength) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </Card>
      
      {/* 写作提示 */}
      {isFocused && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          <Card className="bg-yellow-50 border-yellow-200">
            <div className="text-xs text-yellow-700">
              <p className="font-medium mb-1">💡 写作小贴士：</p>
              <ul className="space-y-1 text-xs">
                <li>• 诚实地表达你的感受，不需要完美</li>
                <li>• 描述具体的事件和细节</li>
                <li>• 记录你的想法和反思</li>
                <li>• 这是你的私人空间，放心表达</li>
              </ul>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};