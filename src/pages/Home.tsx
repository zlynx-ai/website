import { Link } from "react-router-dom";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { Copy, Check } from "lucide-react";
import "highlight.js/styles/github-dark.css";

const features = [
  {
    label: "Training Loop",
    desc: "A complete training loop with automatic checkpointing, gradient accumulation, and multi-backend logging. No boilerplate needed.",
  },
  {
    label: "Native Sharding",
    desc: "Scale from a single GPU to a TPU pod using JAX NamedSharding. DDP and FSDP are controlled by a single string in the config.",
  },
  {
    label: "Adapters (PEFT)",
    desc: "Inject LoRA, DoRA, VeRA, LoHa, LoKr, or AdaLoRA into any model architecture with one function call.",
  },
  {
    label: "GaLore Optimizer",
    desc: "Train large models on smaller hardware. GaLore projects gradients into a low-rank subspace, cutting optimizer state memory by up to 65%.",
  },
];

const codeExample = `from zlynx import Z
from zlynx.trainer import Trainer, TrainerConfig

class CNN(Z):
    def __init__(self, key, num_classes=10):
        super().__init__()
        k1, k2, k3 = jax.random.split(key, 3)
        self.conv1 = nnx.Conv(1, 32, (3,3), rngs=nnx.Rngs(k1))
        self.conv2 = nnx.Conv(32, 64, (3,3), rngs=nnx.Rngs(k2))
        self.fc    = nnx.Linear(64*5*5, num_classes, rngs=nnx.Rngs(k3))

model = CNN(jax.random.key(42))

trainer = Trainer(
    model, loss_fn, data,
    config=TrainerConfig(per_device_batch_size=64, sharding="auto"))

trainer.train()`;

export default function Home() {
  const [copied, setCopied] = useState(false);
  const installCmd = "uv pip install zlynx";

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-36 pb-32 overflow-hidden border-b border-theme-border">
        {/* Stark geometry instead of muddy gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-theme-accent/5 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-[68px] font-bold leading-[1.05] tracking-tight mb-8 text-white">
              The JAX & Flax <br />
              <span className="text-theme-muted">Micro-Framework.</span>
            </h1>
            <p className="text-xl text-theme-muted leading-relaxed mb-12 max-w-2xl font-light">
              Zlynx wraps JAX, Flax NNX, Google Grain, and Orbax into a thin,
              transparent layer. Build production-grade models without fighting
              the abstraction.
            </p>
            <button
              onClick={handleCopy}
              className="mb-8 relative inline-flex items-center gap-3 px-5 py-3 rounded-md border border-theme-border/50 bg-[#000000]/60 backdrop-blur-md text-[13px] font-mono shadow-[0_0_30px_rgba(0,0,0,0.5)] group hover:bg-[#000000]/80 hover:border-theme-border transition-all duration-300"
            >
              <div className="flex items-center gap-3 pr-8">
                <span className="text-theme-accent select-none opacity-80 group-hover:opacity-100 transition-opacity">
                  $
                </span>
                <span className="text-white/90 group-hover:text-white transition-colors">
                  {installCmd}
                </span>
              </div>
              <div
                className={`absolute right-3 flex items-center justify-center rounded transition-all duration-200 ${
                  copied
                    ? "text-green-500 scale-110"
                    : "text-theme-muted group-hover:text-white"
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </div>
            </button>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/tutorials"
                className="flex items-center justify-center px-7 py-3.5 rounded bg-white text-black text-[15px] font-semibold hover:bg-neutral-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                Get Started
              </Link>
              <Link
                to="/docs"
                className="flex items-center justify-center px-6 py-3.5 rounded border border-theme-border bg-theme-bg/50 text-white text-[15px] font-medium hover:bg-theme-border/50 transition-colors"
              >
                Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Code Section */}
      <section className="py-24 border-b border-theme-border flex flex-col items-center">
        <div className="max-w-5xl w-full mx-auto px-8">
          <div className="grid md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-5 pt-4">
              <h2 className="text-3xl font-bold mb-5 text-white tracking-tight">
                Zero Magic.
              </h2>
              <p className="text-theme-muted leading-relaxed mb-6 text-[15px]">
                Zlynx doesn't dictate how you write your models. Inherit from a
                base class to gain checkpointing, then pass your model to the{" "}
                <code className="text-white font-mono bg-theme-border/50 px-1 py-0.5 rounded textxs">
                  Trainer
                </code>
                .
              </p>
              <p className="text-theme-muted leading-relaxed text-[15px]">
                You write standard Flax NNX code. Zlynx handles the massive data
                loaders and multi-node sharding logic in the background.
              </p>
            </div>

            <div className="md:col-span-7 bg-theme-card border border-theme-border rounded shadow-2xl overflow-hidden">
              <div className="h-10 bg-[#0d0d0d] border-b border-theme-border flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                <span className="ml-2 text-xs text-theme-muted font-mono tracking-wider">
                  train.py
                </span>
              </div>
              <div className="prose-zlynx overflow-x-auto text-[13px] leading-7 font-mono custom-scrollbar">
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    pre: ({ children }) => (
                      <pre className="m-0 p-6 bg-transparent w-max min-w-full block">
                        {children}
                      </pre>
                    ),
                    code: ({ className, children }) => (
                      <code className={`${className} block`}>{children}</code>
                    ),
                  }}
                >
                  {`\`\`\`python\n${codeExample}\n\`\`\``}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((f) => (
              <div
                key={f.label}
                className="p-8 bg-theme-bg border border-theme-border hover:border-theme-muted transition-colors duration-300"
              >
                <h3 className="text-lg font-bold mb-3 text-white tracking-tight">
                  {f.label}
                </h3>
                <p className="text-[15px] text-theme-muted leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-theme-border py-12">
        <div className="max-w-5xl mx-auto px-8 flex justify-between text-sm text-theme-muted">
          <span className="font-medium text-xl text-white tracking-tight">zlynx</span>
          <a
            href="https://github.com/zlynx-ai/zlynx"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
