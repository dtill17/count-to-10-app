import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { LanguageSelector } from './components/LanguageSelector'
import { NumberRow } from './components/NumberRow'
import { PlaybackControls } from './components/PlaybackControls'
import { hasAudioForLanguage, languages } from './data/languages'
import { useAudioPlayback } from './hooks/useAudioPlayback'
import { generateQuestion, type QuizQuestion } from './utils/quiz'

type AppMode = 'learn' | 'quiz'

type SessionStats = {
  correct: number
  attempted: number
}

const initialSessionStats: SessionStats = {
  correct: 0,
  attempted: 0,
}

function App() {
  const autoAdvanceDelayMs = 600
  const [selectedLanguageId, setSelectedLanguageId] = useState(languages[0].id)
  const [mode, setMode] = useState<AppMode>('learn')
  const [sessionStats, setSessionStats] = useState(initialSessionStats)
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
  const [revealedWrongAnswers, setRevealedWrongAnswers] = useState<number[]>([])
  const [isQuestionLoading, setIsQuestionLoading] = useState(false)
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false)
  const answerLockRef = useRef(false)
  const autoAdvanceTimeoutRef = useRef<number | null>(null)

  const selectedLanguage =
    languages.find((language) => language.id === selectedLanguageId) ?? languages[0]

  const {
    activeIndex,
    isPlaying,
    errorMessage,
    playNumber,
    playNumeral,
    playAll,
    stop,
  } = useAudioPlayback({
    language: selectedLanguage,
  })

  const hasAudio = hasAudioForLanguage(selectedLanguage.id)

  const clearAutoAdvanceTimeout = useCallback(() => {
    if (autoAdvanceTimeoutRef.current === null) {
      return
    }

    window.clearTimeout(autoAdvanceTimeoutRef.current)
    autoAdvanceTimeoutRef.current = null
  }, [])

  const cancelAutoAdvance = useCallback(() => {
    clearAutoAdvanceTimeout()
    answerLockRef.current = false
    setIsAutoAdvancing(false)
  }, [clearAutoAdvanceTimeout])

  const loadQuizQuestion = useCallback((language = selectedLanguage) => {
    cancelAutoAdvance()

    if (!hasAudioForLanguage(language.id)) {
      setCurrentQuestion(null)
      setSelectedAnswer(null)
      setIsAnswerCorrect(false)
      setRevealedWrongAnswers([])
      setIsQuestionLoading(false)
      return
    }

    setIsQuestionLoading(true)
    setCurrentQuestion(generateQuestion(language))
    setSelectedAnswer(null)
    setIsAnswerCorrect(false)
    setRevealedWrongAnswers([])
    window.setTimeout(() => {
      setIsQuestionLoading(false)
    }, 0)
  }, [cancelAutoAdvance, selectedLanguage])

  useEffect(() => clearAutoAdvanceTimeout, [clearAutoAdvanceTimeout])

  useEffect(() => {
    if (mode !== 'quiz' || !currentQuestion || !hasAudio) {
      return
    }

    void playNumeral(currentQuestion.prompt.numeral)
  }, [currentQuestion, hasAudio, mode, playNumeral])

  const handleLanguageChange = (languageId: string) => {
    cancelAutoAdvance()
    stop()
    setSelectedLanguageId(languageId)

    if (mode === 'quiz') {
      const nextLanguage =
        languages.find((language) => language.id === languageId) ?? languages[0]
      loadQuizQuestion(nextLanguage)
    }
  }

  const handleModeChange = (nextMode: AppMode) => {
    if (nextMode === mode) {
      return
    }

    cancelAutoAdvance()
    stop()
    setMode(nextMode)

    if (nextMode === 'quiz') {
      loadQuizQuestion()
    }
  }

  const handleAnswerSelect = (numeral: number) => {
    if (
      !currentQuestion ||
      answerLockRef.current ||
      isQuestionLoading ||
      isAutoAdvancing
    ) {
      return
    }

    const answeredCorrectly = numeral === currentQuestion.prompt.numeral

    setSelectedAnswer(numeral)
    setIsAnswerCorrect(answeredCorrectly)
    setSessionStats((previous) => ({
      correct: previous.correct + (answeredCorrectly ? 1 : 0),
      attempted: previous.attempted + 1,
    }))

    if (answeredCorrectly) {
      setRevealedWrongAnswers([])
      answerLockRef.current = true
      setIsAutoAdvancing(true)
      clearAutoAdvanceTimeout()
      autoAdvanceTimeoutRef.current = window.setTimeout(() => {
        autoAdvanceTimeoutRef.current = null
        stop()
        loadQuizQuestion()
      }, autoAdvanceDelayMs)
      return
    }

    setRevealedWrongAnswers((previous) =>
      previous.includes(numeral) ? previous : [...previous, numeral],
    )
  }

  const handleReplayAudio = () => {
    if (!currentQuestion || isQuestionLoading || isAutoAdvancing || !hasAudio) {
      return
    }

    setIsQuestionLoading(true)
    stop()
    void playNumeral(currentQuestion.prompt.numeral)
    window.setTimeout(() => {
      setIsQuestionLoading(false)
    }, 120)
  }

  const handleResetSession = () => {
    setSessionStats(initialSessionStats)
  }

  const accuracy =
    sessionStats.attempted === 0
      ? 0
      : Math.round((sessionStats.correct / sessionStats.attempted) * 100)

  return (
    <main className="app-shell">
      <section className={`app-card app-card--${mode}`}>
        <header className="hero-section">
          <p className="eyebrow">Language practice</p>
          <h1>Count to 10</h1>
          <p className="hero-copy">
            {mode === 'learn'
              ? 'Choose a language, hear each number spoken aloud, or play the full sequence from 1 to 10.'
              : 'Listen to a number, pick the correct answer, and build your session accuracy across every language.'}
          </p>
        </header>

        <div className="app-controls">
          <div className="mode-toggle" role="tablist" aria-label="Mode selection">
            <button
              type="button"
              className={`mode-toggle-button${mode === 'learn' ? ' is-selected' : ''}`}
              onClick={() => handleModeChange('learn')}
              aria-pressed={mode === 'learn'}
            >
              Learn Mode
            </button>
            <button
              type="button"
              className={`mode-toggle-button${mode === 'quiz' ? ' is-selected' : ''}`}
              onClick={() => handleModeChange('quiz')}
              aria-pressed={mode === 'quiz'}
            >
              Quiz Mode
            </button>
          </div>

          <LanguageSelector
            languages={languages}
            selectedLanguageId={selectedLanguage.id}
            onSelect={handleLanguageChange}
          />

          <p className="selected-language-label">
            {selectedLanguage.flag} {selectedLanguage.name}
          </p>
        </div>

        {mode === 'learn' ? (
          <section className="learn-panel">
            <PlaybackControls
              canPlayAll={hasAudio}
              isPlaying={isPlaying}
              onPlayAll={() => void playAll()}
              onStop={stop}
            />

            {errorMessage ? <p className="speech-note">{errorMessage}</p> : null}

            <ol className="number-list">
              {selectedLanguage.numbers.map((entry, index) => (
                <NumberRow
                  key={entry.numeral}
                  entry={entry}
                  isActive={activeIndex === index}
                  onPlay={() => void playNumber(index)}
                  disabled={!hasAudio}
                  showTransliteration={selectedLanguage.id === 'ja'}
                />
              ))}
            </ol>
          </section>
        ) : (
          <section className="quiz-panel" aria-live="polite">
            <div className="quiz-scoreboard">
              <div className="quiz-score">
                <span className="quiz-score-label">Correct</span>
                <strong>{sessionStats.correct}</strong>
              </div>
              <div className="quiz-score">
                <span className="quiz-score-label">Attempted</span>
                <strong>{sessionStats.attempted}</strong>
              </div>
              <div className="quiz-score">
                <span className="quiz-score-label">Accuracy</span>
                <strong>{accuracy}%</strong>
              </div>
              <button
                type="button"
                className="control-button quiz-reset-button"
                onClick={handleResetSession}
              >
                Reset Session
              </button>
            </div>

            {errorMessage ? <p className="speech-note">{errorMessage}</p> : null}

            {!hasAudio || !currentQuestion ? (
              <p className="speech-note">
                Quiz audio is not available for this language yet.
              </p>
            ) : (
              <>
                <div className="quiz-meta">
                  <div className="quiz-prompt">
                    <p className="quiz-prompt-label">Current language</p>
                    <p className="quiz-prompt-value">{selectedLanguage.name}</p>
                    <p className="quiz-instruction">
                      Listen to the audio and choose the matching number.
                    </p>
                  </div>

                  <div className="quiz-toolbar">
                    <button
                      type="button"
                      className="control-button"
                      onClick={handleReplayAudio}
                      disabled={isQuestionLoading || isAutoAdvancing || !hasAudio}
                    >
                      Replay Audio
                    </button>
                  </div>
                </div>

                <div className="quiz-options" role="list">
                  {currentQuestion.options.map((option) => {
                    const isCorrectOption =
                      option.numeral === currentQuestion.prompt.numeral
                    const isSelected = selectedAnswer === option.numeral
                    const showCorrectState = isAnswerCorrect && isCorrectOption
                    const showIncorrectState =
                      revealedWrongAnswers.includes(option.numeral) && !isCorrectOption

                    return (
                      <button
                        key={option.numeral}
                        type="button"
                        className={[
                          'quiz-option',
                          showCorrectState ? 'is-correct' : '',
                          showIncorrectState ? 'is-incorrect' : '',
                          isSelected && !showCorrectState && !showIncorrectState
                            ? 'is-selected'
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => handleAnswerSelect(option.numeral)}
                        disabled={isAnswerCorrect || isQuestionLoading}
                      >
                        <span className="quiz-option-word">{option.numeral}</span>
                      </button>
                    )
                  })}
                </div>

              </>
            )}
          </section>
        )}
      </section>
    </main>
  )
}

export default App
