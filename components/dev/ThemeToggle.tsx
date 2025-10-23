'use client';
import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Detectar modo inicial
        const html = document.documentElement;
        setIsDark(html.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        const html = document.documentElement;
        html.classList.toggle('dark');
        setIsDark(html.classList.contains('dark'));
    };

    return (
        <button
        onClick={toggleTheme}
        style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 2000,
            background: isDark ? '#333' : '#ddd',
            color: isDark ? '#fff' : '#000',
            border: 'none',
            borderRadius: 50,
            padding: '12px 16px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
        >
        {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
    );
}
