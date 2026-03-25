"use client";

import { useState } from 'react';

type Tool = 'summarization' | 'sentiment' | 'zeroshot' | 'ner' | 'qa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tool>('summarization');
  
  // States
  const [text, setText] = useState('');
  const [labels, setLabels] = useState('');
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'summarization', label: 'Summarizer', icon: '📝' },
    { id: 'sentiment', label: 'Sentiment', icon: '😊' },
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

      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <section className="text-center py-6 md:py-12 space-y-4">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Unleash <span className="text-gradient">AI Intelligence</span> on Your Text
        </h2>
        <p className="max-w-2xl mx-auto text-lg opacity-70">
          Transform, analyze, and query your unstructured data instantly. 
          Powered by state-of-the-art Hugging Face Transformer models.
        </p>
      </section>

      <div className="glass-panel p-2 md:p-6 overflow-hidden relative">
        {/* Abstract background shapes */}
        <div className="absolute -z-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob top-0 left-0"></div>
        <div className="absolute -z-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob top-0 right-0 animation-delay-2000"></div>

        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200/20 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as Tool); setResult(null); setError(null); }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-blue-600 outline outline-2 outline-blue-600/30 outline-offset-2 text-white shadow-lg' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-800 dark:text-gray-200 backdrop-blur-md'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b border-gray-200/20 pb-2">
              Input
            </h3>

            {activeTab === 'qa' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Context Paragraph</label>
                  <textarea 
                    className="w-full bg-white/50 dark:bg-black/20 border border-gray-300/30 rounded-xl p-4 min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-400/70"
                    placeholder="Enter the background text here..."
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Question</label>
                  <input 
                    type="text"
                    className="w-full bg-white/50 dark:bg-black/20 border border-gray-300/30 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    placeholder="What is..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2 opacity-80">Source Text</label>
                <textarea 
                  className="w-full bg-white/50 dark:bg-black/20 border border-gray-300/30 rounded-xl p-4 min-h-[250px] focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-400/70"
                  placeholder="Paste your text here to let the AI analyze it..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            )}

            {activeTab === 'zeroshot' && (
              <div>
                <label className="block text-sm font-medium mb-2 opacity-80">Categories (comma separated)</label>
                <input 
                  type="text"
                  className="w-full bg-white/50 dark:bg-black/20 border border-gray-300/30 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="Technology, Sports, Politics, Science..."
                  value={labels}
                  onChange={(e) => setLabels(e.target.value)}
                />
              </div>
            )}

            <button 
              onClick={handleProcess}
              disabled={loading || (activeTab === 'qa' ? (!question || !context) : !text)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transform transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : 'Run Analysis ⚡'}
            </button>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b border-gray-200/20 pb-2 flex items-center gap-2">
              Results <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-700 dark:text-green-400 uppercase tracking-widest font-bold ml-auto">{loading ? 'Thinking...' : result ? 'Ready' : 'Waiting'}</span>
            </h3>

            <div className="bg-white/40 dark:bg-black/30 border border-gray-200/30 rounded-xl p-6 min-h-[300px] h-full shadow-inner flex flex-col items-center justify-center">
              
              {error && (
                <div className="text-red-500 bg-red-100/10 p-4 rounded-lg flex items-center gap-2 border border-red-500/20 w-full animate-shake">
                  <span className="text-xl">⚠️</span> {error}
                </div>
              )}

              {!result && !error && !loading && (
                <div className="text-center opacity-40 space-y-4">
                  <div className="text-6xl">🤖</div>
                  <p>Results will appear here...</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center gap-4 py-12">
                  <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-blue-200 border-l-transparent animate-spin"></div>
                  <p className="text-sm font-medium opacity-70 animate-pulse">Running Neural Networks...</p>
                </div>
              )}

              {result && !loading && (
                <div className="w-full h-full flex flex-col justify-start text-left animate-slide-up space-y-4">
                  
                  {activeTab === 'summarization' && (
                    <>
                      <div className="text-2xl opacity-100 leading-relaxed font-serif p-4 bg-white/60 dark:bg-black/40 rounded-lg shadow-sm">
                        "{result.summary}"
                      </div>
                      <div className="flex gap-4 text-sm mt-auto justify-end opacity-60">
                        <span>Original: {result.original_word_count} words</span>
                        <span>Summary: {result.summary_word_count} words</span>
                        <span>Ratio: {(result.compression_ratio * 100).toFixed(0)}%</span>
                      </div>
                    </>
                  )}

                  {activeTab === 'sentiment' && (
                    <div className="flex flex-col items-center justify-center space-y-8 py-8 w-full">
                      <div className="relative">
                        <div className={`text-7xl ${result.label === 'POSITIVE' ? 'text-green-500' : result.label === 'NEGATIVE' ? 'text-red-500' : 'text-gray-500'} drop-shadow-xl animate-bounce-slow`}>
                          {result.label === 'POSITIVE' ? '😁' : result.label === 'NEGATIVE' ? '😡' : '😐'}
                        </div>
                        {result.low_confidence && (
                          <div className="absolute -top-4 -right-8 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full animate-pulse shadow">Low Conf</div>
                        )}
                      </div>
                      <div className="text-3xl font-black tracking-widest">{result.label}</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 max-w-xs overflow-hidden">
                        <div className={`h-2.5 rounded-full ${result.label === 'POSITIVE' ? 'bg-green-500' : result.label === 'NEGATIVE' ? 'bg-red-500' : 'bg-gray-500'}`} style={{ width: `${result.confidence * 100}%` }}></div>
                      </div>
                      <div className="text-sm opacity-60">Confidence: {(result.confidence * 100).toFixed(1)}%</div>
                    </div>
                  )}

                  {activeTab === 'zeroshot' && (
                    <div className="space-y-4 w-full pt-4">
                      {result.all_labels?.map((l: any, i: number) => (
                        <div key={i} className="flex flex-col gap-1 w-full bg-white/40 dark:bg-white/5 p-3 rounded-lg border border-white/20">
                          <div className="flex justify-between font-medium">
                            <span className="capitalize text-lg">{l.label}</span>
                            <span className="font-mono text-blue-600 dark:text-blue-400">{(l.score * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden shadow-inner">
                            <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${l.score * 100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'ner' && (
                    <div className="space-y-4 w-full">
                      <div className="p-4 bg-white/60 dark:bg-black/40 rounded-lg shadow-sm leading-relaxed text-lg" dangerouslySetInnerHTML={{
                        __html: result.annotated_text.replace(/\[(.*?)\/(.*?)\]/g, '<span class="px-1.5 py-0.5 mx-1 rounded bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200 font-medium whitespace-nowrap"><span class="mr-1">$1</span><span class="text-[0.6rem] uppercase tracking-wider opacity-60">$2</span></span>')
                      }} />
                      
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200/20">
                        {result.entities?.map((e: any, i: number) => (
                          <div key={i} className="px-3 py-1 bg-white/40 dark:bg-white/5 rounded-full text-sm flex gap-2 border border-white/20 shadow-sm">
                            <span className="font-semibold">{e.word}</span>
                            <span className="opacity-50">|</span>
                            <span className="text-xs uppercase self-center text-blue-600 dark:text-blue-400">{e.entity_type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'qa' && (
                    <div className="flex flex-col items-center justify-center space-y-6 py-6 w-full">
                      {result.answerable ? (
                        <>
                          <div className="text-6xl animate-bounce-slow">💡</div>
                          <div className="text-2xl font-bold p-6 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-xl shadow-sm border border-green-200 dark:border-green-800 text-center w-full">
                            {result.answer}
                          </div>
                          <div className="text-sm opacity-60 font-mono">Confidence: {(result.confidence * 100).toFixed(1)}%</div>
                        </>
                      ) : (
                        <>
                          <div className="text-6xl opacity-50 grayscale">🤷</div>
                          <div className="text-xl font-medium p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center w-full">
                            Could not find a confident answer in the provided context.
                          </div>
                        </>
                      )}
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
