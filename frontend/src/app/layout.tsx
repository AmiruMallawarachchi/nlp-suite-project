import type { Metadata } from 'next';
import './globals.css';

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
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded bg-[#cc9966] flex items-center justify-center text-black font-serif italic text-xl">
                  A
                </div>
                <span className="font-serif text-lg tracking-tight text-white">Ami-Lab</span>
              </div>
              
              <nav className="space-y-4">
                <div className="text-[11px] uppercase tracking-widest text-[#666] font-bold mb-4">NLP Workspace</div>
                <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#1a1a1a] text-white">
                  <span>💬</span> New Workspace
                </a>
              </nav>
            </div>

            <div className="mt-auto p-6 border-t border-[#2d2d2d] space-y-4">
               <a href="https://huggingface.co/Ami-Lab" target="_blank" className="flex items-center gap-3 text-sm opacity-60 hover:opacity-100 transition-opacity">
                  <span>🧠</span> HF Profile
               </a>
               <a href="https://nlp-suite-project.vercel.app/" className="flex items-center gap-3 text-sm opacity-60 hover:opacity-100 transition-opacity">
                  <span>📦</span> Deployments
               </a>
            </div>
          </aside>
          
          <main className="flex-1 flex flex-col h-screen overflow-hidden">
            <header className="h-14 border-b border-[#2d2d2d] px-6 flex items-center justify-between">
               <div className="md:hidden flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-[#cc9966] flex items-center justify-center text-black font-serif italic text-sm">A</div>
                  <span className="font-serif text-sm">Ami-Lab</span>
               </div>
               <div className="text-sm font-medium opacity-60 italic font-serif">NLP Intelligence Suite</div>
               <div className="flex gap-4 text-xs font-medium opacity-60">
                 <a href="#about" className="hover:text-white transition-colors">About</a>
                 <a href="#tools" className="hover:text-white transition-colors">Tools</a>
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
