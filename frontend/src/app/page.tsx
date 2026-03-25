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
  Loader2 
} from 'lucide-react';

type Tool = 'summarization' | 'sentiment' | 'zeroshot' | 'ner' | 'qa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tool>('summarization');
  const [text, setText] = useState('');
  const [labels, setLabels] = useState('');
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
        body = { text, labels: labels.split(',').map(l => l.trim()), multi_label: false };
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

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 space-y-16 animate-fade-in relative">
      
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#cc9966]/20 to-transparent"></div>

      <header className="text-center space-y-4">
        <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight leading-tight">How can I help you <span className="italic font-light">today</span>?</h2>
        <div className="flex justify-center items-center gap-3">
           <div className="h-[1px] w-8 bg-[#cc9966]/30"></div>
           <p className="text-[10px] font-black uppercase tracking-[6px] text-[#cc9966]/60">Ami-Lab Intelligence</p>
           <div className="h-[1px] w-8 bg-[#cc9966]/30"></div>
        </div>
      </header>

      {/* Modern Tab Selector */}
      <div className="flex flex-wrap items-center justify-center gap-3 py-2 px-2 bg-[#0a0a0a] border border-[#222] rounded-2xl max-w-2xl mx-auto shadow-2xl ring-1 ring-white/5">
        {tools.map((ToolItem) => (
          <button
            key={ToolItem.id}
            onClick={() => { setActiveTab(ToolItem.id as Tool); setResult(null); setError(null); }}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === ToolItem.id 
                ? 'bg-[#1a1a1a] text-[#cc9966] border border-[#cc9966]/20 shadow-lg ring-1 ring-[#cc9966]/10' 
                : 'text-[#444] hover:text-[#777] hover:bg-white/5'
            }`}
          >
            <ToolItem.icon size={14} className={activeTab === ToolItem.id ? 'opacity-100' : 'opacity-40'} />
            {ToolItem.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12 animate-slide-up">
        
        {/* Workspace Input Card */}
        <div className="relative group bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/5 p-1">
          {activeTab === 'qa' ? (
            <div className="grid grid-cols-1 gap-px bg-[#1a1a1a]">
              <textarea 
                className="w-full bg-[#0d0d0d] border-none p-10 min-h-[220px] focus:outline-none placeholder-[#222] text-lg leading-[1.7] text-white/90"
                placeholder="Paste the context paragraph here..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
              <input 
                type="text"
                className="w-full bg-[#0d0d0d] border-none p-10 focus:outline-none placeholder-[#222] text-lg text-white/90 border-t border-[#1a1a1a]"
                placeholder="Ask your question about the context above..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
          ) : (
            <div className="relative">
              <textarea 
                className="w-full bg-[#0d0d0d] border-none p-10 min-h-[400px] focus:outline-none placeholder-[#222] text-xl leading-[1.8] text-white/90"
                placeholder="Enter text to analyze..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="absolute top-4 left-6 flex items-center gap-2 opacity-10 pointer-events-none">
                <Terminal size={14} />
                <span className="text-[10px] font-black tracking-widest uppercase">Input Terminal</span>
              </div>
            </div>
          )}
          
          {activeTab === 'zeroshot' && (
            <div className="p-4 bg-[#0d0d0d] border-t border-[#1a1a1a]">
              <input 
                type="text"
                className="w-full bg-[#111] border border-[#222] rounded-xl p-4 focus:border-[#444] focus:outline-none text-sm placeholder-[#333]"
                placeholder="Classification Labels (e.g., Tech, Sports...)"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
              />
            </div>
          )}

          <div className="p-6 bg-[#0a0a0a] border-t border-[#1a1a1a] flex justify-between items-center">
             <div className="flex gap-4 opacity-20 hidden sm:flex">
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
             </div>
             
             <button 
                onClick={handleProcess}
                disabled={loading || (activeTab === 'qa' ? (!question || !context) : !text)}
                className="px-8 py-3.5 rounded-full bg-[#d1d1d1] text-black font-black text-xs uppercase tracking-[2px] hover:bg-white transition-all transform hover:scale-105 active:scale-95 disabled:opacity-20 disabled:grayscale flex items-center gap-3 shadow-xl"
              >
                {loading ? <Loader2 size={16} className="animate-spin text-black/50" /> : 'Process'}
                <ArrowRight size={14} className="opacity-40" />
              </button>
          </div>
        </div>

        {/* Results Card */}
        {(result || loading || error) && (
          <div className="animate-fade-in border-t border-[#1a1a1a] pt-16">
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#1a1a1a]"></div>
                <div className="flex items-center gap-3 text-accent/60">
                  <Brain size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[5px]">Inference Report</span>
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#1a1a1a]"></div>
              </div>

              <div className="space-y-8">
                {error && (
                  <div className="flex items-center gap-4 p-8 bg-red-500/5 border border-red-500/10 rounded-3xl text-red-500/80 text-sm italic font-serif">
                    <AlertCircle size={20} className="shrink-0" />
                    <span>Oops, something went wrong: {error}</span>
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                     <Loader2 size={48} className="animate-spin text-accent/20 mb-6" />
                     <p className="text-[10px] font-black uppercase tracking-[6px] text-accent/40">Analyzing neural patterns...</p>
                  </div>
                )}

                {result && !loading && (
                  <div className="animate-slide-up">
                    
                    {activeTab === 'summarization' && (
                      <div className="font-serif text-[2.4rem] md:text-[3.2rem] leading-[1.3] text-white/95 text-center px-12 italic max-w-3xl mx-auto selection:bg-[#cc9966]/40">
                         "{result.summary}"
                      </div>
                    )}

                    {activeTab === 'sentiment' && (
                      <div className="flex flex-col items-center py-12 space-y-10 group">
                        <div className={`text-[12rem] leading-none transition-all duration-1000 group-hover:scale-110 drop-shadow-[0_0_60px_rgba(204,153,102,0.1)] selection:bg-transparent`}>
                          {result.label === 'POSITIVE' ? '⚇' : result.label === 'NEGATIVE' ? '◘' : '○'}
                        </div>
                        <div className="text-center space-y-4">
                           <div className="text-5xl font-serif text-white tracking-widest uppercase">{result.label}</div>
                           <div className="h-px w-24 bg-[#cc9966]/30 mx-auto"></div>
                           <div className="text-[11px] font-black opacity-30 uppercase tracking-[6px] font-sans">{(result.confidence * 100).toFixed(1)}% Inference Confidence</div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'zeroshot' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto py-8">
                        {result.all_labels?.map((l: any, i: number) => (
                          <div key={i} className="flex flex-col gap-3 group p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex justify-between items-end">
                              <span className="capitalize font-serif text-2xl text-white group-hover:text-accent transition-colors">{l.label}</span>
                              <span className="text-[11px] font-black opacity-20 tracking-widest">{(l.score * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-[2px] w-full bg-white/5 overflow-hidden rounded-full">
                              <div className="h-full bg-accent transition-all duration-1500 ease-out shadow-[0_0_10px_rgba(204,153,102,0.5)]" style={{ width: `${l.score * 100}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'ner' && (
                      <div className="font-serif text-[2rem] md:text-[2.2rem] leading-[1.7] text-white/60 p-12 bg-white/5 border border-white/5 rounded-[2rem] italic shadow-2xl" dangerouslySetInnerHTML={{
                        __html: result.annotated_text.replace(/\[(.*?)\/(.*?)\]/g, '<span class="px-2 py-0.5 mx-1 border-b-[2px] border-accent/60 text-white italic bg-accent/5 rounded-t-lg">$1<sup class="text-[9px] uppercase font-sans not-italic text-accent ml-2 font-black tracking-widest">$2</sup></span>')
                      }} />
                    )}

                    {activeTab === 'qa' && (
                      <div className="text-center space-y-12 py-16">
                        {result.answerable ? (
                          <div className="space-y-10 group">
                            <div className="text-8xl opacity-10 group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000 text-accent">✥</div>
                            <h4 className="text-[3rem] md:text-[4.5rem] font-serif text-white/95 leading-[1.2] italic tracking-tight underline decoration-[#cc9966]/20 underline-offset-8">
                              "{result.answer}"
                            </h4>
                            <div className="flex justify-center flex-col items-center gap-4 pt-10">
                               <div className="h-px w-20 bg-[#cc9966]/30"></div>
                               <div className="text-[10px] font-black opacity-20 tracking-[8px] uppercase font-sans">Answer Extraction Logic Verified ({(result.confidence * 100).toFixed(0)}%)</div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-6 opacity-20 py-10 scale-95">
                             <HelpCircle size={64} className="animate-pulse" />
                             <p className="text-2xl font-serif italic">I couldn't find a definitive answer in the context provided.</p>
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

       <footer className="pt-32 pb-16 text-center space-y-8 max-w-xl mx-auto">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent"></div>
        <div className="flex justify-center gap-10 text-[10px] font-black uppercase tracking-[5px]">
           <a href="https://huggingface.co/Ami-Lab" target="_blank" className="opacity-30 hover:opacity-100 hover:text-accent transition-all">HF Intelligence</a>
           <a href="https://github.com/AmiruMallawarachchi" target="_blank" className="opacity-30 hover:opacity-100 hover:text-white transition-all">Dev Repo</a>
        </div>
        <div className="text-[9px] opacity-10 uppercase tracking-[4px] font-black italic">Advanced Architecture Laboratory © 2026</div>
      </footer>
    </div>
  );
}
