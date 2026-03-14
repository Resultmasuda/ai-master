"use client";
import React, { useState, useMemo, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, HelpCircle, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/lib/store/userStore';
import studyData from '@/data/study_hall.json';

export default function Flashcards({ params }: { params: Promise<{ category: string }> }) {
    const { activeSubject } = useUserStore();
    const resolvedParams = use(params);
    const categoryId = resolvedParams.category;

    const theme = {
        BOKI: {
            primary: "emerald",
            primaryBg: "bg-emerald-500",
            primaryText: "text-emerald-600",
            gradient: "from-emerald-500 to-teal-700",
        },
        FP: {
            primary: "amber",
            primaryBg: "bg-amber-500",
            primaryText: "text-amber-600",
            gradient: "from-amber-500 to-orange-700",
        }
    }[activeSubject];

    const categoryData = useMemo(() => {
        return studyData.find(d => d.subject === activeSubject && d.category === categoryId);
    }, [activeSubject, categoryId]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [knownCount, setKnownCount] = useState(0);

    if (!categoryData) {
        return <div className="p-12 text-center font-black">教材が見つかりません</div>;
    }

    const cards = categoryData.flashcards;
    const currentCard = cards[currentIndex];
    const progress = ((currentIndex + 1) / cards.length) * 100;

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setIsFlipped(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 p-6 md:p-12 flex flex-col items-center max-w-4xl mx-auto font-sans">
            <header className="w-full flex items-center justify-between mb-12">
                <Link href="/study" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">学習室に戻る</span>
                </Link>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</p>
                    <p className={`text-sm font-black ${theme.primaryText}`}>{currentIndex + 1} / {cards.length}</p>
                </div>
            </header>

            <div className="w-full h-2 bg-slate-200 rounded-full mb-12 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full ${theme.primaryBg}`}
                />
            </div>

            <div className="w-full perspective-1000 relative h-[400px] md:h-[450px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full h-full relative"
                    >
                        <motion.div
                            initial={false}
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                            className="w-full h-full relative preserve-3d cursor-pointer"
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            {/* Front Face */}
                            <div className="absolute inset-0 bg-white rounded-[3rem] shadow-2xl border-2 border-slate-100 p-12 flex flex-col items-center justify-center text-center select-none backface-hidden">
                                <div className={`w-16 h-16 rounded-2xl ${theme.primaryBg}/10 flex items-center justify-center ${theme.primaryText} mb-8`}>
                                    <GraduationCap size={32} />
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                                    {currentCard.term}
                                </h2>
                                <p className="absolute bottom-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                                    カードをタップして意味を確認
                                </p>
                            </div>

                            {/* Back Face */}
                            <div
                                className={`absolute inset-0 bg-white rounded-[3rem] shadow-2xl border-2 border-slate-100 p-12 flex flex-col items-center justify-center text-center select-none backface-hidden`}
                                style={{ transform: 'rotateY(180deg)' }}
                            >
                                <div className={`w-16 h-16 rounded-2xl ${theme.primaryBg} flex items-center justify-center text-white mb-8`}>
                                    <CheckCircle2 size={32} />
                                </div>
                                <h2 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight leading-relaxed">
                                    {currentCard.definition}
                                </h2>
                                <p className="absolute bottom-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                                    タップして用語に戻る
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="w-full mt-12 flex items-center justify-between gap-6">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-6 bg-white border border-slate-200 rounded-3xl text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all hover:shadow-md active:scale-95"
                >
                    <ChevronLeft size={24} strokeWidth={3} />
                </button>

                <div className="flex-1 flex gap-4">
                    <button
                        onClick={() => {
                            setKnownCount(prev => prev + 1);
                            handleNext();
                        }}
                        className={`flex-1 py-6 ${theme.primaryBg} text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-${theme.primary}-500/20 hover:brightness-110 active:scale-95 flex items-center justify-center gap-2`}
                    >
                        <CheckCircle2 size={18} />
                        覚えた！
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex-1 py-6 bg-slate-100 text-slate-400 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <HelpCircle size={18} />
                        まだ不安
                    </button>
                </div>

                <button
                    onClick={handleNext}
                    disabled={currentIndex === cards.length - 1}
                    className="p-6 bg-white border border-slate-200 rounded-3xl text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all hover:shadow-md active:scale-95"
                >
                    <ChevronRight size={24} strokeWidth={3} />
                </button>
            </div>

            {currentIndex === cards.length - 1 && isFlipped && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 text-center space-y-4"
                >
                    <p className="text-slate-400 font-bold text-sm">セッション完了！</p>
                    <Link href="/study">
                        <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">
                            学習室へ戻る
                        </button>
                    </Link>
                </motion.div>
            )}
        </main>
    );
}
