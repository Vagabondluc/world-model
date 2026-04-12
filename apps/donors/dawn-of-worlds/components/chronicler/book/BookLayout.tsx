import React, { useState, useMemo, useEffect } from 'react';
import { JournalEntry } from '../../../logic/chronicler/types';
import { BookPage, TableOfContents } from '../../../logic/chronicler/book/types';
import { BookPagination } from '../../../logic/chronicler/book/pagination';
import { triggerHaptic } from '../../../logic/haptics';

interface BookLayoutProps {
    entries: JournalEntry[];
    onClose: () => void;
}

export const BookLayout: React.FC<BookLayoutProps> = ({ entries, onClose }) => {
    // Logic State
    const { pages, toc } = useMemo(() => BookPagination.paginate(entries), [entries]);

    // UI State
    const [currentPageIdx, setCurrentPageIdx] = useState(0); // 0-indexed for array access
    const [showTOC, setShowTOC] = useState(false);
    const currentPage = pages[currentPageIdx];

    // Navigation
    const canPrev = currentPageIdx > 0;
    const canNext = currentPageIdx < pages.length - 1;

    const goNext = () => {
        if (canNext) {
            triggerHaptic('tap');
            setCurrentPageIdx(p => p + 1);
        }
    };

    const goPrev = () => {
        if (canPrev) {
            triggerHaptic('tap');
            setCurrentPageIdx(p => p - 1);
        }
    };

    const goToPage = (pageNum: number) => {
        const idx = pages.findIndex(p => p.pageNumber === pageNum);
        if (idx !== -1) setCurrentPageIdx(idx);
        setShowTOC(false); // Close TOC on selection
    };

    // Keyboard Nav
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'Escape') {
                if (showTOC) setShowTOC(false);
                else onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentPageIdx, pages.length, showTOC]);

    return (
        <div className="flex-1 flex flex-col bg-[#1a1614] relative overflow-hidden">
            {/* Ambient Background - optional texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('/textures/paper-noise.png')] pointer-events-none" />

            {/* Top Chrome */}
            <header className="h-16 flex items-center justify-between px-8 border-b border-[#3c342a] bg-[#2c241b] z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-amber-700">auto_stories</span>
                    <h1 className="text-xl font-display font-bold text-[#d4c5b0] uppercase tracking-widest">The Chronicle</h1>
                </div>
                <div className="flex items-center gap-4 text-[#8b7d6b] text-sm font-mono">
                    <button
                        onClick={() => setShowTOC(!showTOC)}
                        className={`flex items-center gap-2 px-3 py-1 rounded transition-colors uppercase tracking-wider text-xs font-bold ${showTOC ? 'bg-[#8b4513] text-white' : 'hover:bg-[#3c342a] hover:text-[#d4c5b0]'}`}
                    >
                        <span className="material-symbols-outlined text-sm">list</span>
                        Contents
                    </button>
                    <div className="w-px h-4 bg-[#3c342a]" />
                    <span>Page {currentPage.pageNumber} of {pages[pages.length - 1].pageNumber}</span>
                    <button onClick={onClose} className="hover:text-[#d4c5b0] transition-colors ml-2">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </header>

            {/* TOC Overlay */}
            {showTOC && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200" onClick={() => setShowTOC(false)}>
                    <div className="w-full max-w-md bg-[#f5f0e6] p-8 rounded-sm shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <div className="mb-8 text-center border-b-2 border-black/10 pb-4">
                            <h2 className="text-2xl font-display font-black text-[#2c241b] uppercase tracking-widest">Table of Contents</h2>
                            <div className="w-8 h-1 bg-[#8b4513] mx-auto opacity-50 mt-2" />
                        </div>
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar-sepia pr-2">
                            {toc.chapters.map(chapter => (
                                <button
                                    key={chapter.ageNumber}
                                    onClick={() => goToPage(chapter.startPage)}
                                    className="w-full flex items-baseline justify-between p-3 hover:bg-[#e8dec8] transition-colors group text-left"
                                >
                                    <div>
                                        <span className="block font-display font-bold text-[#4a3c31] group-hover:text-[#2c241b] uppercase tracking-wider">
                                            {chapter.title}
                                        </span>
                                        <span className="text-xs font-mono text-[#8b7d6b] group-hover:text-[#6d5e4f]">
                                            {chapter.entryCount} Entries
                                        </span>
                                    </div>
                                    <div className="border-b border-dotted border-[#8b7d6b]/30 flex-1 mx-4 relative top-[-4px]" />
                                    <span className="font-mono font-bold text-[#8b4513]">
                                        pg. {chapter.startPage}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Book Spread */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
                <div className="w-full max-w-4xl bg-[#f5f0e6] aspect-[3/4] md:aspect-[4/3] rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex relative">
                    {/* Spine Shadow */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-black/5 via-black/10 to-black/5 z-20 pointer-events-none hidden md:block" />

                    {/* Left Page (Previous or TOC if first?) - For MVP Single Page View primarily or Split */}
                    {/* For MVP we stick to single massive page or simple split. Let's do Single Page centered for focus, simulating "One Page" view mode */}
                    <div className="flex-1 p-12 md:p-16 flex flex-col relative">
                        {/* Page Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar-sepia pr-4">
                            {currentPage.isChapterStart && (
                                <div className="mb-12 text-center border-b-2 border-black/10 pb-8">
                                    <h2 className="text-4xl font-display font-black text-[#2c241b] uppercase tracking-widest mb-2">
                                        {currentPage.chapterTitle}
                                    </h2>
                                    <div className="w-16 h-1 bg-[#8b4513] mx-auto opacity-50" />
                                </div>
                            )}

                            <div className="space-y-12">
                                {currentPage.entries.map(entry => (
                                    <article key={entry.id} className="space-y-3">
                                        <h3 className="text-xl font-display font-bold text-[#4a3c31] leading-tight">
                                            {entry.title}
                                        </h3>
                                        <div className="text-xs font-mono text-[#8b7d6b] uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <span>A{entry.age}</span>
                                            <span>·</span>
                                            <span>{entry.author}</span>
                                        </div>
                                        <p className="text-lg font-serif text-[#2c241b] leading-relaxed">
                                            {entry.text}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>

                        {/* Page Footer */}
                        <div className="mt-8 pt-4 border-t border-black/5 flex justify-between items-center text-[#8b7d6b] font-mono text-xs uppercase tracking-widest">
                            <span>{currentPage.chapterTitle || `Age ${currentPage.age}`}</span>
                            <span>{currentPage.pageNumber}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            {canPrev && (
                <button onClick={goPrev} className="absolute left-8 top-1/2 -mt-8 size-16 rounded-full bg-[#2c241b]/80 text-[#d4c5b0] hover:bg-[#8b4513] transition-all flex items-center justify-center shadow-lg backdrop-blur-sm z-30">
                    <span className="material-symbols-outlined text-3xl">chevron_left</span>
                </button>
            )}
            {canNext && (
                <button onClick={goNext} className="absolute right-8 top-1/2 -mt-8 size-16 rounded-full bg-[#2c241b]/80 text-[#d4c5b0] hover:bg-[#8b4513] transition-all flex items-center justify-center shadow-lg backdrop-blur-sm z-30">
                    <span className="material-symbols-outlined text-3xl">chevron_right</span>
                </button>
            )}
        </div>
    );
};
