import type { Metadata } from 'next';
import './globals.css';
import { MessageSquare, LayoutGrid, Bookmark, FileCode, Brain, Settings, Github, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'NLP Intelligence Suite | Ami-Lab',
  description: 'Premium Multi-Task NLP Intelligence Suite using HuggingFace Models',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-[#cc9966]/30">
        <div className="flex bg-[#0f0f0f] text-[#d1d1d1] min-h-screen font-sans">
          
          {/* Sidebar */}
          <aside className="w-64 border-r border-[#2d2d2d] hidden md:flex flex-col bg-[#0a0a0a]">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-8 h-8 rounded-md bg-[#cc9966] flex items-center justify-center text-black font-serif italic text-xl shadow-lg ring-1 ring-white/10">
                  A
                </div>
                <span className="font-serif text-lg tracking-tight text-white/90">Ami-Lab</span>
              </div>
              
              <nav className="space-y-1">
                <div className="text-[10px] uppercase tracking-[3px] text-[#555] font-black mb-4 px-3">Main</div>
                <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1a1a1a] text-white border border-[#2d2d2d] group transition-all">
                  <MessageSquare size={18} className="text-[#cc9966]" />
                  <span className="text-sm font-medium">New Workspace</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/40 hover:bg-white/5 hover:text-white/60 transition-all group">
                  <LayoutGrid size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm">Projects</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/40 hover:bg-white/5 hover:text-white/60 transition-all group">
                   <Bookmark size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm">Artifacts</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/40 hover:bg-white/5 hover:text-white/60 transition-all group">
                  <FileCode size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm">Code</span>
                </a>
              </nav>

              <div className="py-8 space-y-1">
                <div className="text-[10px] uppercase tracking-[3px] text-[#555] font-black mb-4 px-3">Starred</div>
                <div className="px-3 py-1.5 flex items-center gap-3 text-sm opacity-40 hover:opacity-100 cursor-pointer">
                   <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                   <span>AI Engineering</span>
                </div>
              </div>
            </div>

            <div className="mt-auto p-4 border-t border-[#2d2d2d] space-y-1">
               <a href="https://huggingface.co/Ami-Lab" target="_blank" className="flex items-center gap-3 px-3 py-2 text-sm text-white/30 hover:text-white/60 hover:bg-white/5 rounded-lg transition-all group">
                  <Brain size={16} className="group-hover:text-accent" />
                  <span>HF Profile</span>
                  <ExternalLink size={12} className="ml-auto opacity-40" />
               </a>
               <a href="https://github.com/AmiruMallawarachchi" target="_blank" className="flex items-center gap-3 px-3 py-2 text-sm text-white/30 hover:text-white/60 hover:bg-white/5 rounded-lg transition-all group">
                  <Github size={16} className="group-hover:text-amber-200" />
                  <span>Connect Github</span>
               </a>
               <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-white/30 hover:text-white/60 hover:bg-white/5 rounded-lg transition-all group">
                  <Settings size={16} className="group-hover:rotate-45 transition-transform" />
                  <span>Settings</span>
               </a>
            </div>
          </aside>
          
          <main className="flex-1 flex flex-col h-screen overflow-hidden">
            <header className="h-14 border-b border-[#2d2d2d] px-6 flex items-center justify-between bg-[#0a0a0a]/50 backdrop-blur-md">
               <div className="md:hidden flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#cc9966] flex items-center justify-center text-black font-serif italic text-sm">A</div>
                  <span className="font-serif text-sm">Ami-Lab</span>
               </div>
               <div className="text-[11px] font-black uppercase tracking-[4px] opacity-20 hover:opacity-100 transition-opacity cursor-default flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#cc9966] animate-pulse"></div>
                 NLP Intelligence Suite v1.0
               </div>
               <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest opacity-40">
                 <a href="#about" className="hover:text-white transition-colors">About</a>
                 <a href="#tools" className="hover:text-white transition-colors">Deploy</a>
               </div>
            </header>
            
            <div className="flex-1 overflow-y-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
