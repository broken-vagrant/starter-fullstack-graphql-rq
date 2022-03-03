export type Action<T, P = undefined> = P extends undefined
  ? { type: T }
  : { type: T; payload: P };

export type GameBoardAction =
  | Action<"init", { random: boolean }>
  | Action<"toggle_cell", { row: number; col: number }>
  | Action<"generate_next_frame">
  | Action<"auto-option-change", boolean>
  | Action<"toggle-play">
  | Action<"gps-change", number>
  | Action<"set-play", boolean>
  | Action<"reset">
  | Action<"step-next">
  | Action<"stop-and-set-random">;
