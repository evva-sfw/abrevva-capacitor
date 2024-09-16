/**
 * Convert a 16 bit UUID into a 128 bit UUID string.

 * @param value number, e.g. 0x180d
 * @return string, e.g. '0000180d-0000-1000-8000-00805f9b34fb'
 */
export function numberToUUID(value: number): string {
  return `0000${value.toString(16).padStart(4, "0")}-0000-1000-8000-00805f9b34fb`;
}

/**
 * Convert a DataView into an array of numbers.
 *
 * @param value DataView
 * @return number[]
 */
export function dataViewToNumbers(value: DataView): number[] {
  return Array.from(new Uint8Array(value.buffer));
}

/**
 * Convert a DataView into a hex string.
 *
 * @param value DataView
 * @return string
 */
export function dataViewToHexString(value: DataView): string {
  return dataViewToNumbers(value)
    .map((n) => {
      let s = n.toString(16);
      if (s.length == 1) {
        s = "0" + s;
      }
      return s;
    })
    .join(" ");
}

/**
 * Convert an array of numbers into a DataView.
 *
 * @param value number[]
 * @return DataView
 */
export function numbersToDataView(value: number[]): DataView {
  return new DataView(Uint8Array.from(value).buffer);
}

/**
 * Convert a hex string into a DataView.
 *
 * @param value string
 * @return DataView
 */
export function hexStringToDataView(value: string): DataView {
  const numbers: number[] = value
    .trim()
    .split(" ")
    .filter((e) => e !== "")
    .map((s) => parseInt(s, 16));
  return numbersToDataView(numbers);
}
