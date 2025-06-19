
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FormCache {
    [key: string]: Record<string, any>;
}

interface FormCacheContextType {
    getFormData: (formId: string) => Record<string, any> | null;
    setFormData: (formId: string, data: Record<string, any>) => void;
    clearFormData: (formId: string) => void;
}

const FormCacheContext = createContext<FormCacheContextType | null>(null);

export const useFormCache = () => {
    const context = useContext(FormCacheContext);
    if (!context) {
        throw new Error('useFormCache must be used within FormCacheProvider');
    }
    return context;
};

interface FormCacheProviderProps {
    children: ReactNode;
}

export const FormCacheProvider = ({ children }: FormCacheProviderProps) => {
    const [cache, setCache] = useState<FormCache>(() => {
        // Initialize from sessionStorage on mount
        try {
            const stored = sessionStorage.getItem('formCache');
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    });

    // Sync cache to sessionStorage whenever it changes
    useEffect(() => {
        try {
            sessionStorage.setItem('formCache', JSON.stringify(cache));
        } catch {
            // Ignore sessionStorage errors (private mode, etc.)
        }
    }, [cache]);

    const getFormData = (formId: string) => cache[formId] || null;

    const setFormData = (formId: string, data: Record<string, any>) => {
        setCache(prev => ({ ...prev, [formId]: data }));
    };

    const clearFormData = (formId: string) => {
        setCache(prev => {
            const { [formId]: _, ...rest } = prev;
            return rest;
        });
    };

    return (
        <FormCacheContext.Provider value={{ getFormData, setFormData, clearFormData }}>
            {children}
        </FormCacheContext.Provider>
    );
};