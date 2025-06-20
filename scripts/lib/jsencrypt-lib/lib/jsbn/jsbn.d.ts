import { SecureRandom } from "./rng";
export declare class BigInteger {
    constructor(
        a: number | number[] | string,
        b?: number | SecureRandom,
        c?: number | SecureRandom
    );
    toString(b: number): string;
    protected negate(): BigInteger;
    abs(): BigInteger;
    compareTo(a: BigInteger): number;
    bitLength(): number;
    mod(a: BigInteger): BigInteger;
    modPowInt(e: number, m: BigInteger): BigInteger;
    protected clone(): BigInteger;
    protected intValue(): number;
    protected byteValue(): number;
    protected shortValue(): number;
    protected signum(): 0 | 1 | -1;
    toByteArray(): number[];
    protected equals(a: BigInteger): boolean;
    protected min(a: BigInteger): BigInteger;
    protected max(a: BigInteger): BigInteger;
    protected and(a: BigInteger): BigInteger;
    protected or(a: BigInteger): BigInteger;
    protected xor(a: BigInteger): BigInteger;
    protected andNot(a: BigInteger): BigInteger;
    protected not(): BigInteger;
    protected shiftLeft(n: number): BigInteger;
    protected shiftRight(n: number): BigInteger;
    protected getLowestSetBit(): number;
    protected bitCount(): number;
    protected testBit(n: number): boolean;
    protected setBit(n: number): BigInteger;
    protected clearBit(n: number): BigInteger;
    protected flipBit(n: number): BigInteger;
    add(a: BigInteger): BigInteger;
    subtract(a: BigInteger): BigInteger;
    multiply(a: BigInteger): BigInteger;
    divide(a: BigInteger): BigInteger;
    protected remainder(a: BigInteger): BigInteger;
    protected divideAndRemainder(a: BigInteger): BigInteger[];
    modPow(e: BigInteger, m: BigInteger): BigInteger;
    modInverse(m: BigInteger): BigInteger;
    protected pow(e: number): BigInteger;
    gcd(a: BigInteger): BigInteger;
    isProbablePrime(t: number): boolean;
    copyTo(r: BigInteger): void;
    fromInt(x: number): void;
    protected fromString(s: string | number[], b: number): void;
    clamp(): void;
    dlShiftTo(n: number, r: BigInteger): void;
    drShiftTo(n: number, r: BigInteger): void;
    protected lShiftTo(n: number, r: BigInteger): void;
    protected rShiftTo(n: number, r: BigInteger): void;
    subTo(a: BigInteger, r: BigInteger): void;
    multiplyTo(a: BigInteger, r: BigInteger): void;
    squareTo(r: BigInteger): void;
    divRemTo(m: BigInteger, q: BigInteger, r: BigInteger): void;
    invDigit(): number;
    protected isEven(): boolean;
    protected exp(e: number, z: IReduction): BigInteger;
    protected chunkSize(r: number): number;
    protected toRadix(b: number): string;
    fromRadix(s: string, b: number): void;
    protected fromNumber(
        a: number,
        b: number | SecureRandom,
        c?: number | SecureRandom
    ): void;
    protected bitwiseTo(
        a: BigInteger,
        op: (a: number, b: number) => number,
        r: BigInteger
    ): void;
    protected changeBit(
        n: number,
        op: (a: number, b: number) => number
    ): BigInteger;
    protected addTo(a: BigInteger, r: BigInteger): void;
    protected dMultiply(n: number): void;
    dAddOffset(n: number, w: number): void;
    multiplyLowerTo(a: BigInteger, n: number, r: BigInteger): void;
    multiplyUpperTo(a: BigInteger, n: number, r: BigInteger): void;
    protected modInt(n: number): number;
    protected millerRabin(t: number): boolean;
    protected square(): BigInteger;
    gcda(a: BigInteger, callback: (x: BigInteger) => void): void;
    fromNumberAsync(
        a: number,
        b: number | SecureRandom,
        c: number | SecureRandom,
        callback: () => void
    ): void;
    s: number;
    t: number;
    DB: number;
    DM: number;
    DV: number;
    FV: number;
    F1: number;
    F2: number;
    am: (
        i: number,
        x: number,
        w: BigInteger,
        j: number,
        c: number,
        n: number
    ) => number;
    [index: number]: number;
    static ONE: BigInteger;
    static ZERO: BigInteger;
}
export interface IReduction {
    convert(x: BigInteger): BigInteger;
    revert(x: BigInteger): BigInteger;
    mulTo(x: BigInteger, y: BigInteger, r: BigInteger): void;
    sqrTo(x: BigInteger, r: BigInteger): void;
}
export declare function nbi(): BigInteger;
export declare function parseBigInt(str: string, r: number): BigInteger;
export declare function intAt(s: string, i: number): number;
export declare function nbv(i: number): BigInteger;
export declare function nbits(x: number): number;
