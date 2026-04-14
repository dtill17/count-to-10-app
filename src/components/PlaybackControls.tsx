type PlaybackControlsProps = {
  canPlayAll: boolean
  isPlaying: boolean
  onPlayAll: () => void
  onStop: () => void
}

export function PlaybackControls({
  canPlayAll,
  isPlaying,
  onPlayAll,
  onStop,
}: PlaybackControlsProps) {
  return (
    <div className="playback-controls">
      <button
        type="button"
        className="control-button control-button-primary"
        onClick={onPlayAll}
        disabled={!canPlayAll || isPlaying}
      >
        Play All
      </button>
      <button
        type="button"
        className="control-button"
        onClick={onStop}
        disabled={!isPlaying}
      >
        Stop
      </button>
    </div>
  )
}
