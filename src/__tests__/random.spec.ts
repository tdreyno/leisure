import {
  random,
  xorshift128plus,
  mersenne,
  xoroshiro128plus,
  congruential,
  congruential32
} from "../random";

describe("random", () => {
  describe("random", () => {
    test("should lazily produce seeded random numbers", () => {
      const result = random()
        .take(4)
        .toArray();

      expect(result).toEqual([953453411, 236996814, 3739766767, 3570525885]);
    });
  });

  describe("mersenne", () => {
    test("should lazily produce seeded mersenne numbers", () => {
      const result = mersenne()
        .take(4)
        .toArray();

      expect(result).toEqual([953453411, 236996814, 3739766767, 3570525885]);
    });
  });

  describe("xorshift128plus", () => {
    test("should lazily produce seeded xorshift128plus numbers", () => {
      const result = xorshift128plus()
        .take(4)
        .toArray();

      expect(result).toEqual([-6, 721420101, 782843908, -673277793]);
    });
  });

  describe("xoroshiro128plus", () => {
    test("should lazily produce seeded xoroshiro128plus numbers", () => {
      const result = xoroshiro128plus()
        .take(4)
        .toArray();

      expect(result).toEqual([-6, -84279452, 4201029, -1465784295]);
    });
  });

  describe("congruential", () => {
    test("should lazily produce seeded congruential numbers", () => {
      const result = congruential()
        .take(4)
        .toArray();

      expect(result).toEqual([54, 28693, 12255, 24449]);
    });
  });

  describe("congruential32", () => {
    test("should lazily produce seeded congruential32 numbers", () => {
      const result = congruential32()
        .take(4)
        .toArray();

      expect(result).toEqual([3087708127, 1980136134, 3799575376, 167603873]);
    });
  });
});
