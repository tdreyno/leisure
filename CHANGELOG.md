# Changelog

## 1.1.0 - 2020-01-20

### Added

- `Seq.prototype.flat` (exactly like `Array.prototype.flat`).
- `Seq.concat` as a top-level means of concattenating multiple sequences.
- `Seq.interleave` as a top-level means of interleaving multiple sequences.
- `Seq.random` for generating random data.
- `Seq.simplex2D`, `Seq.simplex3D` and `Seq.simplex4D` for generating simplex noise.

### Changed

- `Seq.of` is now variadic to match `Array.of`.
- Rename `Seq.prototype.partition` to `Seq.prototype.partitionBy`
- Rename `Seq.prototype.index` to `Seq.prototype.nth`

## 1.0.0 - 2020-01-18

### Added

- Everything!
