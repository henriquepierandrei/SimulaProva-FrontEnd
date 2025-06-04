import React, { useState } from 'react';
import axios from 'axios';
import { FiTarget } from "react-icons/fi";
import { Send, Moon, Sun, Sparkles, MessageCircle, Lightbulb } from 'lucide-react';
import { AiFillRocket } from 'react-icons/ai';
import './SearchCard.css'; // Certifique-se de ter o CSS adequado para estilização
import ButtonPay from './ButtonPay';

// Interfaces
interface Question {
    pergunta: string;
    alternativas: string[];
    gabarito: string;
    explicacao?: string;
}

interface QuestionsData {
    perguntas: Question[];
}

interface SearchCardProps {
    onQuestionsGenerated?: (data: any) => void;
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const baseURL = 'http://localhost:8080'; // Substitua pela sua URL real

function SearchCard({ onQuestionsGenerated, setIsLoading }: SearchCardProps) {
    const [isDark, setIsDark] = useState(false);
    const [tema, setTema] = useState('');
    const [dificuldade, setDificuldade] = useState('MEDIO');
    const [quantidade, setQuantidade] = useState(5);
    const [isLocalLoading, setIsLocalLoading] = useState(false);

    // Estados para as questões
    const [questionsData, setQuestionsData] = useState<QuestionsData | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
    const [showResults, setShowResults] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const processQuestionsData = (data: any): QuestionsData | null => {
        let processedData: QuestionsData | null = null;

        // Tentar diferentes estruturas de dados
        if (data && data.perguntas && Array.isArray(data.perguntas)) {
            processedData = data;
        } else if (Array.isArray(data)) {
            processedData = { perguntas: data };
        } else if (data && data.data && Array.isArray(data.data)) {
            processedData = { perguntas: data.data };
        } else if (data && data.questions && Array.isArray(data.questions)) {
            processedData = { perguntas: data.questions };
        } else if (data && data.result && Array.isArray(data.result)) {
            processedData = { perguntas: data.result };
        }

        return processedData;
    };

    const handleSubmit = async (e: React.FormEvent | null) => {
        if (e) e.preventDefault();
        if (!tema.trim()) return;

        setIsLocalLoading(true);
        if (setIsLoading) setIsLoading(true);

        try {
            const apiInstance = axios.create({
                baseURL: baseURL + '/ai/generation/request',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const request = {
                dificuldade_da_pergunta: dificuldade,
                quantidade_de_perguntas: quantidade,
                tema_das_perguntas: tema
            };

            const response = await apiInstance.post('', request);

            // Processar dados das questões
            const processedData = processQuestionsData(response.data);

            if (processedData && processedData.perguntas && processedData.perguntas.length > 0) {
                setQuestionsData(processedData);
                // Reset quiz states
                setSelectedAnswers({});
                setShowResults(false);
                setCurrentQuestionIndex(0);
            }

            // Chama a função do componente pai se existir
            if (onQuestionsGenerated) {
                onQuestionsGenerated(response.data);
            }

        } catch (error) {
            console.error('Erro ao gerar perguntas:', error);
        } finally {
            setIsLocalLoading(false);
            if (setIsLoading) setIsLoading(false);
        }
    };

    // Funções do quiz
    const handleAnswerSelect = (questionIndex: number, answer: string) => {
        if (showResults) return;
        setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const calculateResults = () => {
        setShowResults(true);
        setCurrentQuestionIndex(0);
    };

    const resetQuiz = () => {
        setSelectedAnswers({});
        setShowResults(false);
        setCurrentQuestionIndex(0);
    };

    const nextQuestion = () => {
        if (!questionsData) return;
        if (currentQuestionIndex < questionsData.perguntas.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const goToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const getCorrectAnswers = () => {
        if (!questionsData) return 0;
        return questionsData.perguntas.filter((q, idx) =>
            selectedAnswers[idx]?.[0] === q.gabarito
        ).length;
    };

    const isQuizComplete = () => {
        if (!questionsData) return false;
        return questionsData.perguntas.every((_, idx) => selectedAnswers[idx]);
    };

    const scorePercentage = () => {
        if (!questionsData) return 0;
        const correct = getCorrectAnswers();
        const total = questionsData.perguntas.length;
        return Math.round((correct / total) * 100);
    };

    const resetEverything = () => {
        setQuestionsData(null);
        setSelectedAnswers({});
        setShowResults(false);
        setCurrentQuestionIndex(0);
        setTema('');
    };

    const currentQuestion = questionsData?.perguntas[currentQuestionIndex];

    return (
        <div className={`main-container ${isDark ? 'dark' : 'light'}`}>
            <div className="stars-container">
                <div className="stars-layer stars-layer-1"></div>
                <div className="stars-layer stars-layer-2"></div>
                <div className="stars-layer stars-layer-3"></div>
            </div>
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
                                        {questionsData ? 'Suas questões geradas' : 'Configure e gere questões de prova personalizadas'}
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
                        {!questionsData ? (
                            // Formulário de geração
                            <>
                                <div className="input-section">
                                    {/* Tema Input */}
                                    <div className="input-wrapper">
                                        <div className={`input-container ${isDark ? 'input-dark' : 'input-light'}`}>
                                            <MessageCircle className={`input-icon ${isDark ? 'icon-gray-dark' : 'icon-gray-light'}`} />
                                            <input
                                                type="text"
                                                value={tema}
                                                onChange={(e) => setTema(e.target.value)}
                                                placeholder="Digite o tema das questões..."
                                                className={`question-input ${isDark ? 'input-text-dark' : 'input-text-light'}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Dificuldade Select */}
                                    <div className="input-wrapper">
                                        <div className={`input-container ${isDark ? 'input-dark' : 'input-light'}`}>
                                            <FiTarget className={`input-icon ${isDark ? 'icon-gray-dark' : 'icon-gray-light'}`} />
                                            <select
                                                value={dificuldade}
                                                onChange={(e) => setDificuldade(e.target.value)}
                                                className={`question-input ${isDark ? 'input-text-dark' : 'input-text-light'}`}
                                            >
                                                <option value="FACIL">Fácil</option>
                                                <option value="MEDIO">Médio</option>
                                                <option value="DIFICIL">Difícil</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Quantidade Input */}
                                    <div className="input-wrapper">
                                        <div className={`input-container ${isDark ? 'input-dark' : 'input-light'}`}>
                                            <Sparkles className={`input-icon ${isDark ? 'icon-gray-dark' : 'icon-gray-light'}`} />
                                            <input
                                                type="number"
                                                min="1"
                                                max="20"
                                                value={quantidade}
                                                onChange={(e) => setQuantidade(parseInt(e.target.value))}
                                                placeholder="Quantidade de questões"
                                                className={`question-input ${isDark ? 'input-text-dark' : 'input-text-light'}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!tema.trim() || isLocalLoading}
                                        className={`submit-button ${isDark ? 'button-dark' : 'button-light'} ${(!tema.trim() || isLocalLoading) ? 'button-disabled' : ''}`}
                                    >
                                        {isLocalLoading ? (
                                            <>
                                                <div className="ai-orbit">
                                                    <div className="ai-particle"></div>
                                                    <div className="ai-particle"></div>
                                                    <div className="ai-particle"></div>
                                                    <div className="ai-particle"></div>
                                                </div>
                                                
                                            </>
                                        ) : (
                                            <>
                                                <Send className="button-icon" />
                                                Gerar Questões
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Features */}
                                <div className="features-grid">
                                    <div className={`feature-card ${isDark ? 'feature-dark' : 'feature-light'}`}>
                                        <div className={`feature-emoji ${isDark ? 'feature-dark' : 'feature-light'}`}><AiFillRocket /></div>
                                        <h3 className={`feature-title ${isDark ? 'text-light' : 'text-dark'}`}>
                                            Rápido
                                        </h3>
                                        <p className={`feature-desc ${isDark ? 'subtitle-dark' : 'subtitle-light'}`}>
                                            Questões em segundos
                                        </p>
                                    </div>

                                    <div className={`feature-card ${isDark ? 'feature-dark' : 'feature-light'}`}>
                                        <div className={`feature-emoji ${isDark ? 'feature-dark' : 'feature-light'}`}><FiTarget /></div>
                                        <h3 className={`feature-title ${isDark ? 'text-light' : 'text-dark'}`}>
                                            Preciso
                                        </h3>
                                        <p className={`feature-desc ${isDark ? 'subtitle-dark' : 'subtitle-light'}`}>
                                            IA treinada e atualizada
                                        </p>
                                    </div>

                                    <div className={`feature-card ${isDark ? 'feature-dark' : 'feature-light'}`}>
                                        <div className={`feature-emoji ${isDark ? 'feature-dark' : 'feature-light'}`}><Lightbulb /></div>
                                        <h3 className={`feature-title ${isDark ? 'text-light' : 'text-dark'}`}>
                                            Inteligente
                                        </h3>
                                        <p className={`feature-desc ${isDark ? 'subtitle-dark' : 'subtitle-light'}`}>
                                            Compreende contexto
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Área das questões
                            <div className="question-container">
                                {/* Header com informações do quiz */}
                                <div className="quiz-header">
                                    <h2 className={`quiz-title ${isDark ? 'text-light' : 'text-dark'}`}>Questões Geradas</h2>
                                    <div className="quiz-info">
                                        <span className={`question-count ${isDark ? 'text-light' : 'text-dark'}`}>
                                            {currentQuestionIndex + 1} de {questionsData.perguntas.length}
                                        </span>
                                        {showResults && (
                                            <span className={`score-display ${isDark ? 'text-light' : 'text-dark'}`}>
                                                Pontuação: {getCorrectAnswers()}/{questionsData.perguntas.length} ({scorePercentage()}%)
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Indicadores de progresso */}
                                <div className="progress-indicators">
                                    {questionsData.perguntas.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`progress-dot ${idx === currentQuestionIndex ? 'active' : ''
                                                } ${selectedAnswers[idx] ? 'answered' : ''
                                                } ${showResults && selectedAnswers[idx]?.[0] === questionsData.perguntas[idx].gabarito
                                                    ? 'correct'
                                                    : showResults && selectedAnswers[idx]
                                                        ? 'incorrect'
                                                        : ''
                                                }`}
                                            onClick={() => goToQuestion(idx)}
                                        />
                                    ))}
                                </div>

                                {/* Questão atual */}
                                {currentQuestion && (
                                    <div className="question-slider">
                                        <div className="question-card active">
                                            <h3 className={`question-title ${isDark ? 'text-light' : 'text-dark'}`}>
                                                {currentQuestionIndex + 1}. {currentQuestion.pergunta}
                                            </h3>
                                            <div className="alternatives-container">
                                                {currentQuestion.alternativas.map((alternative, altIdx) => (
                                                    <div
                                                        key={altIdx}
                                                        className={`alternative-item ${showResults
                                                            ? alternative[0] === currentQuestion.gabarito
                                                                ? 'correct-answer'
                                                                : selectedAnswers[currentQuestionIndex] === alternative
                                                                    ? 'wrong-answer'
                                                                    : ''
                                                            : selectedAnswers[currentQuestionIndex] === alternative
                                                                ? 'selected-answer'
                                                                : ''
                                                            } ${isDark ? 'alternative-dark' : 'alternative-light'}`}
                                                        onClick={() => handleAnswerSelect(currentQuestionIndex, alternative)}
                                                    >
                                                        {alternative}
                                                    </div>
                                                ))}
                                            </div>
                                            {showResults && currentQuestion.explicacao && (
                                                <div className={`explanation-text ${isDark ? 'text-light' : 'text-dark'}`}>
                                                    <strong>Explicação:</strong> {currentQuestion.explicacao}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Controles de navegação */}
                                <div className="navigation-controls">
                                    <button
                                        onClick={prevQuestion}
                                        disabled={currentQuestionIndex === 0}
                                        className={`nav-button prev-button ${isDark ? 'button-dark' : 'button-light'}`}
                                    >
                                        ← Anterior
                                    </button>

                                    <span className={`question-counter ${isDark ? 'text-light' : 'text-dark'}`}>
                                        {currentQuestionIndex + 1} / {questionsData.perguntas.length}
                                    </span>

                                    <button
                                        onClick={nextQuestion}
                                        disabled={currentQuestionIndex === questionsData.perguntas.length - 1}
                                        className={`nav-button next-button ${isDark ? 'button-dark' : 'button-light'}`}
                                    >
                                        Próxima →
                                    </button>
                                </div>

                                {/* Botões de ação */}
                                <div className="quiz-actions">
                                    {!showResults ? (
                                        <button
                                            onClick={calculateResults}
                                            disabled={!isQuizComplete()}
                                            className={`action-button ${isQuizComplete() ? 'enabled' : 'disabled'} ${isDark ? 'button-dark' : 'button-light'}`}
                                        >
                                            Ver Resultados ({Object.keys(selectedAnswers).length}/{questionsData.perguntas.length})
                                        </button>
                                    ) : (
                                        <button
                                            onClick={resetQuiz}
                                            className={`action-button enabled ${isDark ? 'button-dark' : 'button-light'}`}
                                        >
                                            Refazer Quiz
                                        </button>
                                    )}

                                    <button
                                        onClick={resetEverything}
                                        className={`action-button enabled ${isDark ? 'button-dark' : 'button-light'}`}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Gerar Novas Questões
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Decorative Elements */}
                    <div className="decoration-top" />
                    <div className="decoration-bottom" />
                </div>
                <br /><ButtonPay isDark={isDark} />
            </div>
        
            
        </div>
    );
}

export default SearchCard;