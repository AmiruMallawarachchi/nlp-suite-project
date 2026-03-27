"use client";

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Target, 
  UserSearch, 
  HelpCircle, 
  ArrowRight, 
  Terminal, 
  AlertCircle, 
  Loader2,
  Brain,
  Github,
  LayoutGrid,
  Command,
  Code2,
  ExternalLink,
  ChevronRight,
  Globe,
  Zap
} from 'lucide-react';

type Tool = 'summarization' | 'sentiment' | 'zeroshot' | 'ner' | 'qa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const DEFAULT_LABELS = ["Technology", "Space", "Politics", "Sports", "Nature", "Health", "Finance", "AI"];

const ENTITY_INFO: Record<string, { title: string; color: string; description: string }> = {
  PER: { title: "Person", color: "text-syntax-blue", description: "Human identity or fictional character." },
  ORG: { title: "Organization", color: "text-syntax-purple", description: "Companies, agencies, and institutions." },
  LOC: { title: "Location", color: "text-syntax-orange", description: "Geographic points, countries, and cities." },
  MISC: { title: "Miscellaneous", color: "text-syntax-red", description: "Events, nationalities, or product titles." },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tool>('summarization');
  const [text, setText] = useState('');
  const [labels, setLabels] = useState<string[]>(["Technology", "Space", "AI"]);
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<number | null>(null);

  const tools = [
    { id: 'summarization', label: 'Summarize', icon: FileText, desc: 'Condense long-form text into concise intelligence.' },
    { id: 'sentiment', label: 'Sentiment', icon: Sparkles, desc: 'Detect emotional resonance and polarity in text.' },
    { id: 'zeroshot', label: 'Zero-Shot', icon: Target, desc: 'Classify text into any category without training.' },
    { id: 'ner', label: 'NER Parsing', icon: UserSearch, desc: 'Extract entities like names, organizations, and places.' },
    { id: 'qa', label: 'Context Q&A', icon: HelpCircle, desc: 'Get direct answers from your provided documents.' },
  ];

  const handleProcess = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let endpoint = '';
      let body: any = {};

      if (activeTab === 'summarization') {
        endpoint = '/summarize';
        body = { text, min_length: 20, max_length: 150 };
      } else if (activeTab === 'sentiment') {
        endpoint = '/sentiment';
        body = { text };
      } else if (activeTab === 'zeroshot') {
        endpoint = '/zero-shot';
        body = { text, labels: labels, multi_label: false };
      } else if (activeTab === 'ner') {
        endpoint = '/ner';
        body = { text };
      } else if (activeTab === 'qa') {
        endpoint = '/qa';
        body = { question, context, top_k: 1 };
      }

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleLabel = (label: string) => {
    if (labels.includes(label)) {
      setLabels(labels.filter(l => l !== label));
    } else {
      setLabels([...labels, label]);
    }
  };

  const renderAnnotatedText = () => {
    if (!result || !result.annotated_text) return null;
    const parts = result.annotated_text.split(/(\[.*?\/.*?\])/g);
    
    return parts.map((part: string, i: number) => {
      const match = part.match(/\[(.*?)\/(.*?)\]/);
      if (match) {
        const [_, entityText, label] = match;
        const info = ENTITY_INFO[label] || { title: label, color: "text-brand-accent", description: "Entity identifier." };
        return (
          <span 
            key={i} 
            className={`cursor-help border-b border-white/20 px-1 font-medium transition-colors hover:bg-white/5 ${info.color}`}
            title={info.description}
          >
            {entityText}
            <span className="ml-1 text-[10px] font-bold opacity-50">{label}</span>
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text selection:bg-brand-accent/30 selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-brand-border bg-brand-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent text-black">
              <Code2 size={18} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight">NLP<span className="text-brand-accent">Suite</span></span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            {['Features', 'Docs', 'API', 'Pricing'].map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-brand-text-muted transition-colors hover:text-white">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/AmiruMallawarachchi" target="_blank" className="text-brand-text-muted hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <button className="hidden rounded-full bg-brand-accent px-5 py-2 text-xs font-bold text-black transition-all hover:scale-105 active:scale-95 md:block">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        
        {/* Hero Section */}
        <section className="relative mb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-accent/5 px-4 py-1.5 mb-6 animate-fade-in">
             <span className="flex h-2 w-2 rounded-full bg-brand-accent animate-pulse"></span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">v2.0 Now Available</span>
          </div>
          <h1 className="mx-auto mb-6 max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl">
            Build faster with <span className="text-brand-accent">modern NLP.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-brand-text-muted md:text-xl">
            A complete intelligence toolkit for modern developers. Ship production-ready NLP models faster with unified endpoints and real-time inference.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="flex items-center gap-2 rounded-xl bg-brand-accent px-8 py-4 text-sm font-bold text-black transition-all hover:scale-105">
              Start Building Free <ArrowRight size={18} />
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-brand-border bg-brand-surface px-8 py-4 text-sm font-bold transition-all hover:bg-white/5">
              View Documentation
            </button>
          </div>
        </section>

        {/* CLI Install Block */}
        <div className="mx-auto mb-32 max-w-lg animate-slide-up">
          <div className="relative flex items-center justify-between overflow-hidden rounded-2xl border border-brand-border bg-brand-surface px-6 py-4 font-mono text-sm group">
            <div className="flex items-center gap-3">
              <span className="text-brand-accent">$</span>
              <span className="text-white">npm install <span className="text-brand-accent">@nlp-suite/core</span></span>
            </div>
            <button className="text-brand-text-muted hover:text-white transition-colors">
              <Terminal size={16} />
            </button>
          </div>
        </div>

        {/* Feature Bento Grid */}
        <section className="mb-32">
          <div className="mb-12 text-center">
             <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Everything you need to <span className="text-brand-accent">analyze faster.</span></h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
             {tools.map((tool, idx) => (
                <button
                  key={tool.id}
                  onClick={() => { setActiveTab(tool.id as Tool); setResult(null); setError(null); }}
                  className={`bento-card text-left flex flex-col justify-between group ${idx === 0 || idx === 3 ? 'md:col-span-1' : ''} ${activeTab === tool.id ? 'ring-2 ring-brand-accent/50 bg-white/[0.03]' : ''}`}
                >
                  <div>
                    <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${activeTab === tool.id ? 'bg-brand-accent text-black' : 'bg-white/5 text-brand-text-muted group-hover:bg-brand-accent/10 group-hover:text-brand-accent'}`}>
                      <tool.icon size={24} />
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{tool.label}</h3>
                    <p className="text-sm text-brand-text-muted leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-accent opacity-0 group-hover:opacity-100 transition-all">
                    Try Context <ChevronRight size={14} />
                  </div>
                </button>
             ))}
             {/* Integrations Card */}
             <div className="bento-card md:col-span-2 flex items-center justify-between">
                <div>
                   <h3 className="mb-4 text-2xl font-bold">Infinite Integrations</h3>
                   <p className="max-w-md text-brand-text-muted">
                      Deploy to AWS, Vercel, or HuggingFace with a single configuration. Our API handles the infrastructure.
                   </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5"><Globe size={24} className="text-syntax-blue" /></div>
                   <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5"><Zap size={24} className="text-brand-accent" /></div>
                </div>
             </div>
          </div>
        </section>

        {/* Workspace Area */}
        <section id="workspace" className="animate-slide-up scroll-mt-32">
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2">
             
             {/* Input Terminal */}
             <div className="rounded-3xl border border-brand-border bg-brand-surface overflow-hidden shadow-2xl flex flex-col h-[600px]">
                <div className="border-b border-brand-border bg-black/50 px-6 py-4 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5">
                        <Terminal size={12} className="text-brand-text-muted" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-text-muted">app.ts — {activeTab}</span>
                   </div>
                   <div className="flex items-center gap-1.5 font-mono text-[10px] text-brand-text-muted/40">
                      <span>TEXT_INPUT</span>
                      <ChevronRight size={10} />
                      <span className="text-brand-accent">NEURAL_VEC</span>
                   </div>
                </div>
                
                <div className="flex-1 relative">
                  {activeTab === 'qa' ? (
                    <div className="flex h-full flex-col divide-y divide-brand-border">
                      <textarea 
                        className="flex-1 w-full bg-transparent p-10 focus:outline-none placeholder-brand-text-muted/30 text-lg sm:text-xl resize-none"
                        placeholder="Paste the documentation or context here..."
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                      />
                      <div className="p-10 bg-black/20">
                        <input 
                          type="text"
                          className="w-full bg-transparent focus:outline-none placeholder-brand-text-muted/30 text-lg sm:text-xl font-medium"
                          placeholder="Ask a question about the context above..."
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <textarea 
                      className="h-full w-full bg-transparent p-10 focus:outline-none placeholder-brand-text-muted/30 text-xl sm:text-2xl resize-none"
                      placeholder={`Enter text for ${activeTab} analysis...`}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  )}
                  
                  {activeTab === 'zeroshot' && (
                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-brand-surface to-transparent">
                      <div className="flex flex-wrap gap-2">
                        {DEFAULT_LABELS.map(l => (
                          <button 
                            key={l}
                            onClick={() => toggleLabel(l)}
                            className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${labels.includes(l) ? 'bg-brand-accent text-black' : 'bg-white/5 text-brand-text-muted hover:bg-white/10'}`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 border-t border-brand-border bg-black/40">
                   <button 
                     onClick={handleProcess}
                     disabled={loading || (activeTab === 'qa' ? (!question || !context) : !text)}
                     className="w-full flex items-center justify-center gap-3 rounded-xl bg-white px-8 py-5 text-sm font-black text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 shadow-[0_10px_40px_rgba(255,255,255,0.1)]"
                   >
                     {loading ? <Loader2 size={20} className="animate-spin" /> : <><Sparkles size={18} /> Execute Intelligence</>}
                   </button>
                </div>
             </div>

             {/* Output Display */}
             <div className="rounded-3xl border border-brand-border bg-brand-surface overflow-hidden shadow-2xl flex flex-col h-[600px] group/output">
                <div className="border-b border-brand-border bg-black/50 px-6 py-4 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-accent/10">
                        <Brain size={12} className="text-brand-accent" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-text-muted">Inference Report</span>
                   </div>
                   <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-brand-border"></div>
                      <div className="h-2 w-2 rounded-full bg-brand-border"></div>
                      <div className="h-2 w-2 rounded-full bg-brand-border"></div>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 font-mono text-sm">
                   {loading ? (
                     <div className="flex h-full flex-col items-center justify-center space-y-6 animate-pulse">
                        <div className="h-16 w-16 rounded-full border-4 border-brand-accent/10 border-t-brand-accent animate-spin" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent">Mapping Neural Vectors</span>
                     </div>
                   ) : error ? (
                     <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                        <AlertCircle size={48} className="text-syntax-red opacity-50" />
                        <p className="max-w-xs text-brand-text-muted italic">Neural disruption: {error}</p>
                     </div>
                   ) : result ? (
                     <div className="animate-fade-in space-y-8">
                        {activeTab === 'summarization' && (
                          <div className="text-xl sm:text-2xl font-medium leading-relaxed text-white">
                             <span className="text-brand-accent">"</span>{result.summary}<span className="text-brand-accent">"</span>
                          </div>
                        )}

                        {activeTab === 'sentiment' && (
                          <div className="space-y-10 py-6">
                             <div className="text-center">
                                <span className={`text-6xl font-bold tracking-tighter uppercase ${result.label.toUpperCase() === 'POSITIVE' ? 'text-brand-accent' : 'text-syntax-red'}`}>
                                  {result.label}
                                </span>
                                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-brand-text-muted opacity-40">Classification Result</p>
                             </div>
                             <div className="space-y-6">
                                {result.all_scores?.map((s: any) => (
                                  <div key={s.label} className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">
                                      <span>{s.label}</span>
                                      <span>{(s.score * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-brand-border rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full transition-all duration-1000 ${s.label.toUpperCase() === result.label.toUpperCase() ? 'bg-brand-accent' : 'bg-white/10'}`}
                                        style={{ width: `${s.score * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}

                        {activeTab === 'zeroshot' && (
                          <div className="space-y-4">
                             {result.all_labels?.map((l: any) => (
                                <div key={l.label} className="flex items-center justify-between group p-3 rounded-lg hover:bg-white/[0.02] border border-transparent hover:border-brand-border transition-all">
                                   <span className="text-lg font-medium text-brand-text-muted group-hover:text-white capitalize">{l.label}</span>
                                   <div className="flex items-center gap-4">
                                      <span className="text-xs font-bold text-brand-accent">{(l.score * 100).toFixed(0)}%</span>
                                      <div className="w-24 h-1 bg-brand-border rounded-full overflow-hidden">
                                         <div className="h-full bg-brand-accent" style={{ width: `${l.score * 100}%` }} />
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                        )}

                        {activeTab === 'ner' && (
                          <div className="text-lg sm:text-xl leading-loose font-sans text-brand-text-muted">
                             {renderAnnotatedText()}
                          </div>
                        )}

                        {activeTab === 'qa' && (
                          <div className="text-center py-10 space-y-8">
                             {result.answerable ? (
                               <>
                                 <div className="inline-block px-12 py-6 rounded-2xl border border-brand-accent/20 bg-brand-accent/5">
                                   <p className="text-2xl sm:text-3xl font-bold text-white leading-tight underline decoration-brand-accent/30 decoration-thickness-2 underline-offset-8">
                                     {result.answer}
                                   </p>
                                 </div>
                                 <div className="flex flex-col items-center gap-1 opacity-40">
                                   <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent">Confidence Matrix</span>
                                   <span className="text-xs font-mono font-bold">{(result.confidence * 100).toFixed(2)}%</span>
                                 </div>
                               </>
                             ) : (
                               <div className="opacity-30">
                                  <HelpCircle size={64} className="mx-auto mb-4" />
                                  <p className="italic">No answer patterns detected in the context.</p>
                               </div>
                             )}
                          </div>
                        )}
                        
                        {/* JSON Source Toggle placeholder */}
                        <div className="pt-10 border-t border-brand-border mt-10 opacity-20 flex items-center gap-2 group-hover/output:opacity-100 transition-opacity">
                           <LayoutGrid size={14} />
                           <span className="text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:text-brand-accent">View Raw JSON Response</span>
                        </div>
                     </div>
                   ) : (
                     <div className="flex h-full flex-col items-center justify-center space-y-4 opacity-10">
                        <Command size={48} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Waiting for Instance</span>
                     </div>
                   )}
                </div>
             </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-brand-border bg-brand-surface py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Code2 size={24} className="text-brand-accent" />
                <span className="text-xl font-bold tracking-tight">NLP Suite</span>
              </div>
              <p className="max-w-xs text-sm text-brand-text-muted">
                The next generation of natural language processing tools for modern developers.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-20 sm:grid-cols-3">
               <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-brand-accent">Resources</h4>
                  <ul className="space-y-2 text-sm text-brand-text-muted">
                     <li><a href="#" className="hover:text-white">Documentation</a></li>
                     <li><a href="#" className="hover:text-white">API Reference</a></li>
                     <li><a href="#" className="hover:text-white">Frameworks</a></li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-brand-accent">Connect</h4>
                  <ul className="space-y-2 text-sm text-brand-text-muted">
                     <li><a href="https://github.com/AmiruMallawarachchi" className="hover:text-white">GitHub</a></li>
                     <li><a href="#" className="hover:text-white">Twitter</a></li>
                     <li><a href="#" className="hover:text-white">Discord</a></li>
                  </ul>
               </div>
            </div>
          </div>
          
          <div className="mt-20 border-t border-brand-border pt-10 flex flex-col items-center justify-between gap-6 md:flex-row">
             <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted opacity-30">
                © 2026 NLP SUITE INTELLIGENCE LAB. ALL RIGHTS RESERVED.
             </span>
             <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-brand-text-muted opacity-30">
                <a href="#" className="hover:text-brand-accent">Privacy Policy</a>
                <a href="#" className="hover:text-brand-accent">Terms of Service</a>
                <a href="#" className="hover:text-brand-accent">System Status</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
