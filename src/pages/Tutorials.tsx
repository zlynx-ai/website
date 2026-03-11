import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { Check, Copy } from "lucide-react";

interface Tutorial {
  title: string;
  slug: string;
  section?: string;
}

const gettingStarted: Tutorial[] = [
  {
    title: "Installation",
    slug: "01_installation",
    section: "getting_started",
  },
  {
    title: "Your First Model",
    slug: "02_your_first_model",
    section: "getting_started",
  },
  { title: "Training", slug: "03_training", section: "getting_started" },
  {
    title: "Save & Load",
    slug: "04_save_and_load",
    section: "getting_started",
  },
  { title: "Sharding", slug: "05_sharding", section: "getting_started" },
];

const advanced: Tutorial[] = [
  { title: "PEFT Adapters", slug: "01_peft", section: "advanced" },
  { title: "GaLore Optimizer", slug: "02_galore", section: "advanced" },
];

const standalone: Tutorial[] = [{ title: "MNIST End-to-End", slug: "mnist" }];

const allTutorials = [...gettingStarted, ...advanced, ...standalone];

// Convert a markdown link like ./05_sharding.md or ../../mnist.md to a router path
function resolveMarkdownLink(href: string): string {
  if (href.startsWith("http") || href.startsWith("#")) return href;

  // Strip .md
  let cleanHref = href.replace(/\.mdx?$/, "");

  // Remove ./ and ../
  const parts = cleanHref.split("/").filter((p) => p !== ".");

  // Very simplistic resolution for this specific docs structure
  const filename = parts[parts.length - 1];
  const targetTutorial = allTutorials.find((t) => t.slug === filename);

  if (targetTutorial) {
    return targetTutorial.section
      ? `/tutorials/${targetTutorial.section}/${targetTutorial.slug}`
      : `/tutorials/${targetTutorial.slug}`;
  }

  return href;
}

