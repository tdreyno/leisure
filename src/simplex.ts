import { makeNoise2D, makeNoise3D, makeNoise4D } from "open-simplex-noise";
import { Seq } from "./Seq";
import { iterate } from "./static";

export function simplex2D(
  fn: () => [number, number],
  /* istanbul ignore next */
  seed: number = Date.now()
): Seq<number> {
  const noise2D = makeNoise2D(seed);
  const step = (): number => noise2D(...fn());

  return iterate(step, step());
}

export function simplex3D(
  fn: () => [number, number, number],
  /* istanbul ignore next */
  seed: number = Date.now()
): Seq<number> {
  const noise3D = makeNoise3D(seed);
  const step = (): number => noise3D(...fn());

  return iterate(step, step());
}

export function simplex4D(
  fn: () => [number, number, number, number],
  /* istanbul ignore next */
  seed: number = Date.now()
): Seq<number> {
  const noise4D = makeNoise4D(seed);
  const step = (): number => noise4D(...fn());

  return iterate(step, step());
}
