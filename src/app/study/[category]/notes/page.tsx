"use client";
import React, { useMemo, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Brain, Star, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/lib/store/userStore';
import studyData from '@/data/study_hall.json';

export default function KnowledgeHub({ params }: { params: Promise<{ category: string }> }) {
    const { activeSubject } = useUserStore();
    const resolvedParams = use(params);
    const categoryId = resolvedParams.category;

    const theme = {
        BOKI: {
            primary: "emerald",
            primaryBg: "bg-emerald-500",
            primaryText: "text-emerald-600",
            secondaryBg: "bg-emerald-50",
            border: "border-emerald-100",
            gradient: "from-emerald-500 to-teal-600",
        },
        FP: {
            primary: "amber",
            primaryBg: "bg-amber-500",
            primaryText: "text-amber-600",
            secondaryBg: "bg-amber-50",
            border: "border-amber-100",
            gradient: "from-amber-500 to-orange-600",
        }
    }[activeSubject];

    const categoryData = useMemo(() => {
        return studyData.find(d => d.subject === activeSubject && d.category === categoryId);
    }, [activeSubject, categoryId]);

    if (!categoryData) {
        return <div className="p-12 text-center font-black">データが見つかりません</div>;
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6 md:p-12 max-w-4xl mx-auto space-y-12 font-sans">
            <header className="flex flex-col gap-8">
                <Link href="/study" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">学習室に戻る</span>
                </Link>
                <div className="space-y-4">
                    <div className={`flex items-center gap-2 ${theme.primaryText} font-black tracking-[0.3em] uppercase text-[10px]`}>
                        <Zap size={14} /> AI 要点まとめノート
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight">
                        {categoryData.title}<span className={theme.primaryText}>.</span>
                    </h1>
                </div>
            </header>

            <section className="space-y-8">
                <div className="grid grid-cols-1 gap-6">
                    {categoryData.concepts.map((concept, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`bg-white border-l-8 ${theme.border} rounded-3xl p-8 shadow-sm flex gap-6 items-start hover:shadow-md transition-shadow`}
                        >
                            <div className={`w-10 h-10 rounded-2xl ${theme.secondaryBg} flex items-center justify-center shrink-0 ${theme.primaryText}`}>
                                <Star size={20} fill="currentColor" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-lg font-black text-slate-800 leading-relaxed">
                                    {concept}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className={`bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative shadow-2xl shadow-slate-900/20`}>
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Brain size={120} />
                </div>
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${theme.primaryBg} flex items-center justify-center`}>
                            <Brain size={20} className="text-white" />
                        </div>
                        <h3 className="text-xl font-black tracking-tight">AIからの学習アドバイス</h3>
                    </div>
                    <p className="text-slate-400 font-bold leading-relaxed">
                        この分野は試験での配点が高く、基礎を固めることが合格への近道です。
                        まずはフラッシュカードで用語を完全に覚え、その後にまとめノートの理論を理解しましょう。
                        準備ができたらクイズに挑戦して、アウトプットを行いましょう。
                    </p>
                    <Link href={`/quiz/${categoryData.category}`} className="inline-block">
                        <button className={`flex items-center gap-3 px-8 py-4 ${theme.primaryBg} text-white rounded-full font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all active:scale-95`}>
                            この分野のクイズに挑戦
                            <ChevronRight size={16} />
                        </button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
