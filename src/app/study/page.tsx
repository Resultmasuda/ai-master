"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, ChevronRight, EyeOff, Brain, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/lib/store/userStore';
import redSheetData from '@/data/red_sheet.json';
import studyData from '@/data/study_hall.json';

export default function StudyHall() {
    const { activeSubject } = useUserStore();

    const theme = {
        BOKI: {
            primary: "emerald",
            primaryBg: "bg-emerald-500",
            primaryText: "text-emerald-600",
            gradient: "from-emerald-500 to-teal-700",
            tag: "簿記 学習室"
        },
        FP: {
            primary: "amber",
            primaryBg: "bg-amber-500",
            primaryText: "text-amber-600",
            gradient: "from-amber-500 to-orange-700",
            tag: "FP 学習室"
        }
    }[activeSubject];

    // Use red sheet data for topic listing (groups by category+title)
    const filteredRedSheet = redSheetData.filter((d: { subject: string }) => d.subject === activeSubject);
    const filteredStudy = studyData.filter(d => d.subject === activeSubject);

    // Build combined topic list: use red sheet topics as primary, add notes link from study_hall
    interface TopicItem {
        title: string;
        category: string;
        blankCount: number;
        hasNotes: boolean;
        conceptCount: number;
    }

    const topics: TopicItem[] = filteredRedSheet.map((rs: { title: string; category: string; sections: { lines: string[] }[] }) => {
        const blankCount = rs.sections.reduce((sum: number, sec: { lines: string[] }) =>
            sum + sec.lines.reduce((lsum: number, line: string) => lsum + (line.match(/\{\{.+?\}\}/g) || []).length, 0)
            , 0);
        const matchingStudy = filteredStudy.find(s => s.category === rs.category);
        return {
            title: rs.title,
            category: rs.category,
            blankCount,
            hasNotes: !!matchingStudy,
            conceptCount: matchingStudy ? matchingStudy.concepts.length : 0,
        };
    });

    return (
        <main className="min-h-screen bg-gray-50 p-6 md:p-12 max-w-7xl mx-auto space-y-12 font-sans">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">ダッシュボードに戻る</span>
                    </Link>
                    <div className="space-y-1">
                        <div className={`flex items-center gap-2 ${theme.primaryText} font-black tracking-[0.3em] uppercase text-[10px]`}>
                            <GraduationCap size={14} /> {theme.tag}
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-slate-900">
                            AI学習室<span className={theme.primaryText}>.</span>
                        </h1>
                    </div>
                </div>
            </header>

            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br ${theme.gradient} rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl`}
            >
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <BookOpen size={200} />
                </div>
                <div className="relative z-10 space-y-6 max-w-2xl">
                    <h2 className="text-3xl font-black tracking-tight">効率的に知識を定着させましょう</h2>
                    <p className="text-white/80 font-bold leading-relaxed">
                        テストだけでは補えない用語の暗記や、複雑な概念の理解をサポートします。
                        赤シート暗記と要点まとめを活用して、合格への土台を作りましょう。
                    </p>
                </div>
            </motion.section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {topics.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
                    >
                        <div className={`h-24 bg-gradient-to-r ${theme.gradient} p-8 flex items-end`}>
                            <h3 className="text-white font-black text-xl tracking-tight">{item.title}</h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>収録教材</span>
                                <span>{item.blankCount} 穴埋め</span>
                            </div>

                            <div className="space-y-3">
                                <Link href={`/study/${item.category}/flashcards`} className="block group/btn">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-rose-300 hover:bg-rose-50 transition-all">
                                        <div className="flex items-center gap-3">
                                            <EyeOff size={18} className="text-rose-500" />
                                            <span className="font-black text-sm text-slate-700">赤シート暗記</span>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-300" />
                                    </div>
                                </Link>
                                {item.hasNotes && (
                                    <Link href={`/study/${item.category}/notes`} className="block group/btn">
                                        <div className={`flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-${theme.primary}-300 hover:bg-${theme.primary}-50 transition-all`}>
                                            <div className="flex items-center gap-3">
                                                <Brain size={18} className={theme.primaryText} />
                                                <span className="font-black text-sm text-slate-700">要点まとめノート</span>
                                                <span className="text-[10px] text-slate-400 font-bold">{item.conceptCount}項目</span>
                                            </div>
                                            <ChevronRight size={16} className="text-slate-300" />
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </main>
    );
}
