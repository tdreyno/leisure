import prand, { RandomGenerator } from "pure-rand"
import { iterate } from "./static"
import { first } from "@tdreyno/figment"

const DEFAULT_SEED = 5

const prandWrapper_ = (
  generator:
    | typeof prand.xorshift128plus
    | typeof prand.xoroshiro128plus
    | typeof prand.mersenne
    | typeof prand.congruential
    | typeof prand.congruential32,
  seed: number,
) =>
  iterate<[number, RandomGenerator]>(
    ([, gen]) => gen.next(),
    generator(seed).next(),
  ).map(first)

export const random = (seed = DEFAULT_SEED) =>
  prandWrapper_(prand.mersenne, seed)

export const xorshift128plus = (seed = DEFAULT_SEED) =>
  prandWrapper_(prand.xorshift128plus, seed)

export const xoroshiro128plus = (seed = DEFAULT_SEED) =>
  prandWrapper_(prand.xoroshiro128plus, seed)

export const mersenne = (seed = DEFAULT_SEED) =>
  prandWrapper_(prand.mersenne, seed)

export const congruential = (seed = DEFAULT_SEED) =>
  prandWrapper_(prand.congruential, seed)

export const congruential32 = (seed = DEFAULT_SEED) =>
  prandWrapper_(prand.congruential32, seed)
