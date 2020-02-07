import { Deconstructor } from "../../types"
import { makeDynamic } from "../../util"

export function boolean(): Deconstructor<boolean> {
  return BooleanDeconstructor
}

const BooleanDeconstructor: Deconstructor<boolean> = makeDynamic({
  bytes: 1,
  minBytes: 1,
  _fromBuffer: (buf, offset) => ({
    value: buf[offset] === 0x01,
    bytesUsed: 1
  })
})