function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const copyToClipboard = () => {
    if (preRef.current) {
      navigator.clipboard.writeText(preRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={copyToClipboard}
        className="absolute right-3 top-3 p-1.5 rounded-md bg-[#222222] text-theme-muted hover:text-white hover:bg-[#333333] opacity-0 group-hover:opacity-100 transition-all border border-theme-border flex items-center gap-1.5"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
      <pre
        ref={preRef}
        className={`bg-[#0a0a0a] border border-theme-border rounded p-5 mb-8 overflow-x-auto text-[13px] leading-relaxed font-mono selection:bg-[#333333] ${className || ""}`}
      >
        {children}
      </pre>
    </div>
  );
}

function MarkdownArticle({ urlPath }: { urlPath: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  // urlPath is like "getting_started/01_installation" or "mnist"
  useEffect(() => {
    setContent(null);
    setError(false);
    fetch(`/tutorials/${urlPath}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then(setContent)
      .catch(() => setError(true));
  }, [urlPath]);

  // Extract headings from markdown content for the Table of Contents
  const headings = useMemo(() => {
    if (!content) return [];
    // Match ## or ### followed by the title
    const regex = /^(##|###)\s+(.+)$/gm;
    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push({
        level: match[1].length, // 2 or 3
        text: match[2].trim(),
        id: match[2]
          .trim()
          .toLowerCase()
          .replace(/[^\w]+/g, "-"),
      });
    }
    return matches;
  }, [content]);

  // Set up scroll listener for scroll spy
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      let currentActive = headings[0].id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          // 150px accounts for the 64px fixed header plus some reading margin
          if (top <= 150) {
            currentActive = h.id;
          }
        }
      }
      setActiveId(currentActive);
    };

    // Run once on mount after content render
    const timeout = setTimeout(handleScroll, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings, content]);

  if (error) {
    return (
      <div className="flex-1 py-16 px-12">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-4">
          Tutorial not found
        </h1>
        <p className="text-theme-muted">
          The requested tutorial could not be loaded.
        </p>
      </div>
    );
  }

  if (content === null) {
    return (
      <div className="flex flex-1 max-w-[1240px] mx-auto w-full">
        <div className="flex-1 py-12 px-8 md:px-12 w-full animate-pulse">
          <div className="h-10 w-64 bg-theme-border/50 rounded mb-10 mt-2"></div>
          <div className="space-y-5">
            <div className="h-4 w-full bg-theme-border/30 rounded"></div>
            <div className="h-4 w-[90%] bg-theme-border/30 rounded"></div>
            <div className="h-4 w-[95%] bg-theme-border/30 rounded"></div>
            <div className="h-4 w-[80%] bg-theme-border/30 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 max-w-[1240px] mx-auto w-full">
      <article className="flex-1 min-w-0 py-12 px-8 md:px-12 w-full prose-zlynx">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-4xl font-bold text-white tracking-tight mb-8 mt-2 leading-tight">
                {children}
              </h1>
            ),
            h2: ({ children }) => {
              const id = String(children)
                .toLowerCase()
                .replace(/[^\w]+/g, "-");
              return (
                <h2
                  id={id}
                  className="text-2xl font-bold text-white tracking-tight mt-16 mb-4 pb-2 border-b border-theme-border scroll-mt-24"
                >
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => {
              const id = String(children)
                .toLowerCase()
                .replace(/[^\w]+/g, "-");
              return (
                <h3
                  id={id}
                  className="text-[18px] font-bold text-white mt-10 mb-4 tracking-tight scroll-mt-24"
                >
                  {children}
                </h3>
              );
            },
            p: ({ children }) => (
              <p className="text-[15px] text-[#b0b0b0] font-light leading-relaxed mb-6">
                {children}
              </p>
            ),
            a: ({ href, children }) => {
              const resolvedHref = href ? resolveMarkdownLink(href) : "#";
              const isInternal = resolvedHref.startsWith("/");
              if (isInternal) {
                return (
                  <Link
                    to={resolvedHref}
                    className="text-theme-accent hover:underline decoration-theme-accent/30 underline-offset-4"
                  >
                    {children}
                  </Link>
                );
              }
              return (
                <a
                  href={href}
                  className="text-theme-accent hover:underline decoration-theme-accent/30 underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  {children}
                </a>
              );
            },
            ul: ({ children }) => (
              <ul className="list-disc list-outside ml-5 text-[15px] text-[#b0b0b0] font-light mb-6 space-y-2 leading-relaxed">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-outside ml-5 text-[15px] text-[#b0b0b0] font-light mb-6 space-y-2 leading-relaxed">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="pl-1 text-[#b0b0b0] marker:text-theme-muted">
                {children}
              </li>
            ),
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code className="text-white font-mono text-[13px] bg-theme-border/40 px-1.5 py-0.5 rounded">
                    {children}
                  </code>
                );
              }
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            pre: ({ children, ...props }) => {
              return (
                <CodeBlock className={(props as any).className}>
                  {children}
                </CodeBlock>
              );
            },
            table: ({ children }) => (
              <div className="overflow-x-auto mb-8 border border-theme-border rounded">
                <table className="w-full text-[14px] border-collapse bg-[#0a0a0a]">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="border-b border-theme-border bg-[#0d0d0d]">
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th className="text-left text-white font-semibold py-3 px-4">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="text-[#b0b0b0] py-3 px-4 border-b border-theme-border/50">
                {children}
              </td>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-theme-border pl-5 my-8 text-white italic bg-[#0a0a0a] py-4 pr-4 rounded-r">
                {children}
              </blockquote>
            ),
            hr: () => <hr className="border-theme-border my-12" />,
            strong: ({ children }) => (
              <strong className="text-white font-semibold">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="text-white italic">{children}</em>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>

      {/* Table of Contents - Right Sidebar */}
      {headings.length > 0 && (
        <aside className="w-56 hidden xl:block shrink-0 pt-16 pr-8 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-theme-muted mb-4 px-2">
            On this page
          </h4>
          <ul className="space-y-2 border-l border-theme-border/50 ml-2">
            {headings.map((h, i) => {
              const isActive = activeId === h.id;
              return (
                <li key={`${h.id}-${i}`}>
                  <a
                    href={`#${h.id}`}
                    className={`block text-[13px] leading-snug transition-colors border-l -ml-[1px] ${
                      h.level === 3 ? "pl-5" : "pl-3"
                    } ${
                      isActive
                        ? "text-white font-medium border-theme-accent"
                        : "text-theme-muted hover:text-white border-transparent hover:border-theme-accent/50"
                    }`}
                  >
                    {h.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </aside>
      )}
    </div>
  );
}

function SidebarLink({ t }: { t: Tutorial }) {
  const location = useLocation();
  const path = t.section
    ? `/tutorials/${t.section}/${t.slug}`
    : `/tutorials/${t.slug}`;
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`block px-3 py-1.5 text-[14px] rounded transition-colors ${
        isActive
          ? "bg-theme-accent/10 text-theme-accent font-medium"
          : "text-theme-muted hover:text-white hover:bg-theme-border/30"
      }`}
    >
      {t.title}
    </Link>
  );
}

function Sidebar() {
  return (
    <aside className="w-64 border-r border-theme-border overflow-y-auto h-[calc(100vh-64px)] p-6 hidden md:block shrink-0 sticky top-16 custom-scrollbar">
      <div className="mb-8">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-theme-muted mb-3 px-3">
          Getting Started
        </h4>
        <div className="space-y-0.5">
          {gettingStarted.map((t) => (
            <SidebarLink key={t.slug} t={t} />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-theme-muted mb-3 px-3">
          Advanced
        </h4>
        <div className="space-y-0.5">
          {advanced.map((t) => (
            <SidebarLink key={t.slug} t={t} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-theme-muted mb-3 px-3">
          Examples
        </h4>
        <div className="space-y-0.5">
          {standalone.map((t) => (
            <SidebarLink key={t.slug} t={t} />
          ))}
        </div>
      </div>
    </aside>
  );
}

function ArticleRouter() {
  const { section, slug } = useParams();
  if (!slug) return null; // Handled by top-level redirect

  const urlPath = section ? `${section}/${slug}` : slug;
  return <MarkdownArticle urlPath={urlPath} />;
}

export default function Tutorials() {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect root /tutorials to the first article
  useEffect(() => {
    if (
      location.pathname === "/tutorials" ||
      location.pathname === "/tutorials/"
    ) {
      navigate("/tutorials/getting_started/01_installation", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />
      <Routes>
        <Route path="/" element={<div />} /> {/* Blank pending redirect */}
        <Route path=":section/:slug" element={<ArticleRouter />} />
        <Route path=":slug" element={<ArticleRouter />} />
      </Routes>
    </div>
  );
}
