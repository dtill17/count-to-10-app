export type NumberEntry = {
  numeral: number
  word: string
  transliteration?: string
}

export type LanguageOption = {
  id: string
  name: string
  locale: string
  flag: string
  numbers: NumberEntry[]
}

export const languageAudioFolders = {
  en: 'english',
  de: 'german',
  es: 'spanish',
  fr: 'french',
  it: 'italian',
  pt: 'portuguese',
  da: 'danish',
  ja: 'japanese',
} as const satisfies Record<string, string>

export function getAudioFolderName(languageId: string) {
  return languageAudioFolders[languageId as keyof typeof languageAudioFolders] ?? null
}

export function hasAudioForLanguage(languageId: string) {
  return getAudioFolderName(languageId) !== null
}

export function getAudioPath(language: LanguageOption, numeral: number) {
  const folderName = getAudioFolderName(language.id)
  if (!folderName) {
    return null
  }

  return `/audio/${folderName}/${numeral}.mp3`
}

export const languages: LanguageOption[] = [
  {
    id: 'en',
    name: 'English',
    locale: 'en-GB',
    flag: '🇬🇧',
    numbers: [
      { numeral: 1, word: 'one' },
      { numeral: 2, word: 'two' },
      { numeral: 3, word: 'three' },
      { numeral: 4, word: 'four' },
      { numeral: 5, word: 'five' },
      { numeral: 6, word: 'six' },
      { numeral: 7, word: 'seven' },
      { numeral: 8, word: 'eight' },
      { numeral: 9, word: 'nine' },
      { numeral: 10, word: 'ten' },
    ],
  },
  {
    id: 'de',
    name: 'German',
    locale: 'de-DE',
    flag: '🇩🇪',
    numbers: [
      { numeral: 1, word: 'eins' },
      { numeral: 2, word: 'zwei' },
      { numeral: 3, word: 'drei' },
      { numeral: 4, word: 'vier' },
      { numeral: 5, word: 'fünf' },
      { numeral: 6, word: 'sechs' },
      { numeral: 7, word: 'sieben' },
      { numeral: 8, word: 'acht' },
      { numeral: 9, word: 'neun' },
      { numeral: 10, word: 'zehn' },
    ],
  },
  {
    id: 'es',
    name: 'Spanish',
    locale: 'es-ES',
    flag: '🇪🇸',
    numbers: [
      { numeral: 1, word: 'uno' },
      { numeral: 2, word: 'dos' },
      { numeral: 3, word: 'tres' },
      { numeral: 4, word: 'cuatro' },
      { numeral: 5, word: 'cinco' },
      { numeral: 6, word: 'seis' },
      { numeral: 7, word: 'siete' },
      { numeral: 8, word: 'ocho' },
      { numeral: 9, word: 'nueve' },
      { numeral: 10, word: 'diez' },
    ],
  },
  {
    id: 'fr',
    name: 'French',
    locale: 'fr-FR',
    flag: '🇫🇷',
    numbers: [
      { numeral: 1, word: 'un' },
      { numeral: 2, word: 'deux' },
      { numeral: 3, word: 'trois' },
      { numeral: 4, word: 'quatre' },
      { numeral: 5, word: 'cinq' },
      { numeral: 6, word: 'six' },
      { numeral: 7, word: 'sept' },
      { numeral: 8, word: 'huit' },
      { numeral: 9, word: 'neuf' },
      { numeral: 10, word: 'dix' },
    ],
  },
  {
    id: 'it',
    name: 'Italian',
    locale: 'it-IT',
    flag: '🇮🇹',
    numbers: [
      { numeral: 1, word: 'uno' },
      { numeral: 2, word: 'due' },
      { numeral: 3, word: 'tre' },
      { numeral: 4, word: 'quattro' },
      { numeral: 5, word: 'cinque' },
      { numeral: 6, word: 'sei' },
      { numeral: 7, word: 'sette' },
      { numeral: 8, word: 'otto' },
      { numeral: 9, word: 'nove' },
      { numeral: 10, word: 'dieci' },
    ],
  },
  {
    id: 'pt',
    name: 'Portuguese',
    locale: 'pt-PT',
    flag: '🇵🇹',
    numbers: [
      { numeral: 1, word: 'um' },
      { numeral: 2, word: 'dois' },
      { numeral: 3, word: 'três' },
      { numeral: 4, word: 'quatro' },
      { numeral: 5, word: 'cinco' },
      { numeral: 6, word: 'seis' },
      { numeral: 7, word: 'sete' },
      { numeral: 8, word: 'oito' },
      { numeral: 9, word: 'nove' },
      { numeral: 10, word: 'dez' },
    ],
  },
  {
    id: 'da',
    name: 'Danish',
    locale: 'da-DK',
    flag: '🇩🇰',
    numbers: [
      { numeral: 1, word: 'en' },
      { numeral: 2, word: 'to' },
      { numeral: 3, word: 'tre' },
      { numeral: 4, word: 'fire' },
      { numeral: 5, word: 'fem' },
      { numeral: 6, word: 'seks' },
      { numeral: 7, word: 'syv' },
      { numeral: 8, word: 'otte' },
      { numeral: 9, word: 'ni' },
      { numeral: 10, word: 'ti' },
    ],
  },
  {
    id: 'ja',
    name: 'Japanese',
    locale: 'ja-JP',
    flag: '🇯🇵',
    numbers: [
      { numeral: 1, word: 'いち', transliteration: 'ichi' },
      { numeral: 2, word: 'に', transliteration: 'ni' },
      { numeral: 3, word: 'さん', transliteration: 'san' },
      { numeral: 4, word: 'よん', transliteration: 'yon' },
      { numeral: 5, word: 'ご', transliteration: 'go' },
      { numeral: 6, word: 'ろく', transliteration: 'roku' },
      { numeral: 7, word: 'なな', transliteration: 'nana' },
      { numeral: 8, word: 'はち', transliteration: 'hachi' },
      { numeral: 9, word: 'きゅう', transliteration: 'kyuu' },
      { numeral: 10, word: 'じゅう', transliteration: 'juu' },
    ],
  },
]
