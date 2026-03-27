"use client";

import { useState } from 'react';
import { 
  FileCode, 
  Terminal, 
  Brain, 
  Command, 
  ChevronRight, 
  Github, 
  ExternalLink, 
  Search, 
  Workflow, 
  Activity, 
  Cpu,
  Layers,
  ArrowUpRight,
  Code2,
  Sparkles,
  Target,
  UserSearch,
  MessageSquare,
  HelpCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

type Tool = 'summarization' | 'sentiment' | 'zeroshot' | 'ner' | 'qa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const ENTITY_INFO: Record<string, { title: string; color: string }> = {
  PER: { title: "Person", color: "text-[#61afef]" }, // Blue
  ORG: { title: "Organization", color: "text-[#c678dd]" }, // Purple
  LOC: { title: "Location", color: "text-[#d19a66]" }, // Orange
  MISC: { title: "Misc", color: "text-[#e06c75]" }, // Red
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tool>('summarization');
  const [text, setText] = useState('');
  const [labels, setLabels] = useState<string[]>(["Technology", "Finance", "AI"]);
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const tools = [
    { id: 'summarization', label: 'summarizer.ts', icon: FileCode, color: 'text-[#98c379]' },
    { id: 'sentiment', label: 'sentiment.ts', icon: Activity, color: 'text-[#e06c75]' },
    { id: 'zeroshot', label: 'classifier.ts', icon: Target, color: 'text-[#61afef]' },
    { id: 'ner', label: 'ner_parser.ts', icon: UserSearch, color: 'text-[#c678dd]' },
    { id: 'qa', label: 'q_and_a.ts', icon: HelpCircle, color: 'text-[#d19a66]' },
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
        body = { text, labels, multi_label: false };
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

      if (!res.ok) throw new Error(`Inference Failed: ${res.statusText}`);
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Fatal Exception');
    } finally {
      setLoading(false);
    }
  };

  const renderAnnotatedText = () => {
    if (!result || !result.annotated_text) return null;
    const parts = result.annotated_text.split(/(\[.*?\/.*?\])/g);
    
    return parts.map((part: string, i: number) => {
      const match = part.match(/\[(.*?)\/(.*?)\]/);
      if (match) {
        const [_, entityText, label] = match;
        const info = ENTITY_INFO[label] || { title: label, color: "text-[#98c379]" };
        return (
          <span key={i} className={`inline-block mx-0.5 rounded px-1 transition-all ${info.color} bg-white/5 border-b border-white/10 font-bold`}>
            {entityText}
            <span className="ml-1 text-[8px] opacity-40 uppercase tracking-tighter">{label}</span>
          </span>
        );
      }
      return <span key={i} className="text-[#a1a1aa]">{part}</span>;
    });
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-[#a1a1aa] font-mono overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 flex-shrink-0 border-r border-[#1a1a1a] bg-[#0a0a0a] flex flex-col">
        {/* Branding */}
        <div className="h-14 flex items-center px-6 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#4ade80] flex items-center justify-center">
              <Code2 size={12} className="text-black" />
            </div>
            <span className="text-xs font-black tracking-[0.2em] text-white">NLP_SUITE</span>
          </div>
        </div>

        {/* Explorer */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 flex items-center justify-between text-[10px] font-bold tracking-[0.2em] opacity-30">
            <span>EXPLORER</span>
            <Search size={10} />
          </div>
          <nav className="px-2 space-y-0.5">
            <div className="flex items-center gap-2 px-3 py-1 space-x-1 opacity-50 text-[11px] mb-2 cursor-pointer">
              <ChevronRight size={12} />
              <Layers size={14} />
              <span>core / models</span>
            </div>
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => { setActiveTab(tool.id as Tool); setResult(null); setError(null); }}
                className={`w-full flex items-center gap-2 px-6 py-2 text-[12px] group transition-all hover:bg-white/[0.03] ${activeTab === tool.id ? 'bg-white/[0.05] text-white border-l-2 border-[#4ade80]' : 'border-l-2 border-transparent'}`}
              >
                <tool.icon size={14} className={activeTab === tool.id ? tool.color : 'text-gray-600'} />
                <span>{tool.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 p-4 flex items-center justify-between text-[10px] font-bold tracking-[0.2em] opacity-30">
            <span>SCRIPTS</span>
            <Activity size={10} />
          </div>
          <div className="px-5 space-y-3 opacity-40 text-[11px]">
             <div className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">
                <Workflow size={12} />
                <span>deploy_pipeline.sh</span>
             </div>
             <div className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">
                <Cpu size={12} />
                <span>monitor_weights.py</span>
             </div>
          </div>
        </div>

        {/* User / Settings Footer */}
        <div className="p-4 border-t border-[#1a1a1a] space-y-4">
           <div className="flex items-center gap-4 opacity-50 px-2 justify-between">
              <a href="https://github.com/AmiruMallawarachchi" target="_blank" className="hover:text-white"><Github size={14} /></a>
              <a href="#" className="hover:text-white"><ExternalLink size={14} /></a>
              <a href="#" className="hover:text-white"><Command size={14} /></a>
           </div>
           <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                 <img src="https://github.com/AmiruMallawarachchi.png" alt="Profile" className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-white leading-none">Ami-Lab</span>
                 <span className="text-[8px] opacity-40 uppercase tracking-widest mt-1">Free Tier</span>
              </div>
           </div>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
        
        {/* Tabbar */}
        <div className="h-10 border-b border-[#1a1a1a] flex items-center px-1 bg-[#0a0a0a]">
          <div className="flex items-center h-full px-4 border-r border-[#1a1a1a] bg-[#111111] text-white text-[11px] gap-2 border-t border-t-[#4ade80]">
            <FileCode size={12} className="text-[#98c379]" />
            <span>{activeTab}.ts</span>
            <span className="ml-4 opacity-20 hover:opacity-100 cursor-pointer">×</span>
          </div>
          <div className="flex items-center h-full px-4 border-r border-[#1a1a1a] opacity-30 text-[11px] gap-2 hover:opacity-80 transition-all cursor-pointer">
            <Terminal size={12} />
            <span>Terminal</span>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4 px-4 h-full border-l border-[#1a1a1a]">
             <div className="flex items-center gap-2 text-[10px] font-bold text-[#4ade80]">
                <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></div>
                <span>CONNECTED</span>
             </div>
             <button className="text-[10px] font-bold hover:text-white opacity-40 uppercase tracking-widest">v1.2.4</button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT: Code Input Section */}
          <div className="flex-1 flex flex-col min-w-0 border-r border-[#1a1a1a]">
             <div className="h-8 border-b border-[#1a1a1a] flex items-center px-4 bg-[#0d0d0d]">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Module // Input Segment</span>
             </div>
             
             {/* Textarea + Line numbers area */}
             <div className="flex-1 flex relative">
                {/* Line Numbers */}
                <div className="w-12 border-r border-[#1a1a1a] bg-[#0a0a0a] flex flex-col items-center pt-8 text-[11px] font-bold opacity-10 select-none">
                   {[...Array(20)].map((_, i) => (
                     <div key={i} className="h-7 leading-7">{i + 1}</div>
                   ))}
                </div>
                
                {/* Input Area */}
                <div className="flex-1 flex flex-col">
                   <div className="flex-1 relative">
                      {activeTab === 'qa' ? (
                        <div className="h-full flex flex-col divide-y divide-[#1a1a1a]">
                            <div className="p-8">
                               <div className="text-[10px] text-[#c678dd] mb-3 font-bold uppercase tracking-wider">const context = `</div>
                               <textarea 
                                  className="w-full bg-transparent resize-none focus:outline-none text-[14px] text-white leading-relaxed placeholder:opacity-10 h-64"
                                  placeholder="Paste documentation or long-form context here..."
                                  value={context}
                                  onChange={(e) => setContext(e.target.value)}
                               />
                               <div className="text-[10px] text-[#c678dd] mt-1 font-bold">`;</div>
                            </div>
                            <div className="p-8 flex-1">
                               <div className="text-[10px] text-[#61afef] mb-3 font-bold uppercase tracking-wider">const query = (</div>
                               <input 
                                  className="w-full bg-transparent focus:outline-none text-[14px] text-white leading-relaxed placeholder:opacity-10"
                                  placeholder="Ask any question about the data above..."
                                  value={question}
                                  onChange={(e) => setQuestion(e.target.value)}
                                />
                                <div className="text-[10px] text-[#61afef] mt-1 font-bold">);</div>
                            </div>
                        </div>
                      ) : (
                        <div className="p-8 h-full flex flex-col">
                           <div className="text-[10px] text-[#98c379] mb-3 font-bold uppercase tracking-wider">const inputData = `</div>
                           <textarea 
                              className="flex-1 w-full bg-transparent resize-none focus:outline-none text-[14px] text-white leading-relaxed placeholder:opacity-10 font-mono"
                              placeholder={`// Paste text for ${activeTab} analysis...`}
                              value={text}
                              onChange={(e) => setText(e.target.value)}
                           />
                           <div className="text-[10px] text-[#98c379] mt-1 font-bold">`;</div>
                        </div>
                      )}
                   </div>
                   
                   {/* Bottom Action Bar */}
                   <div className="p-8 border-t border-[#1a1a1a] bg-[#0d0d0d] flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black tracking-widest opacity-30 uppercase mb-1">Status</span>
                            <span className="text-[11px] text-[#4ade80] font-bold">AWAITING_TRIGGER</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black tracking-widest opacity-30 uppercase mb-1">Model</span>
                            <span className="text-[11px] text-white/50 font-bold uppercase tracking-tighter">HuggingFace_v4.2</span>
                         </div>
                      </div>
                      
                      <button 
                         onClick={handleProcess}
                         disabled={loading || (activeTab === 'qa' ? (!question || !context) : !text)}
                         className="px-8 py-3 bg-[#4ade80] text-black text-[11px] font-black uppercase tracking-widest rounded transition-all hover:scale-105 active:scale-95 disabled:grayscale disabled:opacity-30 flex items-center gap-3 shadow-[0_0_20px_rgba(74,222,128,0.2)]"
                      >
                         {loading ? <Loader2 size={14} className="animate-spin" /> : <><Sparkles size={14} /> Execute Trace</>}
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* RIGHT: Reports / Inference Output */}
          <div className="w-[450px] flex-shrink-0 flex flex-col bg-[#080808]">
             <div className="h-8 border-b border-[#1a1a1a] flex items-center px-4 bg-[#0d0d0d]">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Module // Inference Report</span>
             </div>

             <div className="flex-1 overflow-y-auto p-10 font-mono">
                {loading ? (
                   <div className="h-full flex flex-col items-center justify-center space-y-4">
                      <div className="w-12 h-1 block border-t-2 border-[#4ade80] animate-pulse"></div>
                      <span className="text-[9px] font-black tracking-widest uppercase animate-pulse">Computing Inference...</span>
                   </div>
                ) : error ? (
                   <div className="p-6 rounded border border-red-900/40 bg-red-900/10 text-red-400 text-[11px] leading-relaxed italic">
                      [ERROR_TRACE]: {error}
                   </div>
                ) : result ? (
                   <div className="space-y-12 animate-fade-in">
                      {/* Detailed Trace Logic per tool */}
                      {activeTab === 'summarization' && (
                        <div className="space-y-6">
                           <div className="text-[9px] font-black tracking-widest opacity-20 uppercase">Compressed Buffer</div>
                           <div className="text-[14px] leading-relaxed text-white italic">
                              <span className="text-[#98c379]">"</span>{result.summary}<span className="text-[#98c379]">"</span>
                           </div>
                           <div className="p-4 rounded bg-white/[0.02] border border-white/5 space-y-2">
                               <div className="flex justify-between text-[9px] tracking-widest opacity-30 uppercase font-black">
                                  <span>Compression Ratio</span>
                                  <span className="text-[#4ade80]">{(100 - (result.summary.length / text.length * 100)).toFixed(1)}%</span>
                               </div>
                               <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#4ade80]" style={{ width: `${100 - (result.summary.length / text.length * 100)}%` }} />
                               </div>
                           </div>
                        </div>
                      )}

                      {activeTab === 'sentiment' && (
                         <div className="space-y-10">
                            <div className="text-center">
                               <div className={`text-5xl font-black tracking-tighter uppercase ${result.label.toUpperCase() === 'POSITIVE' ? 'text-[#4ade80]' : 'text-[#e06c75]'}`}>
                                  {result.label}
                               </div>
                               <div className="text-[9px] font-black tracking-widest opacity-30 mt-2 uppercase">Classification Map</div>
                            </div>
                            <div className="space-y-6">
                                {result.all_scores?.map((s: any) => (
                                  <div key={s.label} className="space-y-2">
                                     <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-[#a1a1aa]/50">
                                        <span>{s.label}</span>
                                        <span className={s.label.toUpperCase() === result.label.toUpperCase() ? 'text-[#4ade80]' : ''}>{(s.score * 100).toFixed(1)}%</span>
                                     </div>
                                     <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full transition-all duration-1000 ${s.label.toUpperCase() === result.label.toUpperCase() ? 'bg-[#4ade80]' : 'bg-white/10'}`}
                                          style={{ width: `${s.score * 100}%` }}
                                        />
                                     </div>
                                  </div>
                                ))}
                            </div>
                         </div>
                      )}

                      {activeTab === 'zeroshot' && (
                        <div className="space-y-6">
                           <div className="text-[9px] font-black tracking-widest opacity-20 uppercase">Probability Matrix</div>
                           <div className="space-y-2">
                              {result.all_labels?.map((l: any) => (
                                 <div key={l.label} className="group p-4 rounded bg-white/[0.02] border border-transparent hover:border-white/10 transition-all">
                                    <div className="flex justify-between items-center mb-2">
                                       <span className="text-[14px] text-white/50 group-hover:text-white capitalize transition-all">{l.label}</span>
                                       <span className="text-[11px] font-bold text-[#61afef]">{(l.score * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                                       <div className="h-full bg-[#61afef]" style={{ width: `${l.score * 100}%` }} />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                      )}

                      {activeTab === 'ner' && (
                        <div className="space-y-8">
                           <div className="text-[9px] font-black tracking-widest opacity-20 uppercase">Token Classification</div>
                           <div className="text-[14px] leading-[2.2] font-sans">
                              {renderAnnotatedText()}
                           </div>
                           <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                              {Object.entries(ENTITY_INFO).map(([key, info]) => (
                                 <div key={key} className="flex flex-col gap-1">
                                    <span className={`text-[10px] font-bold ${info.color}`}>{key}</span>
                                    <span className="text-[9px] opacity-20 uppercase tracking-widest">{info.title}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                      )}

                      {activeTab === 'qa' && (
                        <div className="space-y-12 py-10">
                           <div className="text-center space-y-4">
                              <div className="text-[9px] font-black tracking-widest opacity-20 uppercase italic">Inference Answer</div>
                              {result.answerable ? (
                                <div className="text-2xl font-black text-[#d19a66] tracking-tight leading-tight underline underline-offset-8 decoration-[#d19a66]/20">
                                   {result.answer}
                                </div>
                              ) : (
                                <div className="opacity-30 italic text-[14px]">[NULL_PTR_EXCEPTION]: Context insufficient.</div>
                              )}
                           </div>
                           {result.answerable && (
                              <div className="p-6 rounded border border-[#d19a66]/20 bg-[#d19a66]/5 flex flex-col items-center gap-1">
                                 <span className="text-[9px] font-black tracking-[0.4em] text-[#d19a66]">Confidence</span>
                                 <span className="text-[14px] font-bold text-white">{(result.confidence * 100).toFixed(2)}%</span>
                              </div>
                           )}
                        </div>
                      )}

                      {/* Code Sample Generation */}
                      <div className="pt-10 border-t border-white/5 space-y-4">
                         <div className="text-[8px] font-black tracking-widest opacity-20 uppercase">CURL EXample</div>
                         <div className="p-4 rounded bg-black border border-white/5 font-mono text-[11px] text-white/50 group relative hover:text-white transition-all overflow-hidden">
                            <pre className="overflow-x-auto">
{`curl -X POST "${API_URL}${activeTab}" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "..."}'`}
                            </pre>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <ArrowUpRight size={12} className="text-[#4ade80]" />
                            </div>
                         </div>
                      </div>
                   </div>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center space-y-10 opacity-10 grayscale">
                      <Brain size={64} className="animate-glow" />
                      <div className="text-center space-y-2">
                        <div className="text-[10px] font-black tracking-[0.5em] uppercase">Neural Engine Idling</div>
                        <div className="text-[8px] tracking-[0.2em] uppercase">Status: READY_FOR_SIGNAL</div>
                      </div>
                   </div>
                )}
             </div>

             {/* Footer Info */}
             <div className="h-10 border-t border-[#1a1a1a] bg-[#0d0d0d] flex items-center justify-between px-6 text-[10px] opacity-30 font-bold tracking-widest">
                <div className="flex gap-4">
                   <span>UTF-8</span>
                   <span>TypeScript</span>
                </div>
                <div className="flex gap-4">
                   <span>LN 1, COL 1</span>
                   <span>SPACES: 2</span>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
