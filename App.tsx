import React, { useState, useEffect } from 'react';
import { analyzeStory } from './services/geminiService';
import { AnalysisResult, INITIAL_STORY } from './types';
import { ScoreCard } from './components/ScoreCard';
import { MarkingTraces } from './components/MarkingTraces';
import { FeedbackList } from './components/FeedbackList';

const App = () => {
  const [story, setStory] = useState(INITIAL_STORY);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!story.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeStory(story);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze the story. Please ensure your API key is valid and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Sticky header scroll effect
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-200 bg-white border-b border-slate-200 ${scrolled ? 'shadow-md py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-none">Cambridge PET</h1>
              <span className="text-xs text-slate-500 font-medium">Writing Examiner AI</span>
            </div>
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-white shadow-lg transition-all
              ${loading 
                ? 'bg-slate-400 cursor-not-allowed opacity-70' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95'
              }
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Marking...
              </>
            ) : (
              <>
                <span>Analyze Essay</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          
          {/* Left Column: Input */}
          <section className="flex flex-col h-full">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full min-h-[500px]">
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex justify-between items-center">
                <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Student Response
                </h2>
                <span className="text-xs font-medium text-slate-400 bg-slate-200 px-2 py-1 rounded">
                  {story.trim().split(/\s+/).filter(w => w.length > 0).length} words
                </span>
              </div>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Paste the student's story here..."
                className="flex-1 w-full p-6 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 text-lg leading-relaxed font-serif"
                spellCheck={false}
              />
            </div>
            
            {/* Prompt Reminder */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
              <span className="font-bold block mb-1">Task Prompt:</span>
              Your story must begin with this sentence: <em>When Pat opened the book, an old letter fell out of it.</em>
            </div>
          </section>

          {/* Right Column: Results */}
          <section className="flex flex-col gap-6">
            {!result ? (
              <div className="h-full min-h-[500px] border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50/50">
                <div className="text-center p-8 max-w-md">
                  <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Ready to Analyze</h3>
                  <p className="text-slate-500 text-sm">
                    Enter the student's story on the left and click "Analyze Essay" to generate a detailed Cambridge PET assessment.
                  </p>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in-up">
                {/* Score Card */}
                <ScoreCard scores={result.scores} total={result.totalScore} />

                {/* Marking Traces (Inline Feedback) */}
                <MarkingTraces segments={result.inlineFeedback} />

                {/* Good / Bad Points Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <FeedbackList type="good" points={result.goodPoints} />
                  <FeedbackList type="bad" points={result.badPoints} />
                </div>

                {/* Revised Version */}
                <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm border border-indigo-100 p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                     <div className="bg-indigo-100 p-1.5 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-700" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v3.25a1 1 0 11-2 0V13.003a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                     </div>
                     <h3 className="text-lg font-bold text-slate-800">Improved Version</h3>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-serif text-lg">
                      {result.revisedText}
                    </p>
                  </div>
                </div>

                {/* General Feedback (Moved to bottom as it's less critical than traces/improvement) */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Examiner's General Comments</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{result.generalFeedback}</p>
                </div>

              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>Powered by Google Gemini 2.5 Flash • Designed for Cambridge PET (B1) Exam Preparation</p>
        </div>
      </footer>
    </div>
  );
};

export default App;