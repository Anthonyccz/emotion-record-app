# 情绪记录疗愈应用 🌸

一个温馨的情绪记录与疗愈应用，帮助用户记录日常情绪，追踪心理健康状态，并提供数据可视化分析。

## ✨ 功能特色

- 📝 **情绪记录**：支持文字、图片、录音多种记录方式
- 📅 **历史查看**：日历和列表视图查看历史记录
- 📊 **趋势分析**：情绪折线图、词云、情绪占比分析
- 🎨 **疗愈设计**：奶白、雾紫、淡蓝的温馨色调
- 📱 **响应式设计**：完美适配手机和桌面端
- 💾 **本地存储**：数据安全存储在本地

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### GitHub Pages 部署

1. Fork 本仓库到你的 GitHub 账户
2. 在仓库设置中启用 GitHub Pages
3. 选择 "GitHub Actions" 作为部署源
4. 推送代码到 main 分支，GitHub Actions 会自动构建和部署

部署完成后，你的应用将在 `https://你的用户名.github.io/record_book/` 可用。

## 🛠 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式方案**：Tailwind CSS
- **图表库**：Chart.js + React-Chartjs-2
- **状态管理**：Zustand
- **UI 组件**：自定义组件 + Lucide React 图标
- **部署平台**：GitHub Pages

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  extends: [
    // other configs...
    // Enable lint rules for React
    reactX.configs['recommended-typescript'],
    // Enable lint rules for React DOM
    reactDom.configs.recommended,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```
