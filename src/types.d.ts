/**
 * Result of a deconstructed buffer
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
 */
export interface Deconstructor<T> {
  /**
   * Bytes to be read by the deconstructor
   * If it's not known in advance, set it to `undefined`
   */
  readonly bytes?: number

  /**
   * The function that actually reads the buffer and returns deconstructed value
   */
  _fromBuffer(buffer: Buffer, offset: number): Deconstruction<T>
}
