import { useLayoutEffect, useRef, useState } from "react";

const STORAGE_KEY = "linksee-locale";

// 转换器需要跳过的区域：脚本/样式/代码块/表单控件/显式标记 data-no-convert（切换按钮自身）
const SKIP_SELECTOR = "script, style, pre, code, textarea, input, [data-no-convert]";

// 待转换的可文本化属性（只转换包含中文的属性值，绝不碰 href/src/class 等）
const CONVERTIBLE_ATTRIBUTES = ["aria-label", "title", "placeholder", "alt"];

const CJK_RE = /[㐀-鿿豈-﫿]/;

function hasCjk(value) {
  return CJK_RE.test(value);
}

function isInsideSkipArea(element) {
  for (let el = element; el && el !== document.body; el = el.parentElement) {
    if (el.matches(SKIP_SELECTOR)) return true;
  }
  return false;
}

function convertAttributes(element, converter) {
  for (const attr of CONVERTIBLE_ATTRIBUTES) {
    const value = element.getAttribute(attr);
    if (value && hasCjk(value)) {
      element.setAttribute(attr, converter(value));
    }
  }
}

function convertDocumentText(converter) {
  // 文本节点：收集后统一转换，避免遍历中修改影响 TreeWalker
  const textNodes = [];
  const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (isInsideSkipArea(node.parentElement)) return NodeFilter.FILTER_REJECT;
      return hasCjk(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  let textNode;
  while ((textNode = textWalker.nextNode())) textNodes.push(textNode);
  for (const node of textNodes) {
    if (hasCjk(node.nodeValue)) node.nodeValue = converter(node.nodeValue);
  }

  // 元素属性：aria-label/title/placeholder/alt（含中文才转）
  const elementWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
    acceptNode(element) {
      if (isInsideSkipArea(element.parentElement)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let element;
  while ((element = elementWalker.nextNode())) convertAttributes(element, converter);
}

let convertersPromise = null;

function loadConverters() {
  if (!convertersPromise) {
    // opencc-js 字典较大，动态 import 拆成独立 chunk，仅在需要时加载
    convertersPromise = import("opencc-js").then(({ Converter }) => ({
      tc: Converter({ from: "cn", to: "hk" }),
      sc: Converter({ from: "hk", to: "cn" }),
    }));
  }
  return convertersPromise;
}

/**
 * 整页简繁体切换。
 * 返回 { locale, setLocale }：
 *   locale    — "sc"（简体，默认）| "tc"（繁体），初始值读 localStorage
 *   setLocale — 指定语言，写入 localStorage 并触发重渲染
 *
 * 原理：SPA 重渲染会把被转换的文本还原成简体，因此用 useLayoutEffect
 * 在每次 commit 后、浏览器绘制前，按当前目标语言整页重转一次，无闪烁无遗漏。
 * opencc 对已转换文本再转近似无操作，重复应用安全。
 */
export function useChineseLocale() {
  const [locale, setLocaleState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "tc" ? "tc" : "sc";
    } catch {
      return "sc";
    }
  });
  const localeRef = useRef(locale);
  const [loaded, setLoaded] = useState(false);

  const setLocale = (next) => {
    if (next !== "sc" && next !== "tc") return;
    localeRef.current = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 隐私模式等场景忽略持久化失败
    }
    if (next === "tc") {
      loadConverters().then(() => setLoaded(true));
    }
    setLocaleState(next);
  };

  // 每次 commit 后整页重转；简体默认态且未加载过转换器时无需任何操作
  useLayoutEffect(() => {
    if (!loaded) return;
    const target = localeRef.current;
    loadConverters().then(({ tc, sc }) => {
      const converter = target === "tc" ? tc : sc;
      convertDocumentText(converter);
      document.documentElement.lang = target === "tc" ? "zh-Hant" : "zh-Hans";
      if (hasCjk(document.title)) document.title = converter(document.title);
    });
  });

  // 记忆为繁体时挂载即加载并转换
  useLayoutEffect(() => {
    if (localeRef.current === "tc") {
      loadConverters().then(() => setLoaded(true));
    }
  }, []);

  return { locale, setLocale };
}
