import prand, { RandomGenerator } from "pure-rand";
import { Seq } from "./Seq";
import { iterate } from "./static";

const DEFAULT_SEED = 5;

function prandWrapper_(
  generator:
    | typeof prand.xorshift128plus
    | typeof prand.xoroshiro128plus
    | typeof prand.mersenne
    | typeof prand.congruential
    | typeof prand.congruential32,
  seed: number
): Seq<number> {
  const gen1 = generator(seed);

  return iterate<[number, RandomGenerator]>(
    ([, gen]) => gen.next(),
    gen1.next()
  ).map(([num]) => num);
}

export function random(seed = DEFAULT_SEED): Seq<number> {
  return prandWrapper_(prand.mersenne, seed);
}

export function xorshift128plus(seed = DEFAULT_SEED): Seq<number> {
  return prandWrapper_(prand.xorshift128plus, seed);
}

export function xoroshiro128plus(seed = DEFAULT_SEED): Seq<number> {
  return prandWrapper_(prand.xoroshiro128plus, seed);
}

export function mersenne(seed = DEFAULT_SEED): Seq<number> {
  return prandWrapper_(prand.mersenne, seed);
}

export function congruential(seed = DEFAULT_SEED): Seq<number> {
  return prandWrapper_(prand.congruential, seed);
}

export function congruential32(seed = DEFAULT_SEED): Seq<number> {
  return prandWrapper_(prand.congruential32, seed);
}
