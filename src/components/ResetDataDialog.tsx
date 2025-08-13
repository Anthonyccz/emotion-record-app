import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface ResetDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetDataDialog({ isOpen, onClose, onConfirm }: ResetDataDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  
  const handleConfirm = () => {
    if (confirmText === '重置数据') {
      setIsConfirming(true);
      onConfirm();
      setTimeout(() => {
        setIsConfirming(false);
        setConfirmText('');
        onClose();
      }, 1000);
    }
  };
  
  const handleClose = () => {
    setConfirmText('');
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="bg-white border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      重置所有数据
                    </h3>
                  </div>
                  
                  <button
                    onClick={handleClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm font-medium mb-2">
                      ⚠️ 警告：此操作不可撤销
                    </p>
                    <p className="text-red-700 text-sm">
                      这将永久删除所有的情绪记录、日记内容和相关数据。删除后无法恢复。
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-gray-700 text-sm">
                      如果您确定要继续，请在下方输入框中输入 <span className="font-mono bg-gray-100 px-2 py-1 rounded text-red-600">重置数据</span> 来确认：
                    </p>
                    
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="请输入：重置数据"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                      disabled={isConfirming}
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="secondary"
                      onClick={handleClose}
                      className="flex-1"
                      disabled={isConfirming}
                    >
                      取消
                    </Button>
                    
                    <Button
                      variant="primary"
                      onClick={handleConfirm}
                      disabled={confirmText !== '重置数据' || isConfirming}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isConfirming ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>重置中...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Trash2 className="w-4 h-4" />
                          <span>确认重置</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}