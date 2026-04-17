/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  TestTube2, 
  Sparkles, 
  Copy, 
  Check, 
  Terminal,
  Eraser,
  Settings
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateTestCasesStream } from './services/geminiService';

export default function App() {
  const [code, setCode] = useState('');
  const [testCases, setTestCases] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!code.trim()) return;
    setIsGenerating(true);
    setTestCases('');
    try {
      const stream = generateTestCasesStream(code);
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setTestCases(fullText);
      }
    } catch (error) {
      console.error(error);
      setTestCases('An error occurred. Please check your console.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(testCases);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [testCases]);

  const handleClear = () => {
    setCode('');
    setTestCases('');
  };

  return (
    <div className="h-screen flex flex-col bg-bg-primary text-text-main font-sans overflow-hidden">
      {/* Header */}
      <header className="h-[64px] bg-bg-secondary border-b border-border-main flex items-center justify-between px-8 flex-shrink-0">
        <div className="flex items-center gap-2 font-extrabold text-xl tracking-tighter">
          <div className="w-3 h-3 bg-accent-blue rounded-[2px]" />
          UnitGen.io
        </div>
        <div className="flex items-center gap-6 text-sm text-text-secondary">
          <div className="px-2 py-1 rounded-[4px] bg-[#E5F6FF] text-[#002D9C] text-[11px] font-bold uppercase tracking-wider">
            BETA ACCESS
          </div>
          <div className="flex items-center gap-3">
            <span>Project: core-utility-v1</span>
            <div className="w-8 h-8 rounded-full bg-[#eee] border border-border-main" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 grid grid-cols-2 gap-6 p-6 overflow-hidden min-h-0">
        {/* Source Panel */}
        <section className="bg-bg-secondary border border-border-main rounded-lg flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-border-main flex items-center justify-between flex-shrink-0">
            <span className="text-[12px] font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
              <Code2 size={14} className="text-accent-blue" />
              Source Component
            </span>
            <span className="text-[11px] text-text-secondary font-medium">Typescript / React</span>
          </div>
          <div className="flex-1 bg-code-bg text-code-text p-5 font-mono text-[13px] leading-relaxed relative group overflow-hidden">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your component or function here..."
              className="w-full h-full bg-transparent resize-none focus:outline-none placeholder:text-text-secondary"
              spellCheck={false}
            />
          </div>
        </section>

        {/* Output Panel */}
        <section className="bg-bg-secondary border border-border-main rounded-lg flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-border-main flex items-center justify-between flex-shrink-0">
            <span className="text-[12px] font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
              <Terminal size={14} className="text-accent-blue" />
              Generated Test Cases
            </span>
            {testCases && (
              <span className="text-[11px] text-[#24A148] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#24A148] rounded-full" />
                Tests Ready
              </span>
            )}
          </div>
          <div className="flex-1 bg-code-bg text-code-text p-5 font-mono text-[13px] leading-relaxed overflow-auto">
            {!testCases && !isGenerating && (
              <div className="h-full flex flex-col items-center justify-center text-text-secondary opacity-30 select-none">
                <TestTube2 size={40} className="mb-3" />
                <p className="text-[11px] uppercase tracking-widest font-bold">Awaiting Input Signal</p>
              </div>
            )}
            
            {isGenerating && (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-[#ffffff15] rounded w-3/4" />
                <div className="h-4 bg-[#ffffff15] rounded w-1/2" />
                <div className="h-4 bg-[#ffffff15] rounded w-2/3" />
                <div className="h-24 bg-[#ffffff10] rounded w-full mt-6" />
              </div>
            )}

            {!isGenerating && testCases && (
              <div className="prose prose-sm prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0">
                <ReactMarkdown
                  components={{
                    pre: ({ children }) => <div>{children}</div>
                  }}
                >
                  {testCases}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Control Bar */}
      <div className="h-[80px] bg-bg-secondary border-t border-border-main px-8 flex items-center gap-4 flex-shrink-0">
        <button 
          onClick={handleClear}
          className="px-6 py-3 border border-border-main rounded-[4px] font-bold text-[13px] text-text-main hover:bg-bg-primary transition-colors flex items-center gap-2"
        >
          <Eraser size={14} />
          RESET EDITOR
        </button>
        <button 
          className="px-6 py-3 border border-border-main rounded-[4px] font-bold text-[13px] text-text-main hover:bg-bg-primary transition-colors flex items-center gap-2"
        >
          <Settings size={14} />
          SETTINGS
        </button>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !code.trim()}
          className="px-8 py-3 bg-accent-blue text-white rounded-[4px] font-bold text-[13px] tracking-wide hover:bg-[#0353E9] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-accent-blue/10"
        >
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2"
              >
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                GENERATING...
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2"
              >
                <Sparkles size={16} />
                GENERATE UNIT TESTS
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div className="flex-1" />

        {testCases && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-[12px] font-bold text-accent-blue hover:underline uppercase tracking-widest"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied to Clipboard' : 'Copy Test Suite'}
          </button>
        )}

        <div className="text-[12px] text-text-secondary whitespace-nowrap">
          Estimated Token Cost: <span className="font-bold text-text-main">~0.002</span>
        </div>
      </div>
    </div>
  );
}


