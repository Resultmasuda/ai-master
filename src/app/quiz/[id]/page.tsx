'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import {
    ChevronLeft,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Sparkles,
    Lightbulb,
    Zap,
    TrendingUp,
    BookOpen,
    Layers,
    Target
} from 'lucide-react';
import questionsData from '@/data/questions.json';
import { useUserStore } from '@/lib/store/userStore';

interface Option {
    debit: string;
    credit: string;
}

interface Question {
    id: string;
    grade: number;
    category: string;
    tag: string;
    question: string;
    options: Option[];
    answerIndex: number;
    explanation: string;
}

export default function QuizPage() {
    const router = useRouter();
    const params = useParams();
    const { addXp } = useUserStore();

    // Determine category/grade from ID
    const filteredQuestions = useMemo(() => {
        const id = params?.id as string;
        let baseQuestions: Question[] = [];

        if (id === 'all') {
            baseQuestions = [...questionsData] as Question[];
        } else if (id === '3') {
            baseQuestions = (questionsData as Question[]).filter(q => q.grade === 3);
        } else if (id === '2') {
            baseQuestions = (questionsData as Question[]).filter(q => q.grade === 2);
        } else {
            baseQuestions = (questionsData as Question[]).filter(q =>
                q.category.toLowerCase().includes(id.toLowerCase()) ||
                q.tag.toLowerCase().includes(id.toLowerCase())
            );
        }

        // Shuffle questions
        const shuffled = [...baseQuestions].sort(() => Math.random() - 0.5);

        // Take first 10
        const sessionQuestions = shuffled.slice(0, 10);

        // Shuffle options for each question
        return sessionQuestions.map(q => {
            const optionsWithOriginalIndex = q.options.map((opt, idx) => ({ ...opt, originalIndex: idx }));
            const shuffledOptions = [...optionsWithOriginalIndex].sort(() => Math.random() - 0.5);
            const correctOptionIdx = shuffledOptions.findIndex(opt => opt.originalIndex === q.answerIndex);

            return {
                ...q,
                options: shuffledOptions.map(({ originalIndex, ...opt }) => opt),
                answerIndex: correctOptionIdx
            };
        });
    }, [params?.id]);

    // If no questions match, or data is empty
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [xpGained, setXpGained] = useState(0);
    const [showLevelUp, setShowLevelUp] = useState(false);

    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const totalQuestions = filteredQuestions.length;

    const handleSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption === null || isAnswered || !currentQuestion) return;
        setIsAnswered(true);
        if (selectedOption === currentQuestion.answerIndex) {
            setScore(prev => prev + 1);
            const { leveledUp } = addXp(10, currentQuestion.category.toLowerCase());
            setXpGained(10);
            if (leveledUp) setShowLevelUp(true);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setXpGained(0);
        } else {
            setIsFinished(true);
        }
    };

    if (totalQuestions === 0) {
        return (
            <div className="min-h-screen bg-gray-50 text-slate-900 flex items-center justify-center p-6">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <BookOpen size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black">問題が見つかりません</h2>
                        <p className="text-slate-500 font-bold">他のカテゴリーや級を試してください。</p>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black text-sm"
                    >
                        ダッシュボードに戻る
                    </button>
                </div>
            </div>
        )
    }

    if (isFinished) {
        return (
            <div className="min-h-screen bg-gray-50 text-slate-900 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-8"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full"></div>
                        <CheckCircle2 size={80} className="text-emerald-500 relative z-10 mx-auto" strokeWidth={1.5} />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">お疲れ様でした！</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">セッション完了</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">習得結果</div>
                        <div className="text-6xl font-black tracking-tighter tabular-nums text-slate-900">
                            {Math.round((score / totalQuestions) * 100)}<span className="text-2xl text-slate-300 ml-1">%</span>
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-100 flex justify-around">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">正解数</p>
                                <p className="text-2xl font-black text-slate-900">{score} / {totalQuestions}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">獲得ポイント</p>
                                <p className="text-2xl font-black text-emerald-600">+{score * 10}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 hover:bg-slate-800 active:scale-95 group"
                    >
                        ダッシュボードに戻る
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 text-slate-900 p-4 md:p-8 flex items-center justify-center">
            {/* Level Up Modal */}
            <AnimatePresence>
                {showLevelUp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-emerald-500/10 backdrop-blur-md"
                        onClick={() => setShowLevelUp(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-4 border-emerald-500 text-center space-y-6 max-w-sm pointer-events-auto"
                        >
                            <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto animate-bounce shadow-xl shadow-emerald-500/20">
                                <TrendingUp size={48} strokeWidth={3} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">レベルアップ！</h3>
                                <p className="text-emerald-600 font-black text-sm uppercase tracking-widest">AI習得レベルが上昇しました</p>
                            </div>
                            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">トレーニングを続ける</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="max-w-4xl w-full space-y-8 pb-32">
                {/* Header */}
                <div className="flex items-center justify-between bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/')}
                            className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">トレーニングセッション</p>
                            <h1 className="text-sm font-black text-slate-800">仕訳トレーニング / Journaling</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">問題</p>
                            <p className="text-sm font-black text-emerald-600">{currentQuestionIndex + 1} / {totalQuestions}</p>
                        </div>
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Question Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                <Lightbulb size={120} />
                            </div>
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-widest">
                                        {currentQuestion.grade}級
                                    </span>
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-lg uppercase tracking-widest">
                                        {currentQuestion.category}
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                                    {currentQuestion.question}
                                </h2>
                            </div>
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            {currentQuestion.options.map((option, index) => {
                                const isCorrect = index === currentQuestion.answerIndex;
                                const isSelected = selectedOption === index;

                                let style = "bg-white border-slate-100 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/50 hover:shadow-lg hover:shadow-emerald-500/5";
                                if (isAnswered) {
                                    if (isCorrect) {
                                        style = "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xl shadow-emerald-500/10";
                                    } else if (isSelected) {
                                        style = "bg-rose-50 border-rose-500 text-rose-900";
                                    } else {
                                        style = "bg-white border-slate-50 text-slate-300 pointer-events-none";
                                    }
                                } else if (isSelected) {
                                    style = "bg-emerald-50 border-emerald-500 text-emerald-900 ring-4 ring-emerald-500/10 shadow-xl shadow-emerald-500/5";
                                }

                                return (
                                    <button
                                        key={index}
                                        disabled={isAnswered}
                                        onClick={() => handleSelect(index)}
                                        className={`group relative w-full text-left p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-300 ${style}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="grid grid-cols-2 gap-8 md:gap-12">
                                                    <div>
                                                        <p className={`text-[10px] font-black uppercase mb-1 tracking-widest ${isAnswered && isCorrect ? 'text-emerald-600' : 'text-slate-400'}`}>借方</p>
                                                        <p className="font-black text-lg md:text-xl tracking-tight">{option.debit}</p>
                                                    </div>
                                                    <div>
                                                        <p className={`text-[10px] font-black uppercase mb-1 tracking-widest ${isAnswered && isCorrect ? 'text-emerald-600' : 'text-slate-400'}`}>貸方</p>
                                                        <p className="font-black text-lg md:text-xl tracking-tight">{option.credit}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ml-6 flex items-center justify-center">
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all ${isAnswered
                                                    ? (isCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : (isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'bg-gray-50 border-gray-100'))
                                                    : (isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-100 group-hover:border-emerald-300')
                                                    }`}>
                                                    {isAnswered ? (
                                                        isCorrect ? <CheckCircle2 size={24} strokeWidth={2.5} /> : (isSelected ? <XCircle size={24} strokeWidth={2.5} /> : null)
                                                    ) : (
                                                        <span className="font-black text-sm">{index + 1}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Footer Feedback Panel */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 p-6 md:p-8 z-50">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1 w-full">
                            <AnimatePresence mode="wait">
                                {isAnswered ? (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex gap-4 items-start"
                                    >
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${xpGained > 0 ? 'bg-emerald-500/20' : 'bg-slate-100'}`}>
                                            {xpGained > 0 ? <Zap size={20} className="text-emerald-600" /> : <Lightbulb size={20} className="text-slate-400" />}
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <div className="flex justify-between items-center">
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${xpGained > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                    {xpGained > 0 ? `正解！ +${xpGained} XP 獲得` : 'AI解説'}
                                                </p>
                                                {xpGained > 0 && (
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full"
                                                    >
                                                        成長の火花
                                                    </motion.span>
                                                )}
                                            </div>
                                            <p className="text-sm font-bold text-slate-700 leading-relaxed max-w-2xl">
                                                {currentQuestion.explanation}
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="hidden md:flex flex-col">
                                        <p className="text-xl font-black text-slate-900">正しい仕訳を選択してください</p>
                                        <p className="text-slate-400 font-bold text-sm">取引内容を慎重に確認してください。</p>
                                    </div>
                                )
                                }
                            </AnimatePresence>
                        </div>
                        <div className="w-full md:w-auto shrink-0">
                            {!isAnswered ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={selectedOption === null}
                                    className="w-full md:w-64 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-20 active:scale-95"
                                >
                                    回答する
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="w-full md:w-64 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/10 hover:bg-emerald-500 active:scale-95 flex items-center justify-center gap-2 group"
                                >
                                    {currentQuestionIndex < totalQuestions - 1 ? '次の問題へ' : '結果を見る'}
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
