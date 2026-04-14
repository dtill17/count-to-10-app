import { useCallback, useEffect, useRef, useState } from 'react'
import type { LanguageOption } from '../data/languages'
import { getAudioPath } from '../data/languages'

type UseAudioPlaybackArgs = {
  language: LanguageOption
}

type UseAudioPlaybackResult = {
  activeIndex: number | null
  isPlaying: boolean
  errorMessage: string | null
  playNumber: (index: number) => Promise<void>
  playNumeral: (numeral: number) => Promise<boolean>
  playAll: () => Promise<void>
  stop: () => void
}

export function useAudioPlayback({
  language,
}: UseAudioPlaybackArgs): UseAudioPlaybackResult {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playbackTokenRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const verifiedAudioPathsRef = useRef(new Map<string, boolean>())

  const stopCurrentAudio = useCallback(() => {
    const existingAudio = audioRef.current

    if (!existingAudio) {
      return
    }

    existingAudio.pause()
    existingAudio.currentTime = 0
    existingAudio.src = ''
    existingAudio.load()
    audioRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      stopCurrentAudio()
    }
  }, [stopCurrentAudio])

  const resetPlaybackState = useCallback(() => {
    playbackTokenRef.current += 1
    setIsPlaying(false)
    setActiveIndex(null)
  }, [])

  const stop = useCallback(() => {
    resetPlaybackState()
    stopCurrentAudio()
  }, [resetPlaybackState, stopCurrentAudio])

  const verifyAudioPath = useCallback(async (src: string) => {
    const cachedResult = verifiedAudioPathsRef.current.get(src)

    if (cachedResult !== undefined) {
      return cachedResult
    }

    try {
      const response = await fetch(src, { method: 'HEAD' })
      const exists = response.ok
      verifiedAudioPathsRef.current.set(src, exists)

      if (!exists) {
        console.warn(`Missing audio file: ${src}`)
      }

      return exists
    } catch (error) {
      console.warn(`Unable to verify audio file: ${src}`, error)
      verifiedAudioPathsRef.current.set(src, true)
      return true
    }
  }, [])

  const playAudio = useCallback(async (
    entryIndex: number,
    token: number,
    clearActiveOnEnd: boolean,
  ) => {
    const entry = language.numbers[entryIndex]
    if (!entry) {
      return false
    }

    const src = getAudioPath(language, entry.numeral)

    if (!src) {
      setErrorMessage('Audio not available')
      setIsPlaying(false)
      return false
    }

    const audioExists = await verifyAudioPath(src)
    if (!audioExists) {
      setErrorMessage('Audio not available')
      setIsPlaying(false)
      setActiveIndex(null)
      return false
    }

    const audio = new Audio(src)
    audio.preload = 'auto'

    stopCurrentAudio()

    setErrorMessage(null)
    setIsPlaying(true)
    setActiveIndex(entryIndex)

    audioRef.current = audio

    return new Promise<boolean>((resolve) => {
      let settled = false

      const finish = (completed: boolean, message?: string) => {
        if (settled) {
          return
        }

        settled = true

        audio.onended = null
        audio.onerror = null
        audio.onplay = null

        if (message) {
          setErrorMessage(message)
        }

        if (playbackTokenRef.current === token) {
          setIsPlaying(false)
          if (clearActiveOnEnd) {
            setActiveIndex(null)
          }
          if (audioRef.current === audio) {
            audioRef.current = null
          }
        }

        resolve(completed)
      }

      audio.onended = () => {
        finish(true)
      }
      audio.onerror = () => {
        finish(false, 'Audio not available')
      }

      const playPromise = audio.play()
      void playPromise
        .then(() => {})
        .catch((error: unknown) => {
          void error
          finish(false)
        })
    })
  }, [language, stopCurrentAudio, verifyAudioPath])

  const playNumber = useCallback(async (entryIndex: number) => {
    const token = playbackTokenRef.current + 1
    playbackTokenRef.current = token
    setIsPlaying(false)
    setActiveIndex(null)

    const completed = await playAudio(entryIndex, token, true)

    if (!completed && playbackTokenRef.current === token) {
      setIsPlaying(false)
      setActiveIndex(null)
    }
  }, [playAudio])

  const playNumeral = useCallback(async (numeral: number) => {
    const entryIndex = language.numbers.findIndex(
      (entry) => entry.numeral === numeral,
    )

    if (entryIndex === -1) {
      setErrorMessage('Audio not available')
      return false
    }

    const token = playbackTokenRef.current + 1
    playbackTokenRef.current = token
    setIsPlaying(false)
    setActiveIndex(null)

    const completed = await playAudio(entryIndex, token, true)

    if (!completed && playbackTokenRef.current === token) {
      setIsPlaying(false)
      setActiveIndex(null)
    }

    return completed
  }, [language.numbers, playAudio])

  const playAll = useCallback(async () => {
    const token = playbackTokenRef.current + 1
    playbackTokenRef.current = token
    setIsPlaying(false)
    setActiveIndex(null)
    setErrorMessage(null)

    for (let index = 0; index < language.numbers.length; index += 1) {
      const completed = await playAudio(index, token, false)

      if (!completed || playbackTokenRef.current !== token) {
        break
      }
    }

    if (playbackTokenRef.current === token) {
      setIsPlaying(false)
      setActiveIndex(null)
      if (audioRef.current) {
        audioRef.current = null
      }
    }
  }, [language.numbers.length, playAudio])

  return {
    activeIndex,
    isPlaying,
    errorMessage,
    playNumber,
    playNumeral,
    playAll,
    stop,
  }
}
