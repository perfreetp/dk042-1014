const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 3000;
const PROJECT_ROOT = __dirname;
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ts': 'text/plain; charset=utf-8',
  '.tsx': 'text/plain; charset=utf-8',
  '.scss': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

const pages = [
  { name: '首页', path: 'pages/index/index.tsx', type: 'TabBar', icon: '🏠' },
  { name: '订单页', path: 'pages/orders/index.tsx', type: 'TabBar', icon: '📦' },
  { name: '发布页', path: 'pages/publish/index.tsx', type: 'TabBar', icon: '➕' },
  { name: '我的页', path: 'pages/mine/index.tsx', type: 'TabBar', icon: '👤' },
  { name: '技能详情页', path: 'pages/skill-detail/index.tsx', type: '二级页面', icon: '📋' },
  { name: '预约页', path: 'pages/booking/index.tsx', type: '二级页面', icon: '📅' },
  { name: '订单详情页', path: 'pages/order-detail/index.tsx', type: '二级页面', icon: '📝' },
  { name: '技能管理页', path: 'pages/skill-manage/index.tsx', type: '二级页面', icon: '⚙️' },
  { name: '收入记录页', path: 'pages/income/index.tsx', type: '二级页面', icon: '💰' },
  { name: '我的收藏页', path: 'pages/favorites/index.tsx', type: '二级页面', icon: '⭐' },
  { name: '评价回复页', path: 'pages/review-reply/index.tsx', type: '二级页面', icon: '💬' },
  { name: '实名认证页', path: 'pages/verification/index.tsx', type: '二级页面', icon: '✅' },
  { name: '邻里优惠页', path: 'pages/discount/index.tsx', type: '二级页面', icon: '🎫' },
  { name: '纠纷反馈页', path: 'pages/feedback/index.tsx', type: '二级页面', icon: '📢' },
  { name: '平台公告页', path: 'pages/notice/index.tsx', type: '二级页面', icon: '📣' }
];

const components = [
  { name: 'SkillCard 技能卡片', path: 'components/SkillCard/index.tsx', icon: '🃏' },
  { name: 'OrderCard 订单卡片', path: 'components/OrderCard/index.tsx', icon: '🎴' },
  { name: 'StarRating 星级评分', path: 'components/StarRating/index.tsx', icon: '⭐' },
  { name: 'EmptyState 空状态', path: 'components/EmptyState/index.tsx', icon: '📭' }
];

