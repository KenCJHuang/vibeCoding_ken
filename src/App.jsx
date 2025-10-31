import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Feather, Home, FileText, Info } from "lucide-react";

// ---------- Demo Content ----------
const DEMO_POSTS = [
  {
    id: "soft-ux-colors",
    title: "用柔和色打造舒服的閱讀體驗",
    date: "2025-10-31",
    tags: ["UI/UX", "Design"],
    excerpt:
      "介紹如何透過低飽和度的色彩、適度留白與圓角，降低閱讀疲勞並提升停留時間。",
    content:
      `在設計部落格時，色彩越鮮豔不一定越好。建議以 *低飽和度*、*高明度* 的色票作為背景，
      讓真正重要的元素（例如標題、行動按鈕）以略高的對比呈現。\n\n
      小技巧：
      1. 主背景使用偏灰的奶茶色或霧白色，避免純白刺眼。\n
      2. 卡片採用柔和色塊（如#F8FAFC、#EEF2FF），外加 12–16px 的圓角與微弱陰影。\n
      3. 文字行高 1.8–2.0，字體大小至少 16–18px，段落間距 12–16px。\n
      4. 善用插圖或留白分段，別讓讀者面對一整面文字牆。`,
  },
  {
    id: "content-structure",
    title: "內容結構：首頁、內頁、文章頁怎麼規劃",
    date: "2025-10-30",
    tags: ["Content", "IA"],
    excerpt:
      "說明三種頁型的角色：首頁吸引、內頁說明、文章頁深讀，並附導覽設計要點。",
    content:
      `首頁的任務是「吸引 + 導流」，以 Hero、最新文章、主題入口為核心模組。\n\n
      內頁可放品牌故事、作者介紹、服務或合作資訊。\n\n
      文章頁專注於可讀性：單欄排版、舒適行距、固定寬度（~ 680–760px）。\n      另外配置「返回列表」、「前一篇 / 下一篇」與「推薦閱讀」。`,
  },
  {
    id: "perf-accessibility",
    title: "速度與無障礙：別忘了核心體驗",
    date: "2025-10-28",
    tags: ["Performance", "A11y"],
    excerpt:
      "分享圖片優化、延遲載入、語意化標籤與對比度檢查，讓網站對所有人更友善。",
    content:
      `良好的載入速度與無障礙設計會直接影響 SEO 與留存。\n\n
      ‣ 圖片以 WebP/AVIF，並延遲載入。\n
      ‣ 文字與背景對比至少 4.5:1。\n
      ‣ 使用語意化標籤（header/main/article/nav）。\n
      ‣ 用 aria-* 屬性輔助螢幕閱讀器理解導覽順序。`,
  },
];

// ---------- Router (hash-based, single-file) ----------
function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(location.hash));
  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  return route;
}

