/* Auto-Continue v2.2 – VS Code WebView (with UI toggle) */
(() => {

  /**************** 可调参数 ****************/
  const MSG_TO_SEND     = '继续';
  const CHECK_MS        = 1000;        // 轮询间隔
  const THROTTLE_MS     = 2000;        // 节流
  const STOP_KEYWORDS   = ['Stopped', '停止', '已停止'];
  const TOGGLE_ICON_ON  = 'codicon-check';
  const TOGGLE_ICON_OFF = 'codicon-circle-slash';
  /*****************************************/

  /* ====== Selector 集合（必要时自行调整） ====== */
  const SEL = {
    popup     : '.bg-dropdown-background',
    tryAgain  : '.bg-dropdown-background .anysphere-secondary-button',
    sendBtn   : '.anysphere-icon-button[data-variant="background"]',
    btnArea   : '.button-container.composer-button-area', // 发送按钮所在 flex 容器
    input     : '.aislash-editor-input[contenteditable="true"]',
    toggleId  : 'ac-toggle-btn',                          // 我们插入的开关按钮 id
  };

  /* --------------- 脚本状态 --------------- */
  let enabled     = true;   // 自动继续开关
  let verbose     = true;   // 日志开关
  let lastAction  = 0;      // 节流时间戳

  /* --------------- 帮助函数 --------------- */
  const sty = lvl => ({
    info : 'color:#3fa1ff',
    warn : 'color:#ffb302',
    err  : 'color:#ff4d4f',
    dbg  : 'color:#8a8a8a',
  }[lvl] || '');
  const log = (lvl, ...m) => verbose && console.log(`%c[AC-${lvl}]`, sty(lvl), ...m);

  /* ---------- UI：插入开关按钮 ---------- */
  function injectToggleBtn() {
    if (document.getElementById(SEL.toggleId)) return;           // 已存在
    const area = document.querySelector(SEL.btnArea);
    if (!area) {
      log('dbg', '等待按钮区域加载…');
      return;
    }

    // 复制一份发送按钮的 DOM 风格，改 icon / id
    const btn = document.createElement('div');
    btn.className = 'anysphere-icon-button bg-[transparent] border-none text-foreground flex w-3 items-center justify-center';
    btn.id = SEL.toggleId;
    btn.title = '自动继续已开启 (点击切换)';
    btn.style.cursor = 'pointer';

    const icon = document.createElement('span');
    icon.className = `codicon ${TOGGLE_ICON_ON} !text-[12px]`;
    btn.appendChild(icon);
    area.appendChild(btn);

    btn.addEventListener('click', () => {
      enabled = !enabled;
      icon.className = `codicon ${enabled ? TOGGLE_ICON_ON : TOGGLE_ICON_OFF} !text-[12px]`;
      btn.title = `自动继续已${enabled ? '开启' : '关闭'} (点击切换)`;
      log('info', `UI 切换 => 自动继续 ${enabled ? 'ON' : 'OFF'}`);
    });

    log('info', '已插入 Auto-Continue UI 开关按钮');
  }

  /* ----------- 快捷键 (备份方案) ----------- */
  window.addEventListener('keydown', e => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'c') {
      enabled = !enabled;
      updateToggleUI();
      log('info', `快捷键 => 自动继续 ${enabled ? 'ON' : 'OFF'}`);
    }
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
      verbose = !verbose;
      console.log(`%c[Auto-Continue] 日志 ${verbose ? 'ON' : 'OFF'}`, 'color:#7c5cff');
    }
  });

  /* -------- 主循环：1 s 检查一次 -------- */
  const loop = () => {
    injectToggleBtn();      // 保证 UI 已就位
    if (!enabled) return;   // UI / 快捷键可关闭

    const now = Date.now();
    if (now - lastAction < THROTTLE_MS) return;   // 节流

    /* 1) 网络弹窗 → Try again */
    const popup = document.querySelector(SEL.popup);
    if (popup) {
      const btn = popup.querySelector(SEL.tryAgain);
      if (btn) {
        btn.click();
        lastAction = now;
        log('warn', '🔁 弹窗 -> 点击 Try again');
        return;
      }
    }

    /* 2) 发送按钮禁用 → 自动续写 */
    const sendBtn = document.querySelector(SEL.sendBtn);
    if (sendBtn && sendBtn.dataset.disabled === 'true') {
      log('info', '📤 发送按钮 disabled，自动续写…');
      sendContinue(sendBtn);
      lastAction = now;
    }
  };

  /* -------- 续写核心逻辑 -------- */
  async function sendContinue(sendBtn) {
    const input = document.querySelector(SEL.input);
    if (!input) { log('err', '❌ 找不到输入框'); return; }

    input.focus();
    document.execCommand('selectAll', false);
    document.execCommand('insertText', false, MSG_TO_SEND);
    log('dbg', `插入 "${MSG_TO_SEND}"`);

    ['keydown', 'keypress', 'keyup'].forEach(t =>
      input.dispatchEvent(new KeyboardEvent(t, {
        key: 'Enter', code: 'Enter', bubbles: true
      }))
    );
    log('dbg', '派发 Enter 事件');

    /* 等待按钮激活后点击 */
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 100));
      if (sendBtn.dataset.disabled !== 'true') {
        sendBtn.click();
        log('info', `✅ 已发送 (${new Date().toLocaleTimeString()})`);
        return;
      }
    }
    log('warn', '⚠️ 按钮未重新启用，发送可能失败');
  }

  /* -------- 在 UI 切换 / 快捷键切换时同步按钮图标 -------- */
  function updateToggleUI() {
    const btn = document.getElementById(SEL.toggleId);
    if (!btn) return;
    const icon = btn.querySelector('span');
    icon.className = `codicon ${enabled ? TOGGLE_ICON_ON : TOGGLE_ICON_OFF} !text-[12px]`;
    btn.title = `自动继续已${enabled ? '开启' : '关闭'} (点击切换)`;
  }

  /* -------- MutationObserver + 轮询双保险 -------- */
  const mo = new MutationObserver(loop);
  mo.observe(document.body, { childList: true, subtree: true });
  setInterval(loop, CHECK_MS);

  log('info', 'Auto-Continue v2.2 启动：UI 开关已就绪 (Ctrl+Alt+C, Ctrl+Alt+L)');
})();
