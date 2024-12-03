import React from 'react';
import { useAI } from './AIContext';

export function AIVisualization() {
  const { isLoading } = useAI();

  return (
    <div className="relative w-full h-32 mb-6 overflow-hidden rounded-lg bg-gradient-to-r from-purple-900/50 to-indigo-900/50 flex items-center justify-center group">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/d5a23962-d666-486b-a2dd-9719f7589d7d.png')] bg-center bg-cover opacity-10 transition-opacity group-hover:opacity-20" />
      
      <div className="relative flex flex-col items-center gap-3">
        {/* Enhanced AI Icon */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 transition-transform duration-300 group-hover:scale-110">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-700 to-indigo-700 flex items-center justify-center">
              <div className={`w-2 ${isLoading ? 'animate-pulse' : ''}`}>
                {/* Enhanced Animated Waveform */}
                <svg className="w-full" viewBox="0 0 20 20">
                  <path
                    className={`
                      fill-purple-300/90 transition-all duration-300
                      ${isLoading ? 'animate-[wave_2s_ease-in-out_infinite]' : 'scale-75 opacity-75'}
                    `}
                    d="M10 2a1 1 0 011 1v14a1 1 0 11-2 0V3a1 1 0 011-1zm4 0a1 1 0 011 1v14a1 1 0 11-2 0V3a1 1 0 011-1zM6 2a1 1 0 011 1v14a1 1 0 11-2 0V3a1 1 0 011-1z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Animated Waveform Bars */}
        <div className="flex items-center gap-0.5 h-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`
                w-0.5 bg-purple-400/80
                transform origin-bottom transition-all duration-300
                ${isLoading ? 'animate-[waveform_1.2s_ease-in-out_infinite]' : 'h-1 opacity-50'}
                group-hover:opacity-100
              `}
              style={{
                height: isLoading ? '16px' : '4px',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 animate-pulse" />
      
      {/* Interactive Particles */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute w-1 h-1 rounded-full bg-purple-300
              animate-[float_${3 + Math.random() * 2}s_ease-in-out_infinite]
            `}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}