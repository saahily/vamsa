import React, { useCallback, useState, useMemo } from 'react';
import { FamilyTree } from '../components/FamilyTree';
import { TimelineControls } from '../components/TimelineControls';
import { ProfileMenu } from '../components/ProfileMenu';
import { StarField } from '../components/StarField';
import { sampleFamilyData } from '../data/sampleData';
import { useFamilyTree } from '../contexts/FamilyTreeContext';

export function FamilyTreePage() {
  const { state, setState } = useFamilyTree();
  const { currentYear, focusedMemberId, viewport } = state;
  const [isPlaying, setIsPlaying] = useState(false);

  // Calculate min and max years from family data
  const { minYear, maxYear } = useMemo(() => {
    const years = Object.values(sampleFamilyData.members).map(member => 
      parseInt(member.birthYear)
    );
    return {
      minYear: Math.min(...years),
      maxYear: new Date().getFullYear()
    };
  }, []);

  const handleYearChange = useCallback((year: number) => {
    setState({ currentYear: year });
  }, [setState]);

  const handleViewportChange = useCallback((viewport: any) => {
    setState({ viewport });
  }, [setState]);

  const handleFocusChange = useCallback((memberId: string | null) => {
    setState({ focusedMemberId: memberId });
  }, [setState]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),rgba(15,23,42,0))]" />
        <StarField />
      </div>
      <header className="relative bg-black/30 backdrop-blur-lg border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-title italic font-semibold text-white tracking-wide">
              <span className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 bg-clip-text text-transparent">
                Vaṃśa
              </span>
            </h1>
            <p className="text-slate-300 mt-1 font-serif text-lg">Your family tree</p>
          </div>
          <ProfileMenu />
        </div>
      </header>
      <main className="relative">
        <FamilyTree 
          data={sampleFamilyData} 
          currentYear={currentYear}
          initialViewport={viewport}
          onViewportChange={handleViewportChange}
          focusedMemberId={focusedMemberId}
          onFocusChange={handleFocusChange}
        />
        <TimelineControls
          minYear={minYear}
          maxYear={maxYear}
          currentYear={currentYear}
          isPlaying={isPlaying}
          onYearChange={handleYearChange}
          onPlayPause={handlePlayPause}
        />
      </main>
    </div>
  );
}