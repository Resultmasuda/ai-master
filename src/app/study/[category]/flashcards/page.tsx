"use client";
import React, { useState, useMemo, use, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, RotateCcw, ChevronRight, BookOpen, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/lib/store/userStore';
import redSheetData from '@/data/red_sheet.json';

interface RedSheetSection {
    heading: string;
    lines: string[];
}

interface RedSheetTopic {
    subject: string;
    category: string;
    title: string;
    sections: RedSheetSection[];
}

function parseLineToSegments(line: string) {
    const parts: { text: string; isBlank: boolean; id: string }[] = [];
    const regex = /\{\{(.+?)\}\}/g;
    let lastIndex = 0;
    let match;
    let blankId = 0;

    while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ text: line.slice(lastIndex, match.index), isBlank: false, id: `t-${blankId}` });
        }
        parts.push({ text: match[1], isBlank: true, id: `b-${blankId}` });
        lastIndex = regex.lastIndex;
        blankId++;
    }

    if (lastIndex < line.length) {
        parts.push({ text: line.slice(lastIndex), isBlank: false, id: `t-end` });
    }

    return parts;
}

export default function RedSheetPage({ params }: { params: Promise<{ category: string }> }) {
    const { activeSubject } = useUserStore();
    const resolvedParams = use(params);
    const categoryId = resolvedParams.category;

    const theme = {
        BOKI: {
            primary: "emerald",
            primaryBg: "bg-emerald-500",
            primaryText: "text-emerald-600",
            gradient: "from-emerald-500 to-teal-700",
            blankColor: "bg-rose-500",
            blankText: "text-rose-600",
            blankBg: "bg-rose-50",
        },
        FP: {
            primary: "amber",
            primaryBg: "bg-amber-500",
            primaryText: "text-amber-600",
            gradient: "from-amber-500 to-orange-700",
        }
    }[activeSubject];

    const topics = useMemo(() => {
        return (redSheetData as RedSheetTopic[]).filter(
            d => d.subject === activeSubject && d.category === categoryId
        );
    }, [activeSubject, categoryId]);

    const [revealAll, setRevealAll] = useState(false);
    const [revealedBlanks, setRevealedBlanks] = useState<Set<string>>(new Set());

    const totalBlanks = useMemo(() => {
        let count = 0;
        topics.forEach(topic => {
            topic.sections.forEach(section => {
                section.lines.forEach(line => {
                    const matches = line.match(/\{\{.+?\}\}/g);
                    if (matches) count += matches.length;
                });
            });
        });
        return count;
    }, [topics]);

    const toggleBlank = useCallback((uniqueId: string) => {
        if (revealAll) return;
        setRevealedBlanks(prev => {
            const next = new Set(prev);
            if (next.has(uniqueId)) {
                next.delete(uniqueId);
            } else {
                next.add(uniqueId);
            }
            return next;
        });
    }, [revealAll]);

    const resetAll = useCallback(() => {
        setRevealAll(false);
        setRevealedBlanks(new Set());
    }, []);

    if (topics.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <BookOpen size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black">教材が見つかりません</h2>
                        <p className="text-slate-500 font-bold">このカテゴリーの赤シート教材はまだ準備中です。</p>
                    </div>
                    <Link href="/study" className={`inline-block px-8 py-4 ${theme.primaryBg} text-white rounded-[2rem] font-black text-sm`}>
                        学習室に戻る
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-4 md:p-8 max-w-4xl mx-auto font-sans pb-32">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <Link href="/study" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">学習室に戻る</span>
                </Link>
            </header>

            {/* Title Bar */}
            <div className="mb-8 space-y-3">
                <div className={`flex items-center gap-2 ${theme.primaryText} font-black tracking-[0.3em] uppercase text-[10px]`}>
                    <EyeOff size={14} /> 赤シート暗記モード
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 leading-tight">
                    {topics[0].title}<span className={theme.primaryText}>.</span>
                </h1>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 mb-8">
                <button
                    onClick={() => setRevealAll(!revealAll)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 ${revealAll
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                            : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-rose-300'
                        }`}
                >
                    {revealAll ? <Eye size={18} /> : <EyeOff size={18} />}
                    {revealAll ? '赤シートをかける' : '全て表示する'}
                </button>
                <button
                    onClick={resetAll}
                    className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-200 rounded-2xl font-black text-sm text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all active:scale-95"
                >
                    <RotateCcw size={16} />
                    リセット
                </button>
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-2xl text-xs font-black text-slate-400">
                    <CheckCircle2 size={14} />
                    {revealAll ? totalBlanks : revealedBlanks.size} / {totalBlanks} 表示中
                </div>
            </div>

            {/* Red Sheet Content */}
            <div className="space-y-6">
                {topics.map((topic, topicIdx) => (
                    topic.sections.map((section, secIdx) => (
                        <motion.section
                            key={`${topicIdx}-${secIdx}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: secIdx * 0.05 }}
                            className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm"
                        >
                            {/* Section Header */}
                            <div className={`px-8 py-4 bg-gradient-to-r ${theme.gradient} flex items-center gap-3`}>
                                <BookOpen size={18} className="text-white/80" />
                                <h3 className="text-white font-black text-sm tracking-wide">{section.heading}</h3>
                            </div>

                            {/* Lines */}
                            <div className="p-6 md:p-8 space-y-4">
                                {section.lines.map((line, lineIdx) => {
                                    const segments = parseLineToSegments(line);
                                    return (
                                        <div key={lineIdx} className="text-base md:text-lg leading-loose text-slate-800 font-bold">
                                            {segments.map((seg, segIdx) => {
                                                if (!seg.isBlank) {
                                                    return <span key={segIdx}>{seg.text}</span>;
                                                }

                                                const uniqueId = `${topicIdx}-${secIdx}-${lineIdx}-${segIdx}`;
                                                const isRevealed = revealAll || revealedBlanks.has(uniqueId);

                                                return (
                                                    <button
                                                        key={segIdx}
                                                        onClick={() => toggleBlank(uniqueId)}
                                                        className={`inline-block mx-1 rounded-xl transition-all duration-300 cursor-pointer active:scale-95 ${isRevealed
                                                                ? `${theme.blankBg} ${theme.blankText} px-3 py-0.5 font-black border-2 border-rose-200`
                                                                : 'bg-rose-500 text-rose-500 px-3 py-0.5 min-w-[4rem] hover:bg-rose-400 border-2 border-rose-500 select-none'
                                                            }`}
                                                        aria-label={isRevealed ? seg.text : '隠れた用語をタップして表示'}
                                                    >
                                                        <span className={isRevealed ? '' : 'opacity-0 select-none pointer-events-none'}>
                                                            {seg.text}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.section>
                    ))
                ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 flex flex-col md:flex-row gap-4">
                <Link href={`/quiz/${categoryId}`} className="flex-1">
                    <button className={`w-full py-5 ${theme.primaryBg} text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-${theme.primary}-500/20 hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2`}>
                        この分野のクイズに挑戦
                        <ChevronRight size={16} />
                    </button>
                </Link>
                <Link href="/study" className="flex-1">
                    <button className="w-full py-5 bg-slate-100 text-slate-500 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">
                        学習室に戻る
                    </button>
                </Link>
            </div>
        </main>
    );
}
