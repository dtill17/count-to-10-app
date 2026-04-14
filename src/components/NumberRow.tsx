import type { NumberEntry } from '../data/languages'

type NumberRowProps = {
  entry: NumberEntry
  isActive: boolean
  onPlay: () => void
  disabled: boolean
  showTransliteration: boolean
}

export function NumberRow({
  entry,
  isActive,
  onPlay,
  disabled,
  showTransliteration,
}: NumberRowProps) {
  return (
    <li className={`number-row${isActive ? ' is-active' : ''}`}>
      <button
        type="button"
        className="play-button"
        onClick={onPlay}
        aria-label={`Play ${entry.word}`}
        disabled={disabled}
      >
        <span aria-hidden="true">▶</span>
      </button>
      <span className="number-numeral">{entry.numeral}</span>
      <div className="number-word-group">
        <span className="number-word">{entry.word}</span>
        {showTransliteration && entry.transliteration ? (
          <span className="number-transliteration">{entry.transliteration}</span>
        ) : null}
      </div>
    </li>
  )
}
