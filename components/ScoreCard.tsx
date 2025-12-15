import React from 'react';
import { ScoreBreakdown } from '../types';

interface ScoreCardProps {
  scores: ScoreBreakdown;
  total: number;
}

const ScoreItem = ({ label, score, description }: { label: string; score: number; description: string }) => (
  <div className="flex flex-col p-3 bg-white rounded-lg shadow-sm border border-slate-100">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className={`text-lg font-bold ${score >= 4 ? 'text-green-600' : score >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
        {score}/5
      </span>
    </div>
    <p className="text-xs text-slate-400">{description}</p>
    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
      <div 
        className={`h-1.5 rounded-full ${score >= 4 ? 'bg-green-500' : score >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`} 
        style={{ width: `${(score / 5) * 100}%` }}
      ></div>
    </div>
  </div>
);

export const ScoreCard: React.FC<ScoreCardProps> = ({ scores, total }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Exam Result
        </h3>
        <div className="text-right">
          <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold block">Total Score</span>
          <span className="text-2xl font-black text-indigo-600">{total}/20</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ScoreItem label="Content" score={scores.content} description="Relevance to the task" />
        <ScoreItem label="Comm. Achievement" score={scores.communicativeAchievement} description="Style & Register" />
        <ScoreItem label="Organization" score={scores.organization} description="Paragraphs & Linking" />
        <ScoreItem label="Language" score={scores.language} description="Grammar & Vocabulary" />
      </div>
    </div>
  );
};