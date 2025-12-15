import React from 'react';
import { FeedbackSegment } from '../types';

interface MarkingTracesProps {
  segments: FeedbackSegment[];
}

export const MarkingTraces: React.FC<MarkingTracesProps> = ({ segments }) => {
  if (!segments || segments.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <div className="bg-red-100 p-1.5 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800">Marking Traces</h3>
      </div>
      
      <div className="prose prose-lg max-w-none font-serif leading-relaxed text-slate-800 whitespace-pre-wrap">
        {segments.map((segment, index) => {
          if (!segment.isError) {
            return <span key={index}>{segment.text}</span>;
          }

          return (
            <span key={index} className="relative group cursor-help inline-block">
              {/* Highlighted Error Text */}
              <span className="bg-red-50 text-red-700 decoration-red-400 decoration-wavy underline decoration-1 border-b-2 border-transparent hover:bg-red-100 transition-colors py-0.5 rounded px-0.5">
                {segment.text}
              </span>

              {/* Tooltip / Popover */}
              <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-sm rounded-lg shadow-xl p-3 pointer-events-none">
                <span className="flex flex-col gap-1">
                  <span className="font-semibold text-green-300 border-b border-slate-700 pb-1 mb-1">
                    Suggestion: {segment.correction}
                  </span>
                  <span className="text-slate-300 text-xs">
                    {segment.explanation}
                  </span>
                  {segment.type && (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mt-1">
                      {segment.type}
                    </span>
                  )}
                </span>
                {/* Arrow */}
                <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></span>
              </span>
            </span>
          );
        })}
      </div>
      
      <div className="mt-4 flex gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-50 border border-red-200 rounded"></span>
          <span>Hover over highlighted text to see corrections</span>
        </div>
      </div>
    </div>
  );
};