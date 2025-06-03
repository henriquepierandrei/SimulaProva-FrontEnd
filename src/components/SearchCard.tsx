import React, { useState } from 'react';
import { Search, Send, Moon, Sun, Sparkles, MessageCircle } from 'lucide-react';
import './SearchCard.css';

function SearchCard() {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? JSON.parse(savedTheme) : false;
    });
    const [question, setQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleTheme = () => {
        const newTheme = !isDark;
        localStorage.setItem('theme', JSON.stringify(newTheme));
        setIsDark(newTheme);
    };

    const handleSubmit = async (e: React.FormEvent | null) => {
        if (e) e.preventDefault();
        if (!question.trim()) return;

        setIsLoading(true);
        // Aqui você fará a requisição para sua API
        // Exemplo: const response = await fetch('/api/ask', { method: 'POST', body: JSON.stringify({ question }) });
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className={`main-container ${isDark ? 'dark' : 'light'}`}>
            <div className="card-wrapper">
                <div className={`search-card ${isDark ? 'card-dark' : 'card-light'}`}>

                    {/* Header */}
                    <div className={`card-header ${isDark ? 'header-dark' : 'header-light'}`}>
                        <div className="header-content">
                            <div className="title-section">
                                <div className={`icon-container ${isDark ? 'icon-dark' : 'icon-light'}`}>
                                    <Sparkles className="header-icon" />
                                </div>
                                <div className="title-text">
                                    <h1 className={`main-title ${isDark ? 'text-light' : 'text-dark'}`}>
                                        AI Assistant
                                    </h1>
                                    <p className={`subtitle ${isDark ? 'subtitle-dark' : 'subtitle-light'}`}>
                                        Faça uma pergunta e receba questões de prova personalizadas
                                    </p>
                                </div>
                            </div>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className={`theme-toggle ${isDark ? 'toggle-dark' : 'toggle-light'}`}
                            >
                                {isDark ? <Sun className="toggle-icon" /> : <Moon className="toggle-icon" />}
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="card-content">
                        <div className="input-section">

                            {/* Question Input */}
                            <div className="input-wrapper">
                                <div className={`input-container ${isDark ? 'input-dark' : 'input-light'}`}>
                                    <MessageCircle className={`input-icon ${isDark ? 'icon-gray-dark' : 'icon-gray-light'}`} />
                                    <input
                                        type="text"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                                        placeholder="Digite sua pergunta aqui..."
                                        className={`question-input ${isDark ? 'input-text-dark' : 'input-text-light'}`}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={!question.trim() || isLoading}
                                className={`submit-button ${isDark ? 'button-dark' : 'button-light'} ${(!question.trim() || isLoading) ? 'button-disabled' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="loading-spinner" />
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        <Send className="button-icon" />
                                        Fazer Pergunta
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Features */}
                        <div className="features-grid">
                            <div className={`feature-card ${isDark ? 'feature-dark' : 'feature-light'}`}>
                                <div className="feature-emoji">🚀</div>
                                <h3 className={`feature-title ${isDark ? 'text-light' : 'text-dark'}`}>
                                    Rápido
                                </h3>
                                <p className={`feature-desc ${isDark ? 'subtitle-dark' : 'subtitle-light'}`}>
                                    Respostas em segundos
                                </p>
                            </div>

                            <div className={`feature-card ${isDark ? 'feature-dark' : 'feature-light'}`}>
                                <div className="feature-emoji">🎯</div>
                                <h3 className={`feature-title ${isDark ? 'text-light' : 'text-dark'}`}>
                                    Preciso
                                </h3>
                                <p className={`feature-desc ${isDark ? 'subtitle-dark' : 'subtitle-light'}`}>
                                    IA treinada e atualizada
                                </p>
                            </div>

                            <div className={`feature-card ${isDark ? 'feature-dark' : 'feature-light'}`}>
                                <div className="feature-emoji">💡</div>
                                <h3 className={`feature-title ${isDark ? 'text-light' : 'text-dark'}`}>
                                    Inteligente
                                </h3>
                                <p className={`feature-desc ${isDark ? 'subtitle-dark' : 'subtitle-light'}`}>
                                    Compreende contexto
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="decoration-top" />
                    <div className="decoration-bottom" />
                </div>
            </div>
        </div>
    );
}

export default SearchCard;