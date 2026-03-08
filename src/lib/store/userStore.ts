'use client';

import { useState, useEffect } from 'react';

export interface UserProfile {
    xp: number;
    level: number;
    streak: number;
    lastActiveDate: string | null;
    mastery: Record<string, number>; // Category ID -> Mastery Points
}

const STORAGE_KEY = 'boki_user_profile';

const INITIAL_PROFILE: UserProfile = {
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    mastery: {
        'journaling': 0,
        'inventory': 0,
        'fixed_assets': 0,
        'tax': 0
    }
};

export function useUserStore() {
    const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setProfile(JSON.parse(saved));
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

    const addXp = (amount: number, categoryId?: string) => {
        const newProfile = { ...profile };
        newProfile.xp += amount;

        // Mastery update
        if (categoryId) {
            newProfile.mastery[categoryId] = (newProfile.mastery[categoryId] || 0) + (amount / 2);
        }

        // Level up logic: Level = 1 + floor(sqrt(XP / 50))
        const newLevel = Math.floor(Math.sqrt(newProfile.xp / 50)) + 1;
        if (newLevel > newProfile.level) {
            newProfile.level = newLevel;
            // Level up trigger could be added here
        }

        saveProfile(newProfile);
        return { leveledUp: newLevel > profile.level };
    };

    const updateStreak = () => {
        const today = new Date().toISOString().split('T')[0];
        if (profile.lastActiveDate === today) return;

        const newProfile = { ...profile, lastActiveDate: today };

        // Check if yesterday was active
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
        return Math.pow(profile.level, 2) * 50;
    };

    const getXpForCurrentLevel = () => {
        return Math.pow(profile.level - 1, 2) * 50;
    };

    const getProgressToNextLevel = () => {
        const current = getXpForCurrentLevel();
        const next = getXpForNextLevel();
        return ((profile.xp - current) / (next - current)) * 100;
    };

    return {
        profile,
        isLoaded,
        addXp,
        updateStreak,
        getProgressToNextLevel,
        getXpForNextLevel,
        getXpForCurrentLevel
    };
}