const dataFiles = [
  { name: '技能数据', path: 'data/skills.ts', icon: '📚' },
  { name: '分类数据', path: 'data/categories.ts', icon: '🏷️' },
  { name: '订单数据', path: 'data/orders.ts', icon: '📦' },
  { name: '用户数据', path: 'data/user.ts', icon: '👥' }
];

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function generateMainHTML() {
  const pageListHTML = pages.map(page => `
    <div class="file-card" onclick="viewFile('${page.path}')">
      <div class="file-icon">${page.icon}</div>
      <div class="file-info">
        <div class="file-name">${page.name}</div>
        <div class="file-type">${page.type}</div>
        <div class="file-path">${page.path}</div>
      </div>
      <div class="file-arrow">→</div>
    </div>
  `).join('');

  const componentListHTML = components.map(comp => `
    <div class="file-card" onclick="viewFile('${comp.path}')">
      <div class="file-icon">${comp.icon}</div>
      <div class="file-info">
        <div class="file-name">${comp.name}</div>
        <div class="file-path">${comp.path}</div>
      </div>
      <div class="file-arrow">→</div>
    </div>
  `).join('');

  const dataListHTML = dataFiles.map(data => `
    <div class="file-card" onclick="viewFile('${data.path}')">
      <div class="file-icon">${data.icon}</div>
      <div class="file-info">
        <div class="file-name">${data.name}</div>
        <div class="file-path">${data.path}</div>
      </div>
      <div class="file-arrow">→</div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>邻里技能共享小程序 - 项目预览</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      background: linear-gradient(135deg, #FFF7F2 0%, #FFE8D6 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      background: linear-gradient(135deg, #FF7A45 0%, #FFA47A 100%);
      color: white;
      padding: 40px;
      border-radius: 20px;
      margin-bottom: 30px;
      box-shadow: 0 10px 40px rgba(255, 122, 69, 0.3);
    }
    .header h1 {
      font-size: 36px;
      margin-bottom: 10px;
    }
    .header p {
      font-size: 18px;
      opacity: 0.9;
      margin-bottom: 20px;
    }
    .stats {
      display: flex;
      gap: 30px;
      margin-top: 20px;
    }
    .stat-item {
      background: rgba(255, 255, 255, 0.2);
      padding: 15px 25px;
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
    }
    .stat-label {
      font-size: 14px;
      opacity: 0.9;
    }
    .section {
      background: white;
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    .section-title {
      font-size: 24px;
      color: #FF7A45;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .file-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }
    .file-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #FFF7F2;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    .file-card:hover {
      background: #FFE8D6;
      border-color: #FF7A45;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 122, 69, 0.2);
    }
    .file-icon {
      width: 56px;
      height: 56px;
      background: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
    .file-info {
      flex: 1;
      min-width: 0;
    }
    .file-name {
      font-size: 16px;
      font-weight: 600;
      color: #1D2129;
      margin-bottom: 4px;
    }
    .file-type {
      display: inline-block;
      padding: 2px 8px;
      background: rgba(255, 122, 69, 0.1);
      color: #FF7A45;
      font-size: 12px;
      border-radius: 4px;
      margin-bottom: 4px;
    }
    .file-path {
      font-size: 12px;
      color: #86909C;
      font-family: 'Courier New', monospace;
    }
    .file-arrow {
      color: #FF7A45;
      font-size: 20px;
    }
    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 20px;
    }
    .tech-tag {
      padding: 8px 16px;
      background: #FFF7F2;
      color: #FF7A45;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
    }
    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #FF7A45;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      margin-bottom: 20px;
      transition: all 0.3s ease;
    }
    .back-btn:hover {
      background: #FF5722;
      transform: translateX(-4px);
    }
    pre {
      background: #1D2129;
      color: #F2F3F5;
      padding: 24px;
      border-radius: 12px;
      overflow-x: auto;
      font-size: 13px;
      line-height: 1.6;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    }
    code {
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    }
    .file-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .file-header h2 {
      color: #1D2129;
      font-size: 20px;
    }
    .file-meta {
      color: #86909C;
      font-size: 14px;
    }
    .feature-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }
    .feature-item {
      padding: 20px;
      background: linear-gradient(135deg, #FFF7F2 0%, #FFE8D6 100%);
      border-radius: 12px;
      border-left: 4px solid #FF7A45;
    }
    .feature-item h4 {
      color: #FF7A45;
      margin-bottom: 8px;
      font-size: 16px;
    }
    .feature-item p {
      color: #4E5969;
      font-size: 14px;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div id="main-content">
      <div class="header">
        <h1>🏘️ 邻里技能共享小程序</h1>
        <p>让小区住户发布可提供的轻量服务，共享技能，共建美好社区</p>
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">15</div>
            <div class="stat-label">页面总数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">4</div>
            <div class="stat-label">TabBar 页面</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">11</div>
            <div class="stat-label">二级页面</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">4</div>
            <div class="stat-label">可复用组件</div>
          </div>
        </div>
        <div class="tech-stack">
          <span class="tech-tag">Taro 4.x</span>
          <span class="tech-tag">React 18</span>
          <span class="tech-tag">TypeScript</span>
          <span class="tech-tag">SCSS Modules</span>
          <span class="tech-tag">多端支持</span>
          <span class="tech-tag">750rpx 设计基准</span>
          <span class="tech-tag">8px 网格系统</span>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">✨ 核心功能</h2>
        <div class="feature-list">
          <div class="feature-item">
            <h4>技能广场</h4>
            <p>按维修、家教、宠物照看、摄影、电脑设置、手工制作等分类浏览</p>
          </div>
          <div class="feature-item">
            <h4>技能主页</h4>
            <p>展示价格范围、可约时间、服务区域、作品照片和评价</p>
          </div>
          <div class="feature-item">
            <h4>预约系统</h4>
            <p>可选时段、填写需求、上传参考图片并发起沟通</p>
          </div>
          <div class="feature-item">
            <h4>订单管理</h4>
            <p>显示待确认、进行中、待评价和已完成四种状态</p>
          </div>
          <div class="feature-item">
            <h4>个人中心</h4>
            <p>管理技能资料、接单开关、收入记录、收藏夹、评价回复</p>
          </div>
          <div class="feature-item">
            <h4>服务保障</h4>
            <p>实名认证标识、邻里优惠、纠纷反馈和平台公告</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">📱 TabBar 页面</h2>
        <div class="file-grid">
          ${pageListHTML}
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">🧩 可复用组件</h2>
        <div class="file-grid">
          ${componentListHTML}
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">📊 Mock 数据</h2>
        <div class="file-grid">
          ${dataListHTML}
        </div>
      </div>
    </div>

    <div id="file-view" style="display: none;">
      <button class="back-btn" onclick="goBack()">← 返回列表</button>
      <div class="section">
        <div class="file-header">
          <h2 id="file-title"></h2>
          <span class="file-meta" id="file-meta"></span>
        </div>
        <pre><code id="file-content"></code></pre>
      </div>
    </div>
  </div>

  <script>
    async function viewFile(filePath) {
      try {
        const response = await fetch('/view?path=' + encodeURIComponent(filePath));
        const data = await response.json();
        if (data.success) {
          document.getElementById('main-content').style.display = 'none';
          document.getElementById('file-view').style.display = 'block';
          document.getElementById('file-title').textContent = data.name;
          document.getElementById('file-meta').textContent = data.path + ' · ' + data.size;
          document.getElementById('file-content').textContent = data.content;
          window.scrollTo(0, 0);
        } else {
          alert('文件读取失败：' + data.error);
        }
      } catch (e) {
        alert('请求失败：' + e.message);
      }
    }

    function goBack() {
      document.getElementById('main-content').style.display = 'block';
      document.getElementById('file-view').style.display = 'none';
      window.scrollTo(0, 0);
    }
  </script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    if (pathname === '/' || pathname === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(generateMainHTML());
      return;
    }

    if (pathname === '/view') {
      const filePath = parsedUrl.searchParams.get('path');
      if (!filePath) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: '缺少 path 参数' }));
        return;
      }

      const fullPath = path.join(SRC_DIR, filePath);
      if (!fullPath.startsWith(SRC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: '非法路径' }));
        return;
      }

      if (!fs.existsSync(fullPath)) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: '文件不存在' }));
        return;
      }

      const stats = fs.statSync(fullPath);
      const content = fs.readFileSync(fullPath, 'utf-8');

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        name: path.basename(filePath),
        path: filePath,
        size: formatFileSize(stats.size),
        content: content
      }));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: error.message }));
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('🚀 邻里技能共享小程序预览服务已启动');
  console.log('');
  console.log('📱 预览地址: http://localhost:' + PORT);
  console.log('');
  console.log('📂 项目结构:');
  console.log('   ├── TabBar 页面 (4个): 首页、订单、发布、我的');
  console.log('   ├── 二级页面 (11个): 技能详情、预约、订单详情等');
  console.log('   ├── 可复用组件 (4个): SkillCard、OrderCard、StarRating、EmptyState');
  console.log('   └── Mock 数据 (4个): 技能、分类、订单、用户');
  console.log('');
  console.log('💡 点击任意卡片查看源代码');
  console.log('');
});
