import {
  ComplexDeconstructor,
  Deconstruction,
  Deconstructor
} from "../../../types"
import { OutputBuffer } from "../../../util"
import { skip } from "../../simple"
import {
  FieldAddDeconstructor,
  InternalStructDeconstructor,
  LateDeconstructor
} from "./internal"

class StructDeconstructor<K extends string, T extends Record<K, any>>
  implements ComplexDeconstructor<T, K> {
  constructor(
    /** @protected Not intended for outside consumption */
    public readonly _inner: InternalStructDeconstructor<T>
  ) {}

  bytes = this._inner.bytes
  minBytes = this._inner.minBytes

  _fromBuffer(buffer: OutputBuffer, offset: number): Deconstruction<T> {
    return this._inner._fromBuffer(buffer, offset)
  }

  /** Find out where a given field starts */
  offsetForElement(fieldName: K): number | undefined {
    return this._inner._offsetForElement(fieldName)
  }

  /** Add a field to the struct, extracting the following bytes with the given Deconstructor */
  field<F extends string, U>(
    fieldName: F,
    inner: Deconstructor<U>
  ): StructDeconstructor<F | K, T & { [_ in F]: U }> {
    return new StructDeconstructor(
      new FieldAddDeconstructor(this._inner, fieldName, false, inner)
    )
  }

  /** Check that the following bytes are extractable with the given Deconstructor */
  check(inner: Deconstructor<any>): StructDeconstructor<K, T> {
    return new StructDeconstructor(
      new FieldAddDeconstructor(this._inner, null, false, inner)
    )
  }

  /** Ignore the following number of bytes */
  skip(bytes: number): StructDeconstructor<K, T> {
    return this.check(skip(bytes))
  }

  /**
   * Add a field to the struct, whose Deconstructor depends of previous values.
   *
   * Combines `struct.field()` and `after()`
   */
  thenField<F extends string, U>(
    fieldName: F,
    innerFn: LateDeconstructor<T, U>
  ): StructDeconstructor<F | K, T & { [_ in F]: U }> {
    return new StructDeconstructor(
      new FieldAddDeconstructor(this._inner, fieldName, true, innerFn)
    )
  }

  /**
   * Check that the following bytes are extractable, with the Deconstructor depending on previous values.
   *
   * Combines `struct.check()` and `after()`
   */
  thenCheck(innerFn: LateDeconstructor<T, any>): StructDeconstructor<K, T> {
    return new StructDeconstructor(
      new FieldAddDeconstructor(this._inner, null, true, innerFn)
    )
  }

  /**
   * Ignore the following a number of bytes, depending on previous values.
   *
   * Combines `struct.skip()` and `after()`
   */
  thenSkip(
    innerFn: (deconstructor: Deconstruction<T>) => number
  ): StructDeconstructor<K, T> {
    return this.thenCheck(deconstructor => skip(innerFn(deconstructor)))
  }
}

export { StructDeconstructor }
