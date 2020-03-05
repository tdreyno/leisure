import { makeNoise2D, makeNoise3D, makeNoise4D } from "open-simplex-noise"
import { Seq } from "./Seq"
import { iterate } from "./static"

export const simplex2D = (
  fn: () => [number, number],
  seed: number = Date.now()
) => {
  const noise2D = makeNoise2D(seed)
  const step = (): number => noise2D(...fn())

  return iterate(step, step())
}

export const simplex3D = (
  fn: () => [number, number, number],
  seed: number = Date.now()
) => {
  const noise3D = makeNoise3D(seed)
  const step = (): number => noise3D(...fn())

  return iterate(step, step())
}

export const simplex4D = (
  fn: () => [number, number, number, number],
  seed: number = Date.now()
): Seq<number> => {
  const noise4D = makeNoise4D(seed)
  const step = (): number => noise4D(...fn())

  return iterate(step, step())
}
