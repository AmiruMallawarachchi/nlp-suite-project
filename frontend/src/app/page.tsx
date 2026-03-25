"use client";

import { useState } from 'react';

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
    { id: 'summarization', label: 'Summarizer', icon: '📄' },
    { id: 'sentiment', label: 'Sentiment', icon: '✨' },
    { id: 'zeroshot', label: 'Zero-Shot', icon: '🎯' },
    { id: 'ner', label: 'Entity Parsing', icon: '🏷️' },
    { id: 'qa', label: 'Q&A', icon: '❓' },
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
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 animate-fade-in">
      <header className="text-center space-y-3">
        <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">How can I help you today?</h2>
        <p className="opacity-40 text-sm font-medium tracking-wide">Multi-Task NLP Suite Powered by Ami-Lab</p>
      </header>

      {/* Tool Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#141414] border border-[#2d2d2d] rounded-2xl max-w-2xl mx-auto shadow-2xl">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => { setActiveTab(tool.id as Tool); setResult(null); setError(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === tool.id 
                ? 'bg-[#1a1a1a] text-white border border-[#3d3d3d] shadow-sm' 
                : 'text-[#666] hover:text-[#999] hover:bg-white/5'
            }`}
          >
            <span>{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 animate-slide-up">
        
        {/* Input Region */}
        <section className="space-y-6">
          <div className="relative group">
            {activeTab === 'qa' ? (
              <div className="space-y-4">
                <textarea 
                  className="w-full bg-[#111] border border-[#2d2d2d] rounded-2xl p-6 min-h-[180px] focus:border-[#444] focus:outline-none transition-all placeholder-[#333] text-[16px] leading-[1.6]"
                  placeholder="Context Paragraph..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
                <input 
                  type="text"
                  className="w-full bg-[#111] border border-[#2d2d2d] rounded-2xl p-6 focus:border-[#444] focus:outline-none transition-all placeholder-[#333] text-[16px]"
                  placeholder="What is your question?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
            ) : (
              <div className="relative">
                <textarea 
                  className="w-full bg-[#111] border border-[#2d2d2d] rounded-2xl p-8 min-h-[320px] focus:border-[#444] focus:outline-none transition-all placeholder-[#333] text-lg leading-[1.7] shadow-xl"
                  placeholder="Start typing or paste your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-3 opacity-30 text-[10px] font-bold uppercase tracking-widest pointer-events-none">
                  AI READY
                </div>
              </div>
            )}
          </div>

          {activeTab === 'zeroshot' && (
            <input 
              type="text"
              className="w-full bg-[#111] border border-[#2d2d2d] rounded-2xl p-6 focus:border-[#444] focus:outline-none transition-all placeholder-[#333] text-[16px]"
              placeholder="Categories (e.g., Technology, Sports, Space...)"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
            />
          )}

          <div className="flex justify-end pt-2">
            <button 
              onClick={handleProcess}
              disabled={loading || (activeTab === 'qa' ? (!question || !context) : !text)}
              className="px-10 py-4 rounded-full bg-[#d1d1d1] text-black font-bold text-[15px] hover:bg-white transition-all transform hover:scale-105 active:scale-95 disabled:opacity-20 disabled:grayscale disabled:scale-100 shadow-2xl flex items-center gap-3 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
              ) : 'Run Analysis'}
              <span className="opacity-40 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          </div>
        </section>

        {/* Results Region */}
        {(result || loading || error) && (
          <section className="pt-12 animate-fade-in border-t border-[#1a1a1a]">
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 rounded-full bg-[#cc9966]/20 border border-[#cc9966]/30 flex items-center justify-center text-[10px] text-accent font-bold">A</div>
                <span className="text-xs font-bold uppercase tracking-[3px] opacity-40">Intelligence Output</span>
              </div>

              <div className="space-y-6">
                {error && (
                  <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 text-sm">
                    ⚠️ {error}
                  </div>
                )}

                {loading && (
                  <div className="space-y-4 py-8">
                    <div className="h-4 bg-[#1a1a1a] rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-[#1a1a1a] rounded w-1/2 animate-pulse animation-delay-500"></div>
                  </div>
                )}

                {result && !loading && (
                  <div className="animate-slide-up">
                    {/* Summarization View */}
                    {activeTab === 'summarization' && (
                      <div className="font-serif text-[2.2rem] leading-[1.4] text-white opacity-90 indent-8 selection:bg-accent/40">
                         "{result.summary}"
                      </div>
                    )}

                    {/* Sentiment View */}
                    {activeTab === 'sentiment' && (
                      <div className="flex flex-col items-center py-12 space-y-8">
                        <div className={`text-[12rem] leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.05)] selection:bg-transparent`}>
                          {result.label === 'POSITIVE' ? '⚇' : result.label === 'NEGATIVE' ? '◘' : '○'}
                        </div>
                        <div className="text-center space-y-2">
                           <div className="text-4xl font-serif text-white tracking-widest uppercase">{result.label}</div>
                           <div className="text-xs font-bold opacity-30 uppercase tracking-[5px]">{(result.confidence * 100).toFixed(1)}% Certainty</div>
                        </div>
                      </div>
                    )}

                    {/* ZeroShot View */}
                    {activeTab === 'zeroshot' && (
                      <div className="space-y-4 max-w-xl mx-auto">
                        {result.all_labels?.map((l: any, i: number) => (
                          <div key={i} className="flex flex-col gap-2 group">
                            <div className="flex justify-between items-end">
                              <span className="capitalize font-serif text-2xl text-white opacity-80 group-hover:opacity-100 transition-opacity">{l.label}</span>
                              <span className="text-[10px] font-bold opacity-30 tracking-widest">{(l.score * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-[2px] w-full bg-[#1a1a1a] overflow-hidden">
                              <div className="h-full bg-accent transition-all duration-1000 ease-out" style={{ width: `${l.score * 100}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* NER View */}
                    {activeTab === 'ner' && (
                      <div className="font-serif text-[1.8rem] leading-[1.6] text-[#b1b1b1] space-y-8" dangerouslySetInnerHTML={{
                        __html: result.annotated_text.replace(/\[(.*?)\/(.*?)\]/g, '<span class="px-2 py-0 border-b border-accent/40 text-white italic">$1<sup class="text-[10px] uppercase font-sans not-italic text-accent ml-1 opacity-70">$2</sup></span>')
                      }} />
                    )}

                    {/* QA View */}
                    {activeTab === 'qa' && (
                      <div className="text-center space-y-8 py-12">
                        {result.answerable ? (
                          <div className="space-y-6">
                            <div className="text-7xl opacity-10">✥</div>
                            <h4 className="text-[3rem] font-serif text-white leading-tight italic">
                              "{result.answer}"
                            </h4>
                            <div className="text-[10px] font-bold opacity-30 tracking-widest uppercase">Validated with {(result.confidence * 100).toFixed(1)}% confidence</div>
                          </div>
                        ) : (
                          <div className="opacity-20 text-xl font-serif">Insufficient information provided.</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

       <footer className="pt-24 pb-12 text-center space-y-4">
        <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-[4px]">
           <a href="https://huggingface.co/Ami-Lab" target="_blank" className="opacity-30 hover:opacity-100 transition-opacity">Hugging Face</a>
           <a href="https://github.com/AmiruMallawarachchi" target="_blank" className="opacity-30 hover:opacity-100 transition-opacity">Developer</a>
        </div>
        <div className="text-[10px] opacity-10 uppercase tracking-[2px]">Ami-Lab | NLP Architecture Suite 1.0</div>
      </footer>
    </div>
  );
}
