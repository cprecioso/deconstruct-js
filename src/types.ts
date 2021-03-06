import { OutputBuffer } from "./util"

/**
 * Result of a deconstructed buffer
 *
 * @public
 */
export interface Deconstruction<T> {
  /**
   * The value of the deconstruction
   */
  value: T

  /**
   * Number of bytes read
   */
  bytesUsed: number
}

/**
 * The object or instance returned by your function, with information on the deconstructor and the deconstructor value.
 *
 * @public
 */
export interface Deconstructor<T> {
  /**
   * Bytes to be read by the deconstructor
   * If it's not known in advance, set it to `undefined`
   */
  readonly bytes: number | undefined

  /**
   * The minimum number of bytes to be read by the deconstructor
   * It only reflects the bytes that we know in advance are going to be used. It's not a guarantee of a successful deconstruction.
   */
  readonly minBytes: number

  /**
   * The function that actually reads the buffer and returns deconstructed value
   *
   * You shouldn't call this function explicitly. However, if you're _implementing_ a new Deconstructor, this is where you do it.
   */
  _fromBuffer(buffer: OutputBuffer, offset: number): Deconstruction<T>
}

/**
 * The object or instance returned by your function, with information on the deconstructor and the deconstructor value, if it contains more than one value.
 *
 * @public
 */
export interface ComplexDeconstructor<
  T,
  K extends keyof T = Extract<keyof T, T extends Array<any> ? number : string>
> extends Deconstructor<T> {
  /**
   * Returns the offset where a value is expected to be found, or `undefined` if unknown ahead of time.
   */
  offsetForElement(key: K): number | undefined
}

/**
 * This is a Deconstructor which you can call or use as-is
 *
 * @public
 */
export type StaticDeconstructor<
  T,
  F extends () => Deconstructor<T> = () => Deconstructor<T>
> = F & Deconstructor<T>
