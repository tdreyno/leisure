# Changelog

## 1.2.0 - 2020-01-28

Removed internal concept of keys. Everything in a sequence is not 0-indexed like an array.

### Changed

- All zipper fns (use with `zipWith`) now return only the mapped data, instead of a tuple with the index.

### Removed

- `Seq.fromSet`
- `Seq.prototype.toSet`
- `Seq.fromMap`
- `Seq.prototype.toMap`
- `Seq.fromIterator`
- `Seq.fromGenerator`

## 1.1.0 - 2020-01-20

### Added

- `Seq.prototype.flat` (exactly like `Array.prototype.flat`).
- `Seq.concat` as a top-level means of concattenating multiple sequences.
- `Seq.interleave` as a top-level means of interleaving multiple sequences.
- `Seq.random` for generating random data.
- `Seq.simplex2D`, `Seq.simplex3D` and `Seq.simplex4D` for generating simplex noise.
- `Seq.prototype.nth`, which is like `Seq.prototype.index`, but 1-indexed.
- `Seq.prototype.zip2`, `Seq.prototype.zip2With`, `Seq.zip3` and `Seq.zip3With` for a 3-tuple result.

### Changed

- `Seq.of` is now variadic to match `Array.of`.
- Rename `Seq.prototype.partition` to `Seq.prototype.partitionBy`

## 1.0.0 - 2020-01-18

### Added

- Everything!
