# vibeCoding_ken
# SoftBlog 部落格樣板

柔和色系 + 圓角風格的 React + Vite + Tailwind 部落格網站。

## 本地啟動
```bash
npm install
npm run dev
```

## 打包
```bash
npm run build
```

## GitHub Pages 部署
1. 將 `vite.config.js` 的 `base` 改成 `'/<repo-name>/'`（例如 `'/softblog/'`）。
2. 安裝 gh-pages（已在 `devDependencies` 內）。
3. 執行：
```bash
npm run deploy
```
完成後網址：
`https://<USERNAME>.github.io/<repo-name>/`