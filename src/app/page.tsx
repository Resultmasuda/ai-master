"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Target,
  Zap,
  Brain,
  ChevronRight,
  Layers,
  Trophy,
  Flame,
  BarChart3,
  LayoutGrid,
  AlertTriangle,
  GraduationCap,
  Star,
  Bookmark
} from 'lucide-react';
import Link from 'next/link';
import { useUserStore, Subject } from '@/lib/store/userStore';

export default function Dashboard() {
  const {
    profile,
    activeProgress,
    activeSubject,
    setActiveSubject,
    getProgressToNextLevel,
    getXpForNextLevel,
    updateStreak,
    isLoaded,
    getTotalMastery,
    getWeakPoints,
    resetProfile,
    bookmarkedQuestions
  } = useUserStore();

  useEffect(() => {
    if (isLoaded) updateStreak();
  }, [isLoaded]);

  const weakPoints = getWeakPoints();
  const totalMastery = getTotalMastery();

  // Dynamic Theme Mapping
  const theme = {
    BOKI: {
      name: "Boki Master",
      primary: "emerald",
      primaryBg: "bg-emerald-500",
      primaryText: "text-emerald-400",
      primaryGradient: "from-emerald-500 to-teal-700",
      accent: "teal",
      tag: "AI 簿記マスター"
    },
    FP: {
      name: "FP Master",
      primary: "amber",
      primaryBg: "bg-amber-500",
      primaryText: "text-amber-400",
      primaryGradient: "from-amber-500 to-orange-700",
      accent: "orange",
      tag: "AI FP認定トレーナー"
    }
  }[activeSubject];

  const categories = activeSubject === 'BOKI' ? [
    { title: "3級対策", progress: activeProgress.mastery['grade-3'] || 0, color: "from-emerald-400 to-teal-500", icon: <BookOpen size={20} />, id: "grade-3" },
    { title: "2級対策", progress: activeProgress.mastery['grade-2'] || 0, color: "from-blue-400 to-indigo-500", icon: <Target size={20} />, id: "grade-2" },
    { title: "勘定科目マスタ", progress: activeProgress.mastery['journaling'] || 0, color: "from-amber-400 to-orange-500", icon: <Layers size={20} />, id: "journaling" },
    { title: "すべての問題", progress: activeProgress.mastery['all'] || 0, color: "from-rose-400 to-pink-500", icon: <Zap size={20} />, id: "all" },
  ] : [
    { title: "ライフプランニング", progress: activeProgress.mastery['life-planning'] || 0, color: "from-amber-400 to-orange-500", icon: <BookOpen size={20} />, id: "life-planning" },
    { title: "リスク管理", progress: activeProgress.mastery['risk-management'] || 0, color: "from-rose-400 to-pink-500", icon: <Zap size={20} />, id: "risk-management" },
    { title: "金融資産運用", progress: activeProgress.mastery['asset-management'] || 0, color: "from-blue-400 to-indigo-500", icon: <Target size={20} />, id: "asset-management" },
    { title: "タックスプランニング", progress: activeProgress.mastery['taxation'] || 0, color: "from-emerald-400 to-teal-500", icon: <Layers size={20} />, id: "taxation" },
    { title: "不動産", progress: activeProgress.mastery['real-estate'] || 0, color: "from-purple-400 to-fuchsia-500", icon: <LayoutGrid size={20} />, id: "real-estate" },
    { title: "相続・事業承継", progress: activeProgress.mastery['inheritance'] || 0, color: "from-slate-400 to-slate-500", icon: <BarChart3 size={20} />, id: "inheritance" },
    { title: "すべての問題", progress: activeProgress.mastery['all'] || 0, color: "from-indigo-400 to-blue-500", icon: <Zap size={20} />, id: "all" },
  ];

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-12 bg-gray-50 text-slate-900 font-sans">
      {/* Subject Switcher Header */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex gap-1">
          {(['BOKI', 'FP'] as Subject[]).map((subj) => (
            <button
              key={subj}
              onClick={() => setActiveSubject(subj)}
              className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeSubject === subj
                ? (subj === 'BOKI' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20')
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
        <div className="space-y-2">
          <motion.div
            key={`${activeSubject}-tag`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 ${theme.primaryText} font-black tracking-[0.3em] uppercase text-[10px]`}
          >
            <Star size={14} /> {theme.tag}
          </motion.div>
          <motion.h1
            key={`${activeSubject}-title`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter"
          >
            {theme.name.split(' ')[0]} <span className={`text-${theme.primary}-500`}>{theme.name.split(' ')[1]}</span><span className={`text-${theme.primary}-600`}>.</span>
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          {/* Level Progress Bar */}
          <div className="bg-white border border-slate-200 rounded-3xl px-6 py-4 flex flex-col gap-2 min-w-[240px] shadow-sm">
            <div className="flex justify-between items-end">
              <div>
                <p className={`text-[10px] font-black text-${theme.primary}-600 uppercase tracking-widest leading-none mb-1`}>AIマスターレベル</p>
                <p className="text-2xl font-black text-slate-900 leading-none">Lv. {activeProgress.level}</p>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                {activeProgress.xp} / {getXpForNextLevel()} XP
              </p>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgressToNextLevel()}%` }}
                className={`h-full bg-gradient-to-r from-${theme.primary}-500 to-${theme.accent}-500 rounded-full`}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-white border border-slate-200 rounded-[2rem] px-6 py-4 flex items-center gap-4 shadow-sm">
              <div className={`w-10 h-10 rounded-full bg-${theme.primary}-100 flex items-center justify-center text-${theme.primary}-600`}>
                <Flame size={24} strokeWidth={3} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">継続日数</p>
                <p className="text-xl font-black text-slate-800">{profile.streak} 日</p>
              </div>
            </div>

            <Link href="/study">
              <button className={`bg-white border-2 border-slate-200 rounded-[2rem] px-8 py-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-all group active:scale-95`}>
                <div className={`w-8 h-8 rounded-xl ${theme.primaryBg} flex items-center justify-center text-white`}>
                  <GraduationCap size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">暗記・学習</p>
                  <p className="text-sm font-black text-slate-800">AI学習室へ</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </motion.div>
      </header>

      {/* AI Analysis Card */}
      <motion.section
        key={`${activeSubject}-analysis`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`relative group overflow-hidden bg-gradient-to-br ${theme.primaryGradient} rounded-[2.5rem] p-1 shadow-2xl shadow-${theme.primary}-500/10`}
      >
        <div className="bg-white rounded-[2.4rem] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl ${theme.primaryBg} flex items-center justify-center shadow-lg shadow-${theme.primary}-500/20`}>
                <Brain size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">AI 苦手分析レポート</h2>
            </div>

            <p className="text-slate-500 font-bold leading-relaxed text-lg">
              {weakPoints.length > 0 ? (
                <>
                  現在の分析結果では、
                  {weakPoints.map((tag: string, i: number) => (
                    <React.Fragment key={tag}>
                      <span className={`text-${theme.primary}-600 font-black`}>「{tag}」</span>
                      {i < weakPoints.length - 1 && "と"}
                    </React.Fragment>
                  ))}
                  において正答率が低下しています。本日は重点的にこの分野を解くことをお勧めします。
                </>
              ) : (
                "十分なデータが集まっていません。クイズを解いてAI分析を有効にしましょう！"
              )}
            </p>

            <Link href="/quiz/all">
              <button className={`flex items-center gap-3 px-8 py-4 ${theme.primaryBg} text-white rounded-full font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-${theme.primary}-500/20`}>
                分析を再開する
                <ChevronRight size={18} strokeWidth={3} />
              </button>
            </Link>
          </div>

          <div className="w-full lg:w-[400px] aspect-square relative flex items-center justify-center">
            <div className={`absolute inset-0 bg-${theme.primary}-500/5 rounded-full blur-[100px]`}></div>
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="8" />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={`url(#${activeSubject}-gradient)`}
                strokeWidth="8"
                strokeDasharray="251"
                initial={{ strokeDashoffset: 251 }}
                animate={{ strokeDashoffset: 251 - (251 * totalMastery / 100) }}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id={`${activeSubject}-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={activeSubject === 'BOKI' ? '#10b981' : '#f59e0b'} />
                  <stop offset="100%" stopColor={activeSubject === 'BOKI' ? '#06b6d4' : '#ea580c'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <p className="text-6xl font-black text-slate-900">{totalMastery}<span className={`text-xl text-${theme.primary}-500`}>%</span></p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">総合習得スコア</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Review Section */}
      {bookmarkedQuestions && bookmarkedQuestions.length > 0 && (
        <section className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="hidden md:flex w-16 h-16 bg-white border border-indigo-50 rounded-2xl shadow-sm text-indigo-500 items-center justify-center shrink-0">
                <Bookmark size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
                  <Bookmark size={24} className="md:hidden text-indigo-500" />
                  復習帳（ブックマーク）
                </h3>
                <p className="text-slate-500 font-bold text-sm">現在 <span className="text-indigo-600 font-black">{bookmarkedQuestions.length}</span> 問が登録されています。弱点をまとめて克服しましょう。</p>
              </div>
            </div>
            <Link href="/quiz/review" className="w-full md:w-auto shrink-0">
              <button className="w-full px-8 py-5 bg-indigo-600 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2 group">
                復習を開始する
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </section>
      )}

      {/* Growth Map */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <LayoutGrid className={`text-${theme.primary}-500`} />
              習得状況
            </h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">現在の能力値をグラフで確認</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link key={idx} href={`/quiz/${cat.id}`} className="block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className={`group relative bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-${theme.primary}-500/30 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-${theme.primary}-500/5 h-full`}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 tracking-tight">{cat.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">練習メニュー</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">習得度</span>
                      <span className={`text-${theme.primary}-600`}>{cat.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.progress}%` }}
                        className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Suggested Focus Areas */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Zap size={24} className={`text-${activeSubject === 'BOKI' ? 'emerald' : 'amber'}-500`} />
            <h3 className="text-xl font-black text-slate-900 leading-none">デイリークエスト</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${theme.primaryBg} flex items-center justify-center text-white font-black text-xs italic`}>Q1</div>
                <div>
                  <p className="text-sm font-black text-slate-800">{activeSubject === 'BOKI' ? '仕訳5問クリア' : '用語5問クリア'}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">+50 XP / +10 GEM</p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 size={24} className="text-indigo-500" />
            <h3 className="text-xl font-black text-slate-900 leading-none">成長のあゆみ</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-slate-500">週間の目標達成度</span>
              <span className="text-sm font-black text-slate-900">85% 達成</span>
            </div>
            <div className="relative h-12 flex items-end gap-1.5">
              {[30, 45, 60, 40, 70, 55, 80, 50, 65, 90].map((h, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (9 - i));
                const dayName = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      className={`w-full rounded-t-md ${i === 9 ? theme.primaryBg : 'bg-indigo-100'}`}
                    />
                    <span className="text-[8px] font-black text-slate-300">{dayName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone / Reset */}
      <section className="bg-rose-50 border border-rose-100 rounded-[2.5rem] p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-black text-rose-900">学習データの管理</h3>
            <p className="text-sm font-bold text-rose-600/70">{theme.name}の学習記録やレベルをすべて消去し、最初からやり直すことができます。</p>
          </div>
          <button
            onClick={() => {
              if (confirm('学習データをすべてリセットしますか？ (これまでの記録はすべて失われます)')) {
                resetProfile();
                window.location.reload();
              }
            }}
            className="px-8 py-4 bg-rose-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 shadow-xl shadow-rose-500/20 flex items-center gap-2"
          >
            <AlertTriangle size={18} />
            {activeSubject} の記録をリセット
          </button>
        </div>
      </section>

      <footer className="pt-12 pb-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400">
        <p className="text-[10px] font-bold uppercase tracking-widest">© 2026 Certification Master AI プロジェクト</p>
      </footer>
    </main>
  );
}
