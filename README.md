# Cursor‑Unlimited‑auto‑continue‑script

> ⚡ **English & 中文双语 / Bilingual** ⚡
> *An unobtrusive auto‑continue helper for Cursor / VS Code WebView*

---

## ✨ Features

|                                 | English                                                                      | 中文                                          |
| ------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------- |
| Auto‑detect stops               | Watches for disabled **Send** button or “Connection failed” pop‑ups.         | 自动侦测 **Send** 按钮灰掉或 “Connection failed” 弹窗。 |
| Automatic resume                | Inserts configurable text (default **继续**) and hits *Enter*.                 | 自动插入可自定义文字（默认 **继续**）并模拟 *Enter*。           |
| Two‑layer recovery              | 1️⃣ Clicks **Try again** on pop‑ups. 2️⃣ If still stuck, sends your message. | 1️⃣ 先点击弹窗中的 **Try again**。2️⃣ 若仍停滞，再发送文字。   |
| UI toggle                       | ✓ / ⃠ icon beside Send button.                                               | 发送按钮旁新增 ✓ / ⃠ 图标开关。                         |
| Hotkeys                         | `Ctrl/⌘ + Alt + C` toggle auto‑continue.                                     |                                             |
| `Ctrl/⌘ + Alt + L` toggle logs. | 同左。                                                                          |                                             |
| Verbose logs                    | Color‑coded info / warn / error / debug.                                     | 彩色调试日志，便于排查。                                |
| Zero deps                       | Pure vanilla JS.                                                             | 纯原生 JS，无依赖。                                 |

---

## 📦 Quick Start / 快速开始

1. **Open DevTools** → Console in Cursor / VS Code WebView.
   打开 DevTools → Console。
2. **Paste the script** below and press **Enter**.
   将下方脚本粘贴到 Console 并回车。

```js
// Cursor‑Unlimited‑auto‑continue‑script (v2.2)
// ... (full script here) ...
```

3. A ✓ icon appears next to Send → auto‑continue is active.
   发送按钮旁会出现 ✓ 图标，表示自动继续已启用。

> **Permanent setup? / 想永久生效？**
> Embed the code in your VS Code extension / WebView, or wrap it as a Tampermonkey userscript.

---

## ⚙️ Configuration / 配置

Modify the constants at the top of the script:

| Constant               | Default                  | Description              | 描述         |
| ---------------------- | ------------------------ | ------------------------ | ---------- |
| `MSG_TO_SEND`          | `"继续"`                   | Text to send when stuck. | 停滞时发送的文字。  |
| `CHECK_MS`             | `1000`                   | Polling interval (ms).   | 轮询间隔（毫秒）。  |
| `THROTTLE_MS`          | `2000`                   | Min gap between actions. | 两次动作的最小间隔。 |
| `STOP_KEYWORDS`        | `['Stopped','停止','已停止']` | Extra stop markers.      | 停止关键词。     |
| `TOGGLE_ICON_ON / OFF` | Codicon names            | UI icons.                | 开关图标。      |
| `SEL` object           | CSS selectors            | Match your DOM.          | 页面选择器。     |

---

## ⌨️ Keyboard Shortcuts / 键盘快捷键

| Shortcut           | Action                | 动作        |
| ------------------ | --------------------- | --------- |
| `Ctrl/⌘ + Alt + C` | Toggle auto‑continue. | 启用/停用自动继续 |
| `Ctrl/⌘ + Alt + L` | Toggle verbose logs.  | 开启/关闭日志   |

---

## 🛠️ How it Works / 工作原理

1. `MutationObserver` + `setInterval` watch DOM & send button.
   `MutationObserver` 结合 `setInterval` 监听 DOM 和发送按钮状态。
2. Popup? → Click **Try again** first.
   若出现弹窗，先点击 **Try again**。
3. Send button disabled? → Insert `MSG_TO_SEND`, dispatch *Enter*, wait until button enables, then click.
   发送按钮灰掉时：插入文字 → 触发 *Enter* → 等按钮亮起后点击。
4. UI toggle updates `enabled` state & tooltip.
   UI 开关通过 ✓ / ⃠ 图标反映当前状态。

---

## ❓ Troubleshooting / 常见问题

| Symptom                   | 解决方案                                               |                                            |
| ------------------------- | -------------------------------------------------- | ------------------------------------------ |
| No UI toggle              | Check `SEL.btnArea`; update selector.              | 按钮不见 → 检查 `SEL.btnArea` 选择器。               |
| Text inserts but not sent | Verify `sendBtn` selector & `data-disabled` logic. | 插入未发送 → 检查 `sendBtn` 选择器及 `data-disabled`。 |
| Input not found           | Update `SEL.input` to correct `contenteditable`.   | 找不到输入框 → 修改 `SEL.input`。                   |
| Need other language       | Change `MSG_TO_SEND`.                              | 需要其他语言 → 改 `MSG_TO_SEND`。                  |

Enable logs (<kbd>Ctrl/⌘</kbd> + <kbd>Alt</kbd> + <kbd>L</kbd>) for detailed console output.
使用日志帮助定位问题。

---

## 📄 License / 许可证

Released under the **MIT License**.
MIT 许可证，可自由使用、修改、再发布。
