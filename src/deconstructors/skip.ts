import { Deconstructor } from "../types"

export function skip(bytes: number): Deconstructor<void> {
  return new SkipDeconstructor(bytes)
}

class SkipDeconstructor implements Deconstructor<void> {
  constructor(public readonly bytes: number) {}

  _fromBuffer() {
    return
  }
}
