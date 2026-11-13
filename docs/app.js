/* ============================================================
   BIM 導入決策｜5 頁互動簡報
   - 分頁導覽、進度、鍵盤與滑動
   - 現況／目標切換、分頁內容、效益試算、決策摘要複製
   無外部依賴。
   ============================================================ */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var pages = Array.prototype.slice.call(document.querySelectorAll(".page"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".dots button"));
  var bar = document.getElementById("bar");
  var pagerNow = document.getElementById("pager-now");
  var current = 0;

  /* ---------- 目前頁面與進度 ---------- */

  function setActive(index) {
    current = index;
    dots.forEach(function (d, i) {
      if (i === index) d.setAttribute("aria-current", "true");
      else d.removeAttribute("aria-current");
    });
    if (pagerNow) pagerNow.textContent = String(index + 1);
    document.body.classList.toggle("is-dark", pages[index].classList.contains("page--cover") ||
      pages[index].classList.contains("page--decide"));
  }

  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (bar) bar.style.width = (pct * 100).toFixed(2) + "%";
  }

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          setActive(pages.indexOf(entry.target));
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

    pages.forEach(function (p) { spy.observe(p); });
  } else {
    pages.forEach(function (p) { p.classList.add("is-in"); });
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  /* ---------- 導覽 ---------- */

  function goTo(index) {
    var target = pages[Math.max(0, Math.min(pages.length - 1, index))];
    if (!target) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  dots.forEach(function (d) {
    d.addEventListener("click", function () {
      goTo(pages.indexOf(document.getElementById(d.dataset.go)));
    });
  });

  document.addEventListener("keydown", function (e) {
    var t = e.target;
    var typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
    var inTabs = t && t.closest && t.closest('[role="tablist"]');

    if (typing) return; // 讓滑桿與勾選框保有自己的方向鍵行為
    if (inTabs && (e.key === "ArrowLeft" || e.key === "ArrowRight")) return; // 分頁自己處理

    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
      case "PageDown":
      case " ":
        e.preventDefault();
        goTo(current + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault();
        goTo(current - 1);
        break;
      case "Home":
        e.preventDefault();
        goTo(0);
        break;
      case "End":
        e.preventDefault();
        goTo(pages.length - 1);
        break;
    }
  });

  /* ---------- 現況／目標切換 ---------- */

  var stateButtons = Array.prototype.slice.call(document.querySelectorAll(".switch button"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));

  function applyState(state) {
    stateButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.state === state ? "true" : "false");
    });
    cards.forEach(function (card) {
      card.classList.toggle("is-goal", state === "goal");
      var title = card.querySelector(".card__title");
      var para = card.querySelector("p");
      if (title) title.textContent = title.dataset[state] || title.textContent;
      if (para) para.textContent = para.dataset[state] || para.textContent;
    });
  }

  stateButtons.forEach(function (b) {
    b.addEventListener("click", function () { applyState(b.dataset.state); });
  });

  /* ---------- 內容分頁 ---------- */

  var tabLists = Array.prototype.slice.call(document.querySelectorAll(".tabs[role=\"tablist\"]"));
  tabLists.forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { selectTab(tabs, i); });
      tab.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          e.stopPropagation();
          var next = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
          selectTab(tabs, next, true);
        }
      });
    });
  });

  function selectTab(tabs, index, focus) {
    tabs.forEach(function (t, i) {
      var on = i === index;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
    });
    if (focus && tabs[index]) tabs[index].focus();
  }

  /* ---------- 效益試算 ---------- */

  var COST_Y1 = 498400;      // 第一年總成本（含機會成本）
  var OPEX_Y2 = 98920;       // 第二年營運成本
  var HOURS_PER_CASE = 420;  // 每案圖說工時（現況）
  var RATE = 800;            // 內部時薪
  var REWORK_PER_CASE = 15000;
  var NEWBIZ_PER_CASE = 25000;

  var casesEl = document.getElementById("cases");
  var cutEl = document.getElementById("cut");

  function fmt(n) {
    return n.toLocaleString("zh-TW", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  function recalc() {
    if (!casesEl || !cutEl) return;
    var cases = Number(casesEl.value);
    var cut = Number(cutEl.value) / 100;

    var saved = cases * HOURS_PER_CASE * cut * RATE;
    var benefit = saved + cases * REWORK_PER_CASE + cases * NEWBIZ_PER_CASE;
    var net = benefit - OPEX_Y2;
    var months = net > 0 ? 12 * (1 + COST_Y1 / net) : Infinity;

    document.getElementById("v-cases").textContent = cases;
    document.getElementById("v-cut").textContent = Math.round(cut * 100);

    document.getElementById("out-benefit").textContent = fmt(benefit / 10000);
    var pb = document.getElementById("out-payback");
    var note = document.getElementById("calc-note");

    if (!isFinite(months)) {
      pb.textContent = "—";
      note.textContent = "以這個參數，年效益扣掉營運成本後為負，無法回收。";
    } else {
      pb.textContent = fmt(months);
      var hrs = Math.round(HOURS_PER_CASE * cut);
      note.textContent = "每案省 " + hrs + " 小時，年效益包含工時節省、重工減少與增接案毛利。";
    }
  }

  if (casesEl && cutEl) {
    casesEl.addEventListener("input", recalc);
    cutEl.addEventListener("input", recalc);
    recalc();
  }

  /* ---------- 深連結：?p=3 或 #p3 ---------- */

  (function deepLink() {
    var m = /[?&]p=(\d)/.exec(location.search);
    var idx = m ? parseInt(m[1], 10) - 1 : -1;
    if (idx >= 0 && idx < pages.length) {
      // 直接開啟深連結時不要等淡入，避免第一眼看到空白
      document.documentElement.classList.add("no-anim");
      pages.forEach(function (p) { p.classList.add("is-in"); });
      window.setTimeout(function () {
        pages[idx].scrollIntoView({ behavior: "auto", block: "start" });
        setActive(idx);
      }, 30);
    }
  })();

  /* ---------- 決策摘要複製 ---------- */

  var copyBtn = document.getElementById("copy");
  var toast = document.getElementById("toast");

  function summaryText() {
    var items = Array.prototype.slice.call(
      document.querySelectorAll("#decisions input:checked")
    ).map(function (input, i) {
      var label = input.closest("label");
      var title = label.querySelector("b").textContent;
      var body = label.querySelector("span").textContent.replace(title, "").trim();
      return (i + 1) + ". " + title + "：" + body;
    });

    if (!items.length) return "";

    return [
      "BIM 導入決策摘要（2026.11）",
      "",
      items.join("\n"),
      "",
      "第一年 49.8 萬｜第二年效益 124 萬｜17 個月回本",
      "來源：《BIM 導入計畫》v2.0"
    ].join("\n");
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(function () { toast.textContent = ""; }, 2600);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = summaryText();
      if (!text) {
        showToast("先勾選至少一項要納入的決策。");
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showToast("已複製，可直接貼到訊息或會議紀錄。");
        }).catch(function () { fallbackCopy(text); });
      } else {
        fallbackCopy(text);
      }
    });
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast("已複製，可直接貼到訊息或會議紀錄。");
    } catch (err) {
      showToast("複製失敗，請手動選取文字。");
    }
    document.body.removeChild(ta);
  }
})();
