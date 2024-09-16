import {
  dataViewToHexString,
  dataViewToNumbers,
  hexStringToDataView,
  numbersToDataView,
  numberToUUID,
} from "./conversion";

describe("numberToUUID", () => {
  it("should convert a 16 bit UUID to a 128 bit UUID string", () => {
    const value = 0x180d;
    const result = numberToUUID(value);

    expect(result).toEqual("0000180d-0000-1000-8000-00805f9b34fb");
  });

  it("should also work with leading zeroes", () => {
    const value = 0x0042;
    const result = numberToUUID(value);

    expect(result).toEqual("00000042-0000-1000-8000-00805f9b34fb");
  });
});

describe("dataViewToNumbers", () => {
  it("should convert a DataView to an array of numbers", () => {
    const array = [0, 5, 200];
    const value = new DataView(Uint8Array.from(array).buffer);
    const result = dataViewToNumbers(value);
    expect(result).toEqual(array);
  });

  it("should convert an empty DataView to an array of numbers", () => {
    const value = new DataView(new ArrayBuffer(0));
    const result = dataViewToNumbers(value);
    expect(result).toEqual([]);
  });
});

describe("dataViewToHexString", () => {
  it("should convert a DataView to a hex string", () => {
    const value = new DataView(Uint8Array.from([0, 5, 200]).buffer);
    const result = dataViewToHexString(value);
    expect(result).toEqual("00 05 c8");
  });

  it("should convert an empty DataView to a hex string", () => {
    const value = new DataView(new ArrayBuffer(0));
    const result = dataViewToHexString(value);
    expect(result).toEqual("");
  });
});

describe("numbersToDataView", () => {
  it("should convert an array of numbers to a DataView", () => {
    const value = [0, 5, 200];
    const result = numbersToDataView(value);

    expect(result.byteLength).toEqual(3);
    expect(result.byteOffset).toEqual(0);
    expect(result.getUint8(0)).toEqual(0);
    expect(result.getUint8(1)).toEqual(5);
    expect(result.getUint8(2)).toEqual(200);
  });

  it("should convert an empty array to a DataView", () => {
    const value: number[] = [];
    const result = numbersToDataView(value);
    expect(result.byteLength).toEqual(0);
    expect(result.byteOffset).toEqual(0);
  });
});

describe("hexStringToDataView", () => {
  it("should convert a hex string to a DataView", () => {
    const value = "00 05 c8";
    const result = hexStringToDataView(value);

    expect(result.byteLength).toEqual(3);
    expect(result.byteOffset).toEqual(0);
    expect(result.getUint8(0)).toEqual(0);
    expect(result.getUint8(1)).toEqual(5);
    expect(result.getUint8(2)).toEqual(200);
  });

  it("should ignore leading and trailing white space and work with upper case", () => {
    const value = " 00 05 C8 ";
    const result = hexStringToDataView(value);

    expect(result.byteLength).toEqual(3);
    expect(result.getUint8(0)).toEqual(0);
    expect(result.getUint8(1)).toEqual(5);
    expect(result.getUint8(2)).toEqual(200);
  });

  it("should convert an empty hex string to a DataView", () => {
    const value = "";
    const result = hexStringToDataView(value);

    expect(result.byteLength).toEqual(0);
    expect(result.byteOffset).toEqual(0);
  });
});
