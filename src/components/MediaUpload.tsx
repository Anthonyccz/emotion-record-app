import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { fileToBase64 } from '@/utils';
import { 
  Camera, 
  Mic, 
  MicOff, 
  Upload, 
  X, 
  Play, 
  Pause, 
  RotateCcw,
  Image as ImageIcon
} from 'lucide-react';

interface MediaUploadProps {
  photos?: string[];
  audio?: string;
  onPhotosChange: (photos: string[]) => void;
  onAudioChange: (audio?: string) => void;
  className?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  photos = [],
  audio,
  onPhotosChange,
  onAudioChange,
  className
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // 处理文件上传
  const handleFileUpload = useCallback(async (files: FileList) => {
    const newPhotos = [...photos];
    
    for (let i = 0; i < Math.min(files.length, 3 - photos.length); i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          const base64 = await fileToBase64(file);
          newPhotos.push(base64);
        } catch (error) {
          console.error('Failed to convert file to base64:', error);
        }
      }
    }
    
    onPhotosChange(newPhotos);
  }, [photos, onPhotosChange]);
  
  // 拖拽上传
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);
  
  // 删除照片
  const removePhoto = useCallback((index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  }, [photos, onPhotosChange]);
  
  // 开始录音
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const base64 = await fileToBase64(new File([audioBlob], 'recording.wav', { type: 'audio/wav' }));
        onAudioChange(base64);
        
        // 停止所有音频轨道
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // 开始计时
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('无法访问麦克风，请检查权限设置');
    }
  }, [onAudioChange]);
  
  // 停止录音
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  }, [isRecording]);
  
  // 播放/暂停音频
  const toggleAudioPlayback = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);
  
  // 删除录音
  const removeAudio = useCallback(() => {
    onAudioChange(undefined);
    setIsPlaying(false);
  }, [onAudioChange]);
  
  // 格式化录音时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={cn('space-y-6', className)}>
      <h3 className="text-lg font-semibold text-gray-800">添加照片或录音</h3>
      
      {/* 照片上传区域 */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700 flex items-center space-x-2">
          <ImageIcon className="w-4 h-4" />
          <span>照片 ({photos.length}/3)</span>
        </h4>
        
        {photos.length < 3 && (
          <Card
            className={cn(
              'border-2 border-dashed transition-all duration-200 cursor-pointer',
              dragOver 
                ? 'border-purple-400 bg-purple-50' 
                : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50/50'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center py-8">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-1">点击上传或拖拽照片到这里</p>
              <p className="text-xs text-gray-400">支持 JPG、PNG 格式，最多3张</p>
            </div>
          </Card>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        />
        
        {/* 照片预览 */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <AnimatePresence>
              {photos.map((photo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <img
                    src={photo}
                    alt={`照片 ${index + 1}`}
                    className="w-full h-24 object-cover rounded-xl shadow-md"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* 录音区域 */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700 flex items-center space-x-2">
          <Mic className="w-4 h-4" />
          <span>语音记录</span>
        </h4>
        
        {!audio ? (
          <Card className="text-center">
            <div className="py-6">
              {!isRecording ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startRecording}
                    className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <Mic className="w-6 h-6" />
                  </motion.button>
                  <p className="text-gray-600">点击开始录音</p>
                  <p className="text-xs text-gray-400 mt-1">记录你的声音想法</p>
                </>
              ) : (
                <>
                  <motion.button
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    onClick={stopRecording}
                    className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"
                  >
                    <MicOff className="w-6 h-6" />
                  </motion.button>
                  <p className="text-red-600 font-medium">录音中... {formatTime(recordingTime)}</p>
                  <p className="text-xs text-gray-400 mt-1">点击停止录音</p>
                </>
              )}
            </div>
          </Card>
        ) : (
          <Card className="bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleAudioPlayback}
                  className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div>
                  <p className="text-green-700 font-medium">语音记录</p>
                  <p className="text-xs text-green-600">点击播放</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    stopRecording();
                    removeAudio();
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  重录
                </Button>
                <button
                  onClick={removeAudio}
                  className="w-8 h-8 text-red-500 hover:text-red-600 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <audio
              ref={audioRef}
              src={audio}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </Card>
        )}
      </div>
    </div>
  );
};