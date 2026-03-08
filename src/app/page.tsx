"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Brain, ChevronRight, ArrowRight, Star, Target, Zap, LayoutGrid, Layers, BarChart3, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/lib/store/userStore';

export default function Dashboard() {
  const { profile, getProgressToNextLevel, getXpForNextLevel, updateStreak, isLoaded } = useUserStore();

  useEffect(() => {
    if (isLoaded) updateStreak();
  }, [isLoaded]);

  const categories = [
    { title: "3級 / Grade 3", progress: 0, color: "from-emerald-400 to-teal-500", icon: <BookOpen size={20} />, id: "3" },
    { title: "2級 / Grade 2", progress: 0, color: "from-blue-400 to-indigo-500", icon: <Target size={20} />, id: "2" },
    { title: "勘定科目 / Accounts", progress: 0, color: "from-amber-400 to-orange-500", icon: <Layers size={20} />, id: "accounts" },
    { title: "すべて / All", progress: 0, color: "from-rose-400 to-pink-500", icon: <Zap size={20} />, id: "all" },
  ];

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-12 bg-gray-50 text-slate-900">
      {/* Hero Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-emerald-400 font-black tracking-[0.3em] uppercase text-[10px]"
          >
            <Star size={14} /> AI パーソナルトレーナー
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter"
          >
            Boki Master<span className="text-emerald-600">.</span>
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
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">AIマスターレベル</p>
                <p className="text-2xl font-black text-slate-900 leading-none">Lv. {profile.level}</p>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                {profile.xp} / {getXpForNextLevel()} XP
              </p>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgressToNextLevel()}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-white border border-slate-200 rounded-[2rem] px-6 py-4 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Flame size={24} strokeWidth={3} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">継続日数</p>
                <p className="text-xl font-black text-slate-800">{profile.streak} 日</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-[2rem] px-6 py-4 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Brain size={24} strokeWidth={3} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">習得ステータス</p>
                <p className="text-xl font-black text-slate-800">上級者</p>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* AI Analysis Card */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative group overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-700 rounded-[2.5rem] p-1 shadow-2xl shadow-emerald-500/10"
      >
        <div className="bg-white rounded-[2.4rem] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Brain size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">AI 苦手分析レポート</h2>
            </div>

            <p className="text-slate-500 font-bold leading-relaxed text-lg">
              現在の分析結果では、<span className="text-emerald-600 font-black">「有価証券の時価評価」</span>と<span className="text-amber-600 font-black">「固定資産の減価償却（間接法）」</span>において正答率が低下しています。本日は重点的にこの分野を解くことをお勧めします。
            </p>

            <Link href="/quiz/all">
              <button className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-emerald-500/20">
                分析を再開する
                <ChevronRight size={18} strokeWidth={3} />
              </button>
            </Link>
          </div>

          <div className="w-full lg:w-[400px] aspect-square relative flex items-center justify-center">
            {/* Mock Chart Visualization */}
            <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-[100px]"></div>
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="url(#emerald-gradient)" strokeWidth="8" strokeDasharray="251" strokeDashoffset="60" strokeLinecap="round" className="animate-pulse" />
              <defs>
                <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <p className="text-6xl font-black text-slate-900">76<span className="text-xl text-emerald-500">%</span></p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">総合習得スコア</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Growth Map */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <LayoutGrid className="text-emerald-500" />
              Growth Map
            </h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">AIスキルを育成する</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link key={idx} href={`/quiz/${cat.id}`} className="block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className="group relative bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-emerald-500/30 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 h-full"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 tracking-tight">{cat.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">トレーニングモジュール</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">習得度</span>
                      <span className="text-emerald-600">{profile.mastery[cat.id] || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${profile.mastery[cat.id] || 0}%` }}
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
            <Zap size={24} className="text-amber-500" />
            <h3 className="text-xl font-black text-slate-900 leading-none">デイリークエスト</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black text-xs italic">Q1</div>
                <div>
                  <p className="text-sm font-black text-slate-800">仕訳5問クリア / Solve 5 Journalings</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">+50 XP / +10 GEM</p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-black text-xs italic">Q2</div>
                <div>
                  <p className="text-sm font-black text-slate-800">苦手分野の復習 / Review Weak Points</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">+100 XP</p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 size={24} className="text-indigo-500" />
            <h3 className="text-xl font-black text-slate-900 leading-none">Growth Journey</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-slate-500">Weekly Achievement Goal</span>
              <span className="text-sm font-black text-slate-900">85% Achieved</span>
            </div>
            <div className="relative h-12 flex items-end gap-1.5">
              {[30, 45, 60, 40, 70, 55, 80, 50, 65, 90].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className={`w-full rounded-t-md ${i === 9 ? 'bg-emerald-500' : 'bg-indigo-100'}`}
                  />
                  <span className="text-[8px] font-black text-slate-300">Mon</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 font-bold text-center italic">"You've shown consistent growth this week. Keep nurturing your knowledge!"</p>
          </div>
        </div>
      </section>
    </main>
  );
}
