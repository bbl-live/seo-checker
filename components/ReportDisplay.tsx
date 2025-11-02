
import React, { useMemo } from 'react';
import { AnalysisReport } from '../types';
import ProgressBar from './ProgressBar';
import CategoryAccordion from './CategoryAccordion';
import { ShareIcon } from './icons';

interface ReportDisplayProps {
  report: AnalysisReport;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report }) => {
  const categoryKeys = Object.keys(report);

  const overallScore = useMemo(() => {
    if (categoryKeys.length === 0) return 0;
    const totalScore = categoryKeys.reduce((acc, key) => acc + report[key].score, 0);
    return Math.round(totalScore / categoryKeys.length);
  }, [report, categoryKeys]);

  const summary = useMemo(() => {
    let passed = 0;
    let warnings = 0;
    let errors = 0;
    Object.values(report).forEach(category => {
        category.items.forEach(item => {
            if (item.status === 'pass') passed++;
            else if (item.status === 'warn') warnings++;
            else if (item.status === 'fail') errors++;
        });
    });
    return { passed, warnings, errors };
  }, [report]);

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Report Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {categoryKeys.map(key => (
            <ProgressBar key={key} score={report[key].score} label={report[key].title} />
          ))}
        </div>
        <hr className="my-6 border-gray-600" />
        <ProgressBar score={overallScore} label="Overall Score" />
      </div>

      {/* Detailed Sections */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Detailed Analysis</h2>
        {categoryKeys.map((key, index) => (
          <CategoryAccordion key={key} category={report[key]} initialOpen={index === 0} />
        ))}
      </div>
      
      {/* End of Report Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-2">Analysis Complete!</h2>
        <p className="text-gray-400 mb-4">Here's a summary of your on-page SEO.</p>
        <div className="flex justify-center space-x-4 mb-6">
            <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-md"><strong>{summary.passed}</strong> Passed</div>
            <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-md"><strong>{summary.warnings}</strong> Warnings</div>
            <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-md"><strong>{summary.errors}</strong> Errors</div>
        </div>
         <button 
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
         >
            <ShareIcon />
            Share this Report
        </button>
      </div>

    </div>
  );
};

export default ReportDisplay;
