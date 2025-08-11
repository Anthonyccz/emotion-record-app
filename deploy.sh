#!/bin/bash

# GitHub Pages 部署脚本
# 使用方法：./deploy.sh

echo "🚀 开始部署到 GitHub Pages..."

# 检查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
  echo "⚠️  检测到未提交的更改，请先提交所有更改"
  git status
  exit 1
fi

# 构建项目
echo "📦 构建项目..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ 构建失败"
  exit 1
fi

# 提交并推送到 main 分支
echo "📤 推送到 main 分支..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

if [ $? -ne 0 ]; then
  echo "❌ 推送失败"
  exit 1
fi

echo "✅ 部署完成！"
echo "🌐 GitHub Actions 正在自动构建和部署..."
echo "📱 部署完成后可在以下地址访问："
echo "   https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')/"
echo "⏰ 通常需要 2-5 分钟完成部署"