function parseHash(hash) {
  const cleaned = hash.replace(/^#\/?/, "");
  if (!cleaned) return { name: "home" };
  const [first, second] = cleaned.split("/");
  if (first === "about") return { name: "about" };
  if (first === "article" && second) return { name: "article", id: second };
  return { name: "home" };
}

// ---------- UI Helpers ----------
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

// ---------- Components ----------
function Nav({ current }) {
  const navItem = (href, label, Icon) => (
    <a
      href={href}
      className={classNames(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full transition shadow-sm",
        "bg-white/70 backdrop-blur hover:bg-white",
        current === href
          ? "ring-2 ring-indigo-200 text-indigo-700"
          : "text-slate-600"
      )}
      aria-current={current === href ? "page" : undefined}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </a>
  );

  return (
    <nav className="flex items-center justify-between gap-3">
      <a href="#/" className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-2xl bg-indigo-100 flex items-center justify-center">
          <Feather className="h-4 w-4 text-indigo-600" />
        </div>
        <span className="font-semibold text-slate-800">SoftBlog</span>
      </a>
      <div className="flex items-center gap-2">
        {navItem("#/", "首頁", Home)}
        {navItem("#/about", "內頁", Info)}
        {navItem("#/article/soft-ux-colors", "文章頁", FileText)}
      </div>
    </nav>
  );
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/50 to-rose-50/40">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-3xl bg-white/70 shadow-xl ring-1 ring-black/5 backdrop-blur">
          <header className="p-6 md:p-8 border-b border-slate-100">
            <Nav current={location.hash || "#/"} />
          </header>
          <main className="p-6 md:p-10">{children}</main>
          <footer className="px-6 md:px-10 py-8 border-t border-slate-100 text-sm text-slate-500">
            © {new Date().getFullYear()} SoftBlog. Crafted with ♥ for smooth reading.
          </footer>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEMO_POSTS;
    return DEMO_POSTS.filter(
      (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-8">
      <motion.section
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-100 via-sky-100 to-emerald-100 p-8 md:p-12"
      >
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            柔和又有質感的部落格樣板
          </h1>
          <p className="mt-3 text-slate-600">
            這是一個單檔 React 小應用，內含首頁、內頁與文章頁。採用圓角、柔和色彩、
            微陰影與留白，提供舒適的閱讀體驗。
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="#/article/soft-ux-colors"
              className="rounded-full bg-indigo-600 text-white px-5 py-2.5 text-sm font-medium shadow hover:bg-indigo-500"
            >
              立即閱讀
            </a>
            <a
              href="#/about"
              className="rounded-full bg-white/80 ring-1 ring-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-white"
            >
              了解更多
            </a>
          </div>
        </div>
      </motion.section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="w-full bg-transparent outline-none placeholder:text-slate-400 text-sm"
            placeholder="搜尋文章…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((post) => (
            <motion.article
              key={post.id}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              className="group rounded-2xl bg-white/90 ring-1 ring-slate-200 p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span>•</span>
                <span className="inline-flex gap-1">
                  {post.tags.map((t) => (
                    <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5">
                      {t}
                    </span>
                  ))}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-slate-800">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 line-clamp-3">{post.excerpt}</p>
              <a
                href={`#/article/${post.id}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-700 hover:text-indigo-600"
              >
                繼續閱讀
                <span aria-hidden>→</span>
              </a>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}

function AboutPage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="prose prose-slate max-w-none">
      <h1>關於這個樣板</h1>
      <p>
        這個單檔 React App 採用 <strong>柔和色系</strong>、<strong>圓角設計</strong> 與
        <strong>留白</strong> 策略，專為部落格建立舒適的閱讀體驗。你可以把它複製到專案，接上你的
        API 或 CMS（如 Notion、Contentful、Sanity），就能快速擴充。
      </p>
      <h2>頁面結構</h2>
      <ul>
        <li>首頁：Hero、搜尋、最新文章格狀卡片。</li>
        <li>內頁：品牌/作者介紹、合作資訊、聯繫入口。</li>
        <li>文章頁：單欄排版、推薦閱讀、返回列表。</li>
      </ul>
      <h2>設計語言</h2>
      <ul>
        <li>配色：淡靛藍、粉霧玫瑰、天空藍的漸層背景，搭配白色半透明卡片。</li>
        <li>圓角：卡片/按鈕/導覽皆採用 16–24px 圓角，搭配柔和陰影。</li>
        <li>排版：長文行寬約 70–85 字元、行高 1.8–2.0、段距 12–16px。</li>
      </ul>
      <p className="not-prose mt-6">
        <a href="#/" className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-5 py-2.5 text-sm">
          返回首頁
        </a>
      </p>
    </motion.div>
  );
}

function ArticlePage({ id }) {
  const post = DEMO_POSTS.find((p) => p.id === id) ?? DEMO_POSTS[0];
  const neighbors = useMemo(() => {
    const idx = DEMO_POSTS.findIndex((p) => p.id === post.id);
    return {
      prev: DEMO_POSTS[idx - 1],
      next: DEMO_POSTS[idx + 1],
    };
  }, [post.id]);

  return (
    <motion.article variants={pageVariants} initial="initial" animate="animate" className="mx-auto max-w-3xl">
      <div className="text-xs text-slate-500 flex items-center gap-2">
        <a href="#/" className="underline underline-offset-2">首頁</a>
        <span>›</span>
        <span>文章</span>
      </div>

      <h1 className="mt-2 text-3xl font-bold text-slate-800">{post.title}</h1>
      <div className="mt-1 text-sm text-slate-500">
        {new Date(post.date).toLocaleDateString()} · {post.tags.join("、")}
      </div>

      <div className="mt-6 rounded-3xl bg-white/90 ring-1 ring-slate-200 p-6 shadow-sm">
        {post.content.split("\\n\\n").map((para, i) => (
          <p key={i} className="mt-4 leading-8 text-slate-700">
            {para}
          </p>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <a
          href={neighbors.prev ? `#/article/${neighbors.prev.id}` : "#/"}
          className={classNames(
            "rounded-full px-4 py-2 text-sm",
            neighbors.prev ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
          )}
          aria-disabled={!neighbors.prev}
        >
          ← 上一篇
        </a>
        <a
          href={neighbors.next ? `#/article/${neighbors.next.id}` : "#/"}
          className={classNames(
            "rounded-full px-4 py-2 text-sm",
            neighbors.next ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
          )}
          aria-disabled={!neighbors.next}
        >
          下一篇 →
        </a>
      </div>
    </motion.article>
  );
}

// ---------- App ----------
export default function SoftBlogApp() {
  const route = useHashRoute();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {route.name === "home" && (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <HomePage />
          </motion.div>
        )}
        {route.name === "about" && (
          <motion.div key="about" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <AboutPage />
          </motion.div>
        )}
        {route.name === "article" && (
          <motion.div key={route.id} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ArticlePage id={route.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
