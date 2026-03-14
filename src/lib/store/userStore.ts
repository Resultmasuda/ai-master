'use client';

import { useState, useEffect } from 'react';

export type Subject = 'BOKI' | 'FP';

export interface SubjectProgress {
    xp: number;
    level: number;
    mastery: Record<string, number>;
    masteryByTag: Record<string, number>;
}

export interface UserProfile {
    subjects: Record<Subject, SubjectProgress>;
    activeSubject: Subject;
    streak: number;
    lastActiveDate: string | null;
    bookmarkedQuestions: string[];
    revealedBlanks: string[];
}

const STORAGE_KEY = 'certification_master_profile';

const INITIAL_SUBJECT_PROGRESS: Record<Subject, SubjectProgress> = {
    BOKI: {
        xp: 0,
        level: 1,
        mastery: { 'grade-3': 0, 'grade-2': 0, 'accounts': 0, 'all': 0 },
        masteryByTag: {}
    },
    FP: {
        xp: 0,
        level: 1,
        mastery: {
            'ライフプランニングと資金計画': 0,
            'リスク管理': 0,
            'タックスプランニング': 0,
            '金融資産運用': 0,
            '不動産': 0,
            '相続・事業承継': 0,
            'all': 0
        },
        masteryByTag: {}
    }
};

const INITIAL_PROFILE: UserProfile = {
    subjects: INITIAL_SUBJECT_PROGRESS,
    activeSubject: 'BOKI',
    streak: 0,
    lastActiveDate: null,
    bookmarkedQuestions: [],
    revealedBlanks: [],
};

export function useUserStore() {
    const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Simple migration check
                if (!parsed.subjects) {
                    // Migrate old boki data if it exists
                    const bokiSaved = localStorage.getItem('boki_user_profile');
                    if (bokiSaved) {
                        const bokiData = JSON.parse(bokiSaved);
                        parsed.subjects = {
                            ...INITIAL_SUBJECT_PROGRESS,
                            BOKI: {
                                xp: bokiData.xp || 0,
                                level: bokiData.level || 1,
                                mastery: bokiData.mastery || INITIAL_SUBJECT_PROGRESS.BOKI.mastery,
                                masteryByTag: bokiData.masteryByTag || {}
                            }
                        };
                        parsed.activeSubject = 'BOKI';
                    } else {
                        parsed.subjects = INITIAL_SUBJECT_PROGRESS;
                        parsed.activeSubject = 'BOKI';
                    }
                }

                // Ensure new fields exist for existing users
                if (!parsed.bookmarkedQuestions) {
                    parsed.bookmarkedQuestions = [];
                }
                if (!parsed.revealedBlanks) {
                    parsed.revealedBlanks = [];
                }

                setProfile(parsed);
            } catch (e) {
                console.error('Failed to parse user profile', e);
            }
        }
        setIsLoaded(true);
    }, []);
    const saveProfile = (newProfile: UserProfile) => {
        setProfile(newProfile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    };

    const activeProgress = profile.subjects[profile.activeSubject];

    const setActiveSubject = (subject: Subject) => {
        saveProfile({ ...profile, activeSubject: subject });
    };

    const toggleBookmark = (questionId: string) => {
        const bookmarks = profile.bookmarkedQuestions || [];
        const isBookmarked = bookmarks.includes(questionId);

        saveProfile({
            ...profile,
            bookmarkedQuestions: isBookmarked
                ? bookmarks.filter(id => id !== questionId)
                : [...bookmarks, questionId]
        });
    };

    const toggleRevealedBlank = (blankId: string, forceState?: boolean) => {
        const blanks = profile.revealedBlanks || [];
        const isRevealed = blanks.includes(blankId);

        let newBlanks;
        if (forceState === true && !isRevealed) {
            newBlanks = [...blanks, blankId];
        } else if (forceState === false && isRevealed) {
            newBlanks = blanks.filter(id => id !== blankId);
        } else if (forceState === undefined) {
            newBlanks = isRevealed
                ? blanks.filter(id => id !== blankId)
                : [...blanks, blankId];
        } else {
            return; // no change needed
        }

        saveProfile({
            ...profile,
            revealedBlanks: newBlanks
        });
    };

    const resetRevealedBlanks = (prefix: string) => {
        const blanks = profile.revealedBlanks || [];
        saveProfile({
            ...profile,
            revealedBlanks: blanks.filter(id => !id.startsWith(prefix))
        });
    };

    const addXp = (amount: number, grade?: string | number, tag?: string) => {
        const newProfile = { ...profile };
        const currentProgress = { ...newProfile.subjects[profile.activeSubject] };

        currentProgress.xp += amount;

        // Mastery update by grade/category
        if (grade) {
            const gradeKey = String(grade);
            currentProgress.mastery[gradeKey] = Math.min(100, (currentProgress.mastery[gradeKey] || 0) + (amount / 10));
            currentProgress.mastery['all'] = Math.min(100, (currentProgress.mastery['all'] || 0) + (amount / 50));
        }

        // Mastery update by tag
        if (tag) {
            currentProgress.masteryByTag[tag] = Math.min(100, (currentProgress.masteryByTag[tag] || 0) + (amount / 5));
        }

        // Level up logic
        const newLevel = Math.floor(Math.sqrt(currentProgress.xp / 50)) + 1;
        const leveledUp = newLevel > currentProgress.level;
        currentProgress.level = newLevel;

        newProfile.subjects[profile.activeSubject] = currentProgress;
        saveProfile(newProfile);
        return { leveledUp };
    };

    const updateStreak = () => {
        const today = new Date().toISOString().split('T')[0];
        if (profile.lastActiveDate === today) return;

        const newProfile = { ...profile, lastActiveDate: today };

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (profile.lastActiveDate === yesterdayStr) {
            newProfile.streak += 1;
        } else {
            newProfile.streak = 1;
        }

        saveProfile(newProfile);
    };

    const getXpForNextLevel = () => {
        return Math.pow(activeProgress.level, 2) * 50;
    };

    const getXpForCurrentLevel = () => {
        return Math.pow(activeProgress.level - 1, 2) * 50;
    };

    const getProgressToNextLevel = () => {
        const current = getXpForCurrentLevel();
        const next = getXpForNextLevel();
        if (next === current) return 0;
        return ((activeProgress.xp - current) / (next - current)) * 100;
    };

    const getTotalMastery = () => {
        const values = Object.values(activeProgress.mastery);
        if (values.length === 0) return 0;
        const sum = values.reduce((a: number, b: number) => a + b, 0);
        return Math.round(sum / values.length);
    };

    const getWeakPoints = (limit = 2) => {
        return Object.entries(activeProgress.masteryByTag)
            .sort(([, a], [, b]) => a - b)
            .slice(0, limit)
            .map(([tag]) => tag);
    };

    const resetProfile = () => {
        const newProfile = { ...profile };
        const subject = profile.activeSubject as Subject;
        newProfile.subjects[subject] = INITIAL_SUBJECT_PROGRESS[subject];
        saveProfile(newProfile);
    };

    return {
        profile,
        activeProgress,
        activeSubject: profile.activeSubject,
        setActiveSubject,
        isLoaded,
        addXp,
        updateStreak,
        getProgressToNextLevel,
        getXpForNextLevel,
        getXpForCurrentLevel,
        getTotalMastery,
        getWeakPoints,
        resetProfile,
        toggleBookmark,
        toggleRevealedBlank,
        resetRevealedBlanks,
        bookmarkedQuestions: profile.bookmarkedQuestions || [],
        revealedBlanks: profile.revealedBlanks || []
    };
}
