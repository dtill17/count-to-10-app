import type { LanguageOption } from '../data/languages'

type LanguageSelectorProps = {
  languages: LanguageOption[]
  selectedLanguageId: string
  onSelect: (languageId: string) => void
}

export function LanguageSelector({
  languages,
  selectedLanguageId,
  onSelect,
}: LanguageSelectorProps) {
  return (
    <div className="language-strip" aria-label="Language selection">
      {languages.map((language) => {
        const isSelected = language.id === selectedLanguageId

        return (
          <button
            key={language.id}
            type="button"
            className={`flag-button${isSelected ? ' is-selected' : ''}`}
            onClick={() => onSelect(language.id)}
            aria-pressed={isSelected}
            aria-label={language.name}
          >
            <span aria-hidden="true" className="flag-emoji">
              {language.flag}
            </span>
          </button>
        )
      })}
    </div>
  )
}
