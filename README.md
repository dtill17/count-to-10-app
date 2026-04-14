# Count to 10

A simple React + TypeScript app for practicing numbers in multiple languages.

## Local audio files

Audio playback uses local mp3 files served from `public/audio/<language-folder>/`.

Supported folders:

```text
public/audio/english/1.mp3
public/audio/german/1.mp3
public/audio/spanish/1.mp3
public/audio/french/1.mp3
public/audio/italian/1.mp3
public/audio/portuguese/1.mp3
public/audio/danish/1.mp3
public/audio/japanese/1.mp3
```

Language ids are mapped centrally to folder names in [src/data/languages.ts](src/data/languages.ts), so playback resolves paths like `/audio/english/1.mp3` and `/audio/spanish/10.mp3` without using short ids in the URL.
