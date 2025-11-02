
import React, { useState } from 'react';
import UrlInputForm from './components/UrlInputForm';
import ReportDisplay from './components/ReportDisplay';
import { analyzeUrl } from './services/seoAnalyzer';
import { AnalysisReport } from './types';

const App: React.FC = () => {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState<string>('');

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    setAnalyzedUrl(url);

    try {
      const analysisResult = await analyzeUrl(url);
      setReport(analysisResult);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
            Free Unlimited SEO Analyzer
          </h1>
          <p className="text-lg text-gray-400">
            Powered by Gemini for an in-depth on-page analysis.
          </p>
        </header>

        <UrlInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        
        {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg text-center">
                <p className="font-bold">Analysis Failed</p>
                <p className="text-sm">{error}</p>
            </div>
        )}

        {report && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-6">
                Analysis for: <a href={analyzedUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{analyzedUrl}</a>
            </h2>
            <ReportDisplay report={report} />
          </div>
        )}

        {!isLoading && !report && !error && (
            <div className="text-center bg-gray-800 p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-2">Ready to improve your SEO?</h2>
                <p className="text-gray-400">Enter a website URL above to start your free on-page SEO analysis. Get instant, actionable feedback to rank higher.</p>
            </div>
        )}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Built with React, Tailwind CSS, and the Google Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;
