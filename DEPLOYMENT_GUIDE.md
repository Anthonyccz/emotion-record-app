# GitHub Pages 部署指南

## 问题诊断

根据您提供的错误信息 "The process '/usr/bin/git' failed with exit code 128"，这通常是由于 GitHub Pages 的源设置不正确导致的权限问题。

## 解决方案

### 步骤 1: 配置 GitHub Pages 源设置

1. 打开您的 GitHub 仓库页面：`https://github.com/Anthonyccz/emotion-record-app`
2. 点击仓库顶部的 **Settings** 标签
3. 在左侧边栏中，找到 "Code and automation" 部分，点击 **Pages**
4. 在 "Build and deployment" 部分下：
   - 将 **Source** 从 "Deploy from a branch" 更改为 **"GitHub Actions"**
   - 这是关键步骤！必须选择 "GitHub Actions" 作为源

### 步骤 2: 验证工作流权限

确保您的仓库具有正确的 Actions 权限：

1. 在仓库的 **Settings** 页面
2. 点击左侧边栏的 **Actions** > **General**
3. 确保 "Actions permissions" 设置为允许 Actions 运行
4. 在 "Workflow permissions" 部分，确保选择了 "Read and write permissions"

### 步骤 3: 重新触发部署

配置完成后，推送一个新的提交来触发部署：

```bash
git commit --allow-empty -m "Trigger GitHub Pages deployment"
git push origin main
```

## 当前配置状态

✅ **已完成的配置：**
- GitHub Actions 工作流文件 (`.github/workflows/deploy.yml`) 已正确配置
- Vite 配置文件中的 base 路径已设置为 `/emotion-record-app/`
- 工作流权限已正确设置（`contents: read`, `pages: write`, `id-token: write`）

❌ **需要手动配置：**
- GitHub Pages 源设置需要从 "Deploy from a branch" 更改为 "GitHub Actions"

## 预期结果

配置完成后，您的应用将可以通过以下地址访问：
`https://anthonyccz.github.io/emotion-record-app/`

## 故障排除

如果问题仍然存在：

1. 检查 GitHub Actions 标签页中的工作流运行状态
2. 确保仓库是公开的（GitHub Pages 在免费计划中需要公开仓库）
3. 验证所有文件路径和配置都正确

## 技术说明

错误 "exit code 128" 通常表示 Git 操作的权限问题。当 GitHub Pages 源设置为 "Deploy from a branch" 时，GitHub Actions 工作流无法正确部署到 Pages，因为它期望的是分支部署而不是 Actions 部署。通过将源更改为 "GitHub Actions"，我们告诉 GitHub Pages 使用我们的自定义工作流进行部署。