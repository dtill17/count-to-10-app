import type { LanguageOption, NumberEntry } from '../data/languages'

export type QuizQuestion = {
  prompt: NumberEntry
  options: NumberEntry[]
}

export function shuffleOptions<T>(items: T[]) {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ]
  }

  return shuffled
}

export function getRandomWrongAnswers(
  language: LanguageOption,
  correctNumeral: number,
  count: number,
) {
  const wrongOptions = language.numbers.filter(
    (entry) => entry.numeral !== correctNumeral,
  )

  return shuffleOptions(wrongOptions).slice(0, count)
}

export function generateQuestion(language: LanguageOption): QuizQuestion {
  const prompt =
    language.numbers[Math.floor(Math.random() * language.numbers.length)]

  if (!prompt) {
    throw new Error(`Cannot generate a question for language "${language.id}"`)
  }

  const wrongAnswers = getRandomWrongAnswers(language, prompt.numeral, 3)
  const options = shuffleOptions([prompt, ...wrongAnswers])

  return {
    prompt,
    options,
  }
}
