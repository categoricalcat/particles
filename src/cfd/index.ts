/* eslint-disable @typescript-eslint/no-non-null-assertion */

const N = 3
const vectorWidth = Math.floor(window.innerWidth / N)
const vectorHeight = Math.floor(window.innerHeight / N)
export const IX = (x: number, y: number) => x + N * y

type NotEmptyArray<T> = [T, ...T[]]

export function set_bnd(N: number, b: number, x: NotEmptyArray<number>) {
  for (let i = 1; i <= N; i++) {
    x[IX(0, i)] = b === 1 ? -x[IX(1, i)]! : x[IX(1, i)]!
    x[IX(N + 1, i)] = b === 1 ? -x[IX(N, i)]! : x[IX(N, i)]!
    x[IX(i, 0)] = b === 2 ? -x[IX(i, 1)]! : x[IX(i, 1)]!
    x[IX(i, N + 1)] = b === 2 ? -x[IX(i, N)]! : x[IX(i, N)]!
  }
  x[IX(0, 0)] = 0.5 * (x[IX(1, 0)]! + x[IX(0, 1)]!)
  x[IX(0, N + 1)] = 0.5 * (x[IX(1, N + 1)]! + x[IX(0, N)]!)
  x[IX(N + 1, 0)] = 0.5 * (x[IX(N, 0)]! + x[IX(N + 1, 1)]!)
  x[IX(N + 1, N + 1)] = 0.5 * (x[IX(N, N + 1)]! + x[IX(N + 1, N)]!)
}

export function add_source(
  x: NotEmptyArray<number>,
  s: NotEmptyArray<number>,
  dt: number,
) {
  for (let i = 0; i < (N + 2) * (N + 2); i++) {
    x[i] = (x[i] ?? 0) + dt * s[i]!
  }
}

export function diffuse(
  N: number,
  b: number,
  x: NotEmptyArray<number>,
  x0: NotEmptyArray<number>,
  diff: number,
  dt: number,
) {
  let i: number, j: number, k: number
  const a: number = dt * diff * N * N

  for (k = 0; k < 20; k++) {
    for (i = 1; i <= N; i++) {
      for (j = 1; j <= N; j++) {
        x[IX(i, j)] =
          (x0[IX(i, j)]! +
            a *
              (x[IX(i - 1, j)]! +
                x[IX(i + 1, j)]! +
                x[IX(i, j - 1)]! +
                x[IX(i, j + 1)]!)) /
          (1 + 4 * a)
      }
    }

    set_bnd(N, b, x)
  }
}

export function advect(
  N: number,
  d: NotEmptyArray<number>,
  d0: NotEmptyArray<number>,
  u: NotEmptyArray<number>,
  v: NotEmptyArray<number>,
  dt: number,
) {
  let i: number, j: number, i0: number, j0: number, i1: number, j1: number
  let x: number, y: number, s0: number, t0: number, s1: number, t1: number

  const dt0 = dt * N

  for (i = 1; i <= N; i++) {
    for (j = 1; j <= N; j++) {
      x = i - dt0 * u[IX(i, j)]!
      y = j - dt0 * v[IX(i, j)]!

      if (x < 0.5) x = 0.5
      if (x > N + 0.5) x = N + 0.5
      if (y < 0.5) y = 0.5
      if (y > N + 0.5) y = N + 0.5

      i0 = Math.floor(x)
      j0 = Math.floor(y)

      i1 = i0 + 1
      j1 = j0 + 1

      s1 = x - i0
      s0 = 1 - s1
      t1 = y - j0
      t0 = 1 - t1

      d[IX(i, j)] =
        s0 * (t0 * d0[IX(i0, j0)]! + t1 * d0[IX(i0, j1)]!) +
        s1 * (t0 * d0[IX(i1, j0)]! + t1 * d0[IX(i1, j1)]!)
    }
  }
}

const vectors = new Array(N ** 2).fill(undefined).map((_, i) => {
  const px = i % N
  const py = Math.floor(i / N)

  return {
    px,
    py,
    x: px * vectorWidth,
    y: py * vectorHeight,
  }
})

console.log(vectors, { vectorWidth, vectorHeight })
