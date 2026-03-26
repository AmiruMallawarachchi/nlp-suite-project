"use client";

import { useState } from 'react';
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
  Plus,
  Compass,
  Zap,
  ShieldCheck,
  Brain
} from 'lucide-react';

type Tool = 'summarization' | 'sentiment' | 'zeroshot' | 'ner' | 'qa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const DEFAULT_LABELS = ["Technology", "Space", "Politics", "Sports", "Nature", "Health", "Finance", "AI"];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tool>('summarization');
  const [text, setText] = useState('');
  const [labels, setLabels] = useState<string[]>(["Technology", "Space", "Politics"]);
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const tools = [
    { id: 'summarization', label: 'Summarize', icon: FileText },
    { id: 'sentiment', label: 'Sentiment', icon: Sparkles },
    { id: 'zeroshot', label: 'Zero-Shot', icon: Target },
    { id: 'ner', label: 'Entity Parsing', icon: UserSearch },
    { id: 'qa', label: 'Q&A', icon: HelpCircle },
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
    setResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-6 space-y-16 animate-fade-in relative min-h-screen">
      
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#cc9966]/20 to-transparent"></div>

      <header className="text-center space-y-4">
        <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-tight">How can I help you <span className="italic font-light">today</span>?</h2>
        <div className="flex justify-center items-center gap-4">
           <div className="h-[1px] w-12 bg-[#cc9966]/30"></div>
           <p className="text-[11px] font-black uppercase tracking-[8px] text-[#cc9966]/60">Ami-Lab Intelligence Lab</p>
           <div className="h-[1px] w-12 bg-[#cc9966]/30"></div>
        </div>
      </header>

      {/* Modern Tab Selector */}
      <div className="flex flex-wrap items-center justify-center gap-3 py-2.5 px-2.5 bg-[#0a0a0a] border border-[#222] rounded-3xl max-w-2xl mx-auto shadow-2xl ring-1 ring-white/5">
        {tools.map((ToolItem) => (
          <button
            key={ToolItem.id}
            onClick={() => { setActiveTab(ToolItem.id as Tool); setResult(null); setError(null); }}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === ToolItem.id 
                ? 'bg-[#1a1a1a] text-[#cc9966] border border-[#cc9966]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] ring-1 ring-[#cc9966]/10' 
                : 'text-[#444] hover:text-[#888] hover:bg-white/5'
            }`}
          >
            <ToolItem.icon size={15} className={activeTab === ToolItem.id ? 'opacity-100' : 'opacity-30'} />
            {ToolItem.label}
          </button>
        ))}
      </div>

      <div className={`grid grid-cols-1 gap-12 animate-slide-up items-start transition-all duration-500 max-w-7xl mx-auto w-full ${
        (result || loading || error) ? 'lg:grid-cols-2' : 'lg:max-w-4xl'
      }`}>
        
        {/* Workspace Input Card */}
        <div className="relative group bg-[#0a0a0a] border border-[#1a1a1a] rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-white/5 p-1 transition-all hover:ring-white/10 w-full">
          {activeTab === 'qa' ? (
            <div className="grid grid-cols-1 gap-px bg-[#1a1a1a]">
              <textarea 
                className="w-full bg-[#0d0d0d] border-none p-12 min-h-[220px] focus:outline-none placeholder-[#222] text-xl leading-[1.7] text-white/90"
                placeholder="Paste the context paragraph here..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
              <input 
                type="text"
                className="w-full bg-[#0d0d0d] border-none p-12 focus:outline-none placeholder-[#222] text-xl text-white/90 border-t border-[#1a1a1a]"
                placeholder="Ask your question about the context above..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
          ) : (
            <div className="relative">
              <textarea 
                className="w-full bg-[#0d0d0d] border-none p-12 min-h-[420px] focus:outline-none placeholder-[#222] text-2xl leading-[1.8] text-white/95"
                placeholder="Enter text here to begin neural analysis..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="absolute top-6 left-8 flex items-center gap-3 opacity-20 pointer-events-none">
                <Terminal size={16} />
                <span className="text-[11px] font-black tracking-widest uppercase">Input Terminal v1.0</span>
              </div>
            </div>
          )}
          
          {activeTab === 'zeroshot' && (
            <div className="p-10 bg-[#0d0d0d] border-t border-[#1a1a1a] space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                   <h4 className="text-[11px] font-black uppercase tracking-[5px] text-accent/80">Classifier Matrix Config</h4>
                 </div>
                 <p className="text-[10px] opacity-20 italic font-medium tracking-wide">Multi-label support enabled</p>
              </div>
              <div className="flex flex-wrap gap-3">
                 {DEFAULT_LABELS.map((label) => (
                    <button
                      key={label}
                      onClick={() => toggleLabel(label)}
                      className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                        labels.includes(label) 
                          ? 'bg-accent/20 text-accent border border-accent/40 shadow-[0_0_25px_rgba(204,153,102,0.15)] ring-1 ring-accent/20' 
                          : 'bg-white/5 text-[#555] border border-[#222] hover:border-[#444] hover:text-[#888]'
                      }`}
                    >
                      {label}
                    </button>
                 ))}
                 <button className="px-5 py-2.5 rounded-2xl bg-white/5 border border-dashed border-[#333] text-[#333] hover:text-[#555] cursor-not-allowed flex items-center gap-2">
                    <Plus size={12} /> Custom
                 </button>
              </div>
            </div>
          )}

          <div className="p-8 bg-[#0a0a0a] border-t border-[#1a1a1a] flex justify-between items-center px-12">
             <div className="flex gap-4 opacity-20">
                <Zap size={18} className="text-accent" />
                <Compass size={18} />
                <ShieldCheck size={18} />
             </div>
             
             <button 
                onClick={handleProcess}
                disabled={loading || (activeTab === 'qa' ? (!question || !context) : !text) || (activeTab === 'zeroshot' && labels.length < 2)}
                className="px-12 py-4 rounded-full bg-[#efefef] text-[#000] font-black text-[13px] uppercase tracking-[3px] hover:bg-white transition-all transform hover:scale-105 active:scale-95 disabled:opacity-20 disabled:grayscale flex items-center gap-4 shadow-[0_10px_40px_rgba(255,255,255,0.05)]"
              >
                {loading ? <Loader2 size={18} className="animate-spin opacity-50" /> : 'Run Intelligence'}
                <ArrowRight size={16} className="opacity-40" />
              </button>
          </div>
        </div>

        {/* Results Card */}
        {(result || loading || error) && (
          <div className="animate-fade-in lg:sticky lg:top-8 w-full">
            <div className="space-y-12 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[2.5rem] p-10 shadow-2xl ring-1 ring-white/5 min-h-[500px] flex flex-col justify-center relative">
              <div className="absolute top-10 w-full left-0 flex justify-center">
                 <div className="bg-[#0a0a0a] px-8 flex items-center gap-4 text-accent/60">
                    <Brain size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[8px]">Inference Report</span>
                 </div>
              </div>

              <div className="space-y-10">
                {error && (
                  <div className="flex items-center gap-6 p-10 bg-red-400/5 border border-red-400/10 rounded-[2rem] text-red-400 text-lg italic font-serif shadow-2xl">
                    <AlertCircle size={28} className="shrink-0 opacity-50" />
                    <span>Neural system encountered a disruption: {error}</span>
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center justify-center py-24 animate-pulse">
                     <Loader2 size={64} className="animate-spin text-accent/10 mb-8" />
                     <p className="text-[12px] font-black uppercase tracking-[10px] text-accent/30 ml-2">Mapping neural vectors...</p>
                  </div>
                )}

                {result && !loading && (
                  <div className="animate-slide-up">
                    
                    {activeTab === 'summarization' && (
                      <div className="font-serif text-[2.8rem] md:text-[4rem] leading-[1.25] text-white/95 text-center px-16 italic max-w-4xl mx-auto selection:bg-[#cc9966]/40 underline decoration-[#cc9966]/10 underline-offset-[20px] decoration-double">
                         "{result.summary}"
                      </div>
                    )}

                    {activeTab === 'sentiment' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-20 py-12 max-w-4xl mx-auto border border-white/5 p-12 rounded-[3rem] bg-white/[0.02] shadow-2xl group">
                         {/* Large Icon Column */}
                         <div className="flex flex-col items-center justify-center space-y-8 border-r border-[#222] pr-10">
                            <div className={`text-[15rem] leading-none transition-all duration-1000 group-hover:scale-110 drop-shadow-[0_0_80px_rgba(204,153,102,0.15)] selection:bg-transparent`}>
                              {(result.label?.toUpperCase() === 'POSITIVE') ? '⚇' : (result.label?.toUpperCase() === 'NEGATIVE') ? '◘' : '○'}
                            </div>
                            <div className="text-center">
                               <h3 className="text-5xl font-serif text-white tracking-widest uppercase mb-2 group-hover:text-accent transition-colors">{result.label}</h3>
                               <div className="h-[2px] w-20 bg-accent/40 mx-auto"></div>
                            </div>
                         </div>
                         
                         {/* Breakdown Column */}
                         <div className="space-y-8">
                            <div className="flex items-center gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_#cc9966]"></div>
                               <span className="text-[12px] font-black uppercase tracking-[6px] opacity-40">Score Breakdown</span>
                            </div>
                            
                            <div className="space-y-6">
                               {result.all_scores?.map((s: any, i:number) => (
                                 <div key={i} className={`space-y-2 group/score transition-opacity ${s.label.toUpperCase() === result.label.toUpperCase() ? 'opacity-100' : 'opacity-30'}`}>
                                   <div className="flex justify-between text-[11px] font-black uppercase tracking-widest italic">
                                      <span>{s.label}</span>
                                      <span>{(s.score * 100).toFixed(1)}%</span>
                                   </div>
                                   <div className="h-[3px] w-full bg-[#111] overflow-hidden rounded-full">
                                      <div 
                                        className={`h-full transition-all duration-1500 ease-out ${s.label.toUpperCase() === result.label.toUpperCase() ? 'bg-accent' : 'bg-white/40'}`} 
                                        style={{ width: `${s.score * 100}%` }}
                                      ></div>
                                   </div>
                                 </div>
                               ))}
                            </div>
                            
                            <div className="pt-4 flex items-center gap-4">
                               <div className="p-3 rounded-2xl bg-accent/5 border border-accent/10">
                                  <div className="text-[10px] font-black uppercase text-accent tracking-[3px]">Confidence Index</div>
                                  <div className="text-2xl font-serif text-white italic">{(result.confidence * 100).toFixed(1)}%</div>
                               </div>
                               <p className="text-[10px] italic opacity-20 max-w-[120px] leading-[1.6]">Verified against the RoBERTa Twitter-Sentiment architecture.</p>
                            </div>
                         </div>
                      </div>
                    )}

                    {activeTab === 'zeroshot' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto py-12">
                        {result.all_labels?.map((l: any, i: number) => (
                          <div key={i} className="flex flex-col gap-4 group p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-accent/30 hover:bg-white/[0.05] transition-all duration-500 shadow-xl overflow-hidden relative">
                            {/* Animated background hint */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex justify-between items-end relative z-10">
                              <span className="capitalize font-serif text-[2.2rem] text-white/90 group-hover:text-accent transition-colors italic">{l.label}</span>
                              <div className="text-right">
                                <span className="text-[12px] font-black text-accent tracking-[4px]">{(l.score * 100).toFixed(0)}%</span>
                                <p className="text-[9px] font-black uppercase opacity-20 tracking-widest mt-1">Relevance</p>
                              </div>
                            </div>
                            <div className="h-[2px] w-full bg-white/5 overflow-hidden rounded-full relative z-10">
                              <div className="h-full bg-accent transition-all duration-2000 ease-out shadow-[0_0_15px_rgba(204,153,102,0.6)]" style={{ width: `${l.score * 100}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'ner' && (
                      <div className="font-serif text-[2.2rem] md:text-[2.6rem] leading-[1.8] text-white/50 p-16 bg-white/[0.03] border border-white/5 rounded-[3.5rem] italic shadow-2xl relative overflow-hidden ring-1 ring-white/10" dangerouslySetInnerHTML={{
                        __html: result.annotated_text.replace(/\[(.*?)\/(.*?)\]/g, '<span class="px-3 py-1 mx-2 border-b-[3px] border-accent/70 text-white italic bg-accent/5 rounded-t-xl transition-all hover:bg-accent/10 cursor-help shadow-lg">$1<sup class="text-[11px] uppercase font-sans not-italic text-accent ml-3 font-black tracking-[4px] opacity-80 shadow-accent/20 shadow-sm">$2</sup></span>')
                      }} />
                    )}

                    {activeTab === 'qa' && (
                      <div className="text-center space-y-16 py-20 max-w-4xl mx-auto">
                        {result.answerable ? (
                          <div className="space-y-12 group">
                            <div className="flex justify-center flex-col items-center gap-6">
                               <div className="text-9xl opacity-10 group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000 text-accent font-serif tracking-tighter">✥</div>
                               <div className="h-px w-32 bg-accent/20"></div>
                            </div>
                            <h4 className="text-[4rem] md:text-[5.5rem] font-serif text-white leading-[1.15] italic tracking-tight underline decoration-[#cc9966]/20 underline-offset-[16px] decoration-double drop-shadow-2xl">
                              "{result.answer}"
                            </h4>
                            <div className="flex justify-center flex-col items-center gap-6 pt-12">
                               <div className="px-6 py-2 rounded-full border border-accent/20 bg-accent/5 text-[11px] font-black text-accent uppercase tracking-[6px]">
                                 Neural Extraction Match {(result.confidence * 100).toFixed(0)}%
                               </div>
                               <p className="text-[12px] italic opacity-20 font-serif max-w-md">The system has identified this specific segment as the most mathematically probable response based on RoBERTa-SQuAD-v2 weight distribution.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-10 opacity-30 py-16 scale-95 border border-white/5 rounded-full p-20 animate-pulse">
                             <HelpCircle size={80} className="text-[#444]" />
                             <p className="text-4xl font-serif italic tracking-wide">Insufficient structural patterns found to extract an answer.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

       <footer className="pt-40 pb-20 text-center space-y-12 max-w-2xl mx-auto">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#222] to-transparent"></div>
        <div className="flex justify-center gap-14 text-[11px] font-black uppercase tracking-[6px]">
           <a href="https://huggingface.co/Ami-Lab" target="_blank" className="opacity-30 hover:opacity-100 hover:text-accent transition-all cursor-alias">HF Intelligence Matrix</a>
           <a href="https://github.com/AmiruMallawarachchi" target="_blank" className="opacity-30 hover:opacity-100 hover:text-white transition-all cursor-alias">Development Core</a>
        </div>
        <div className="space-y-3">
           <div className="text-[10px] opacity-10 uppercase tracking-[5px] font-black italic">Advanced Cognitive Architecture v1.2</div>
           <div className="text-[9px] opacity-10 font-medium tracking-[2px]">Powered by HuggingFace Transformers & Next.js Engine</div>
        </div>
      </footer>
    </div>
  );
}
