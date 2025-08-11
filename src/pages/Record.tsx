import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEmotionStore } from '@/store/useEmotionStore';
import { Emotion } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmotionSelector, IntensitySelector } from '@/components/EmotionSelector';
import { DiaryEditor } from '@/components/DiaryEditor';
import { MediaUpload } from '@/components/MediaUpload';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Record() {
  const navigate = useNavigate();
  const { addRecord, getRecordByDate, updateRecord } = useEmotionStore();
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const existingRecord = getRecordByDate(today);
  
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | undefined>(existingRecord?.emotion);
  const [intensity, setIntensity] = useState(existingRecord?.intensity || 3);
  const [diary, setDiary] = useState(existingRecord?.diary || '');
  const [photos, setPhotos] = useState<string[]>(existingRecord?.photos || []);
  const [audio, setAudio] = useState<string | undefined>(existingRecord?.audio);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // 检测是否有未保存的更改
  useEffect(() => {
    const hasChanges = 
      selectedEmotion !== existingRecord?.emotion ||
      intensity !== (existingRecord?.intensity || 3) ||
      diary !== (existingRecord?.diary || '') ||
      JSON.stringify(photos) !== JSON.stringify(existingRecord?.photos || []) ||
      audio !== existingRecord?.audio;
    
    setHasUnsavedChanges(hasChanges);
  }, [selectedEmotion, intensity, diary, photos, audio, existingRecord]);
  
  // 自动保存草稿
  const handleAutoSave = (content: string) => {
    localStorage.setItem('emotion_draft', JSON.stringify({
      emotion: selectedEmotion,
      intensity,
      diary: content,
      photos,
      audio,
      date: today
    }));
  };
  
  // 加载草稿
  useEffect(() => {
    if (!existingRecord) {
      const draft = localStorage.getItem('emotion_draft');
      if (draft) {
        try {
          const parsedDraft = JSON.parse(draft);
          if (parsedDraft.date === today) {
            setSelectedEmotion(parsedDraft.emotion);
            setIntensity(parsedDraft.intensity || 3);
            setDiary(parsedDraft.diary || '');
            setPhotos(parsedDraft.photos || []);
            setAudio(parsedDraft.audio);
          }
        } catch (error) {
          console.error('Failed to load draft:', error);
        }
      }
    }
  }, [existingRecord, today]);
  
  const handleSave = async () => {
    if (!selectedEmotion) {
      toast.error('请选择一个情绪');
      return;
    }
    
    if (!diary.trim()) {
      toast.error('请写下一些想法');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const recordData = {
        date: today,
        emotion: selectedEmotion,
        intensity,
        diary: diary.trim(),
        photos: photos.length > 0 ? photos : undefined,
        audio
      };
      
      if (existingRecord) {
        updateRecord(existingRecord.id, recordData);
        toast.success('记录已更新');
      } else {
        addRecord(recordData);
        toast.success('记录已保存');
      }
      
      // 清除草稿
      localStorage.removeItem('emotion_draft');
      setHasUnsavedChanges(false);
      
      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error('Failed to save record:', error);
      toast.error('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('你有未保存的更改，确定要离开吗？');
      if (!confirmed) return;
    }
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {existingRecord ? '编辑' : '记录'}今日心情
            </h1>
            <p className="text-gray-600 text-sm">
              {format(new Date(), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!selectedEmotion || !diary.trim() || isSaving}
            isLoading={isSaving}
            className="flex items-center space-x-2"
          >
            {isSaving ? (
              <span>保存中...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>保存</span>
              </>
            )}
          </Button>
        </motion.div>
        
        {/* 进度指示器 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/60">
            <CardContent className="py-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    selectedEmotion ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={selectedEmotion ? 'text-green-600' : 'text-gray-500'}>
                    选择情绪
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    diary.trim() ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={diary.trim() ? 'text-green-600' : 'text-gray-500'}>
                    记录想法
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    photos.length > 0 || audio ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={photos.length > 0 || audio ? 'text-green-600' : 'text-gray-500'}>
                    添加媒体 (可选)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* 情绪选择 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent>
              <EmotionSelector
                selectedEmotion={selectedEmotion}
                onEmotionSelect={setSelectedEmotion}
              />
            </CardContent>
          </Card>
        </motion.div>
        
        {/* 情绪强度 */}
        {selectedEmotion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <IntensitySelector
                  intensity={intensity}
                  onIntensityChange={setIntensity}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* 日记编辑 */}
        {selectedEmotion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <DiaryEditor
                  value={diary}
                  onChange={setDiary}
                  onAutoSave={handleAutoSave}
                  placeholder={`写下让你感到${selectedEmotion.name}的原因...`}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* 媒体上传 */}
        {selectedEmotion && diary.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardContent>
                <MediaUpload
                  photos={photos}
                  audio={audio}
                  onPhotosChange={setPhotos}
                  onAudioChange={setAudio}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* 保存提示 */}
        {hasUnsavedChanges && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-6 right-6"
          >
            <Card className="bg-yellow-50 border-yellow-200 shadow-lg">
              <CardContent className="py-3 px-4">
                <div className="flex items-center space-x-2 text-yellow-700">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <span className="text-sm">有未保存的更改</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* 底部间距 */}
        <div className="h-20" />
      </div>
    </div>
  );
}