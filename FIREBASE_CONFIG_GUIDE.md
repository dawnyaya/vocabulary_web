# Firebase 配置获取详细指南

## 方法1：通过项目设置获取配置

### 步骤：

1. **打开Firebase Console**
   - 访问 https://console.firebase.google.com/
   - 选择你的项目（或创建新项目）

2. **进入项目设置**
   - 点击左上角的齿轮图标 ⚙️（在"Project Overview"旁边）
   - 选择 **"项目设置"** 或 **"Project settings"**

3. **找到你的应用配置**
   - 在"常规"（General）标签页中，往下滚动
   - 找到 **"您的应用"** 或 **"Your apps"** 部分

4. **添加Web应用（如果还没有）**
   - 如果看到"还没有应用"，点击 **Web图标** `</>`
   - 如果已经有应用，跳到步骤5

5. **注册应用**
   - 输入应用昵称：`Memoloop Web`
   - 不需要勾选 Firebase Hosting
   - 点击 **"注册应用"** 或 **"Register app"**

6. **复制配置代码**
   - 你会看到一段类似这样的代码：
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdefghijklmnop"
   };
   ```
   - 复制这些值

7. **如果已经注册过应用**
   - 在"您的应用"部分，点击你的Web应用名称
   - 点击 **"配置"** 或 **"Config"**
   - 会显示相同的配置代码

---

## 方法2：通过CDN配置获取

如果上面的方法找不到，试试这个：

1. 在项目设置页面
2. 滚动到 **"SDK 设置和配置"** 部分
3. 选择 **"配置"** 单选按钮
4. 复制显示的配置对象

---

## 具体位置导航路径

```
Firebase Console 首页
  └─ [你的项目名称]
      └─ 左上角齿轮图标 ⚙️
          └─ "项目设置" / "Project settings"
              └─ "常规" / "General" 标签页
                  └─ 往下滚动到 "您的应用" / "Your apps"
                      └─ 如果没有应用：点击 Web 图标 </> 添加
                      └─ 如果有应用：点击应用名称查看配置
```

---

## 填写 .env 文件示例

获取配置后，在项目根目录的 `.env` 文件中填入：

```env
# Gemini AI（保持你现有的密钥）
VITE_GEMINI_API_KEY=你的Gemini密钥

# Firebase配置（从上面复制的值）
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
```

---

## 常见问题

### Q: 找不到"您的应用"部分
**A:** 可能你还没有注册Web应用。在项目设置页面，找到并点击 `</>` Web图标来创建一个。

### Q: 页面是中文/英文显示不同
**A:** 界面语言可能不同，但位置是一样的：
- 中文：项目设置 → 常规 → 您的应用
- English: Project settings → General → Your apps

### Q: 看到多个应用怎么办
**A:** 选择任意一个Web应用（图标是 `</>`），所有Web应用的配置都可以用。

---

## 快速检查清单

完成配置后，确认：
- [ ] `.env` 文件已创建
- [ ] 所有 `VITE_FIREBASE_*` 变量都已填写
- [ ] 没有 `your-project` 这样的占位符
- [ ] API Key 以 `AIza` 开头
- [ ] Project ID 和 Auth Domain 匹配你的项目

---

## 下一步

配置完成后：
1. 重启开发服务器（Ctrl+C 然后 `npm run dev`）
2. 打开 http://localhost:5173
3. 应该会看到登录页面
4. 点击 "Continue with Google" 测试登录

如果还有问题，请告诉我你卡在哪一步了！
