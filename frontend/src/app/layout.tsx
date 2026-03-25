import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NLP Intelligence Suite',
  description: 'Multi-Task NLP Intelligence Suite using HuggingFace Models',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-brand-500 selection:text-white">
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 glass-panel !rounded-none !border-x-0 !border-t-0 border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                AI
              </div>
              <h1 className="text-xl font-bold tracking-tight text-gradient">
                NLP Intelligence Suite
              </h1>
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium opacity-80">
              <a href="#about" className="hover:opacity-100 transition-opacity">About</a>
              <a href="#tools" className="hover:opacity-100 transition-opacity">Tools</a>
              <a href="https://huggingface.co" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">Hugging Face</a>
            </nav>
          </header>
          
          <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8">
            {children}
          </main>
          
          <footer className="py-6 text-center text-sm opacity-60">
            <p>Powered by FastAPI, Next.js, and Hugging Face</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
