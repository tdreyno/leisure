compareAlternatives("shuffle", {
  lazy: function (arr) {
    return Lazy(arr).shuffle()
  },
  underscore: function (arr) {
    return _(arr).shuffle()
  },
  shouldMatch: false,
})

compareAlternatives("zip", {
  lazy: function (arr, other) {
    return Lazy(arr).zip(other)
  },
  underscore: function (arr, other) {
    return _(arr).zip(other)
  },
  inputs: [
    [arr(0, 10), arr(5, 15)],
    [arr(0, 100), arr(50, 150)],
  ],
})

// ---------- Chained operations ----------//

compareAlternatives("map -> filter", {
  lazy: function (arr) {
    return Lazy(arr).map(inc).filter(isEven)
  },
  underscore: function (arr) {
    return _.chain(arr).map(inc).filter(isEven)
  },
})

compareAlternatives("flatten -> map", {
  lazy: function (arr) {
    return Lazy(arr).flatten().map(inc)
  },
  underscore: function (arr) {
    return _.chain(arr).flatten().map(inc)
  },

  inputs: [[jaggedArray]],
})

compareAlternatives("map -> uniq", {
  lazy: function (arr) {
    return Lazy(arr).map(inc).uniq()
  },
  underscore: function (arr) {
    return _.chain(arr).map(inc).uniq()
  },

  inputs: [[dupes(0, 5, 10)], [dupes(0, 50, 100)]],
})

compareAlternatives("map -> union", {
  lazy: function (arr, other) {
    return Lazy(arr).map(inc).union(other)
  },
  underscore: function (arr, other) {
    return _.chain(arr).map(inc).union(other)
  },

  inputs: [
    [arr(0, 10), arr(5, 15)],
    [arr(0, 100), arr(50, 150)],
  ],
})

compareAlternatives("map -> intersection", {
  lazy: function (arr, other) {
    return Lazy(arr).map(inc).intersection(other)
  },
  underscore: function (arr, other) {
    return _.chain(arr).map(inc).intersection(other)
  },

  inputs: [
    [arr(0, 10), arr(5, 15)],
    [arr(0, 100), arr(50, 150)],
  ],
})

compareAlternatives("map -> shuffle", {
  lazy: function (arr) {
    return Lazy(arr).map(inc).shuffle()
  },
  underscore: function (arr) {
    return _.chain(arr).map(inc).shuffle()
  },

  shouldMatch: false,
})

compareAlternatives("map -> zip", {
  lazy: function (arr, other) {
    return Lazy(arr).map(inc).zip(other)
  },
  underscore: function (arr, other) {
    return _.chain(arr).map(inc).zip(other)
  },

  inputs: [
    [arr(0, 10), arr(5, 15)],
    [arr(0, 100), arr(50, 150)],
  ],
})

// ---------- Short-circuited operations ---------- //

compareAlternatives("map -> indexOf", {
  lazy: function (arr, value) {
    return Lazy(arr).map(inc).indexOf(value)
  },
  underscore: function (arr, value) {
    return _.chain(arr).map(inc).indexOf(value)
  },

  inputs: [
    [arr(0, 10), 4],
    [arr(0, 100), 35],
  ],
})

compareAlternatives("map -> sortedIndex", {
  lazy: function (arr) {
    return Lazy(arr)
      .map(inc)
      .sortedIndex(arr[arr.length / 2])
  },
  underscore: function (arr) {
    return _.chain(arr)
      .map(inc)
      .sortedIndex(arr[arr.length / 2])
  },

  inputs: [
    [arr(0, 10), 4],
    [arr(0, 100), 35],
  ],
})

compareAlternatives("map -> take", {
  lazy: function (arr) {
    return Lazy(arr).map(inc).take(5)
  },
  underscore: function (arr) {
    return _.chain(arr).map(inc).take(5)
  },
})

compareAlternatives("filter -> take", {
  lazy: function (arr) {
    return Lazy(arr).filter(isEven).take(5)
  },
  underscore: function (arr) {
    return _.chain(arr).filter(isEven).first(5)
  },
})

compareAlternatives("map -> filter -> take", {
  lazy: function (arr) {
    return Lazy(arr).map(inc).filter(isEven).take(5)
  },
  underscore: function (arr) {
    return _.chain(arr).map(inc).filter(isEven).take(5)
  },
})

compareAlternatives("map -> drop -> take", {
  lazy: function (arr) {
    return Lazy(arr).map(inc).drop(5).take(5)
  },
  underscore: function (arr) {
    return _.chain(arr).map(inc).rest(5).take(5)
  },
})

compareAlternatives("filter -> drop -> take", {
  lazy: function (arr) {
    return Lazy(arr).filter(isEven).drop(5).take(5)
  },
  underscore: function (arr) {
    return _.chain(arr).filter(isEven).rest(5).first(5)
  },
})

compareAlternatives("flatten -> take", {
  lazy: function (arr) {
    return Lazy(arr).flatten().take(5)
  },
  underscore: function (arr) {
    return _.chain(arr).flatten().first(5)
  },

  inputs: [[jaggedArray]],
})

compareAlternatives("uniq -> take", {
  lazy: function (arr) {
    return Lazy(arr).uniq().take(5)
  },
  underscore: function (arr) {
    return _.chain(arr).uniq().first(5)
  },

  inputs: [[dupes(0, 5, 10)], [dupes(0, 10, 100)]],
})

compareAlternatives("union -> take", {
  lazy: function (arr, other) {
    return Lazy(arr).union(other).take(5)
  },
  underscore: function (arr, other) {
    return _.chain(arr).union(other).first(5)
  },

  inputs: [
    [arr(0, 10), arr(5, 15)],
    [arr(0, 100), arr(50, 150)],
  ],
})

compareAlternatives("intersection -> take", {
  lazy: function (arr, other) {
    return Lazy(arr).intersection(other).take(5)
  },
  underscore: function (arr, other) {
    return _.chain(arr).intersection(other).first(5)
  },

  inputs: [
    [arr(0, 10), arr(5, 15)],
    [arr(0, 100), arr(50, 150)],
  ],
})

compareAlternatives("without -> take", {
  lazy: function (arr, other) {
    return Lazy(arr).without(other).take(5)
  },
  underscore: function (arr, other) {
    return _.chain(arr).difference(other).first(5)
  },

  inputs: [
    [arr(0, 10), arr(3, 7)],
    [arr(0, 100), arr(25, 75)],
  ],
})

compareAlternatives("shuffle -> take", {
  lazy: function (arr) {
    return Lazy(arr).shuffle().take(5)
  },
  underscore: function (arr) {
    return _.chain(arr).shuffle().first(5)
  },

  shouldMatch: false,
})

compareAlternatives("zip -> take", {
  lazy: function (arr, other) {
    return Lazy(arr).zip(other).take(5)
  },
  underscore: function (arr, other) {
    return _.chain(arr).zip(other).first(5)
  },

  inputs: [
    [arr(0, 10), arr(5, 15)],
    [arr(0, 100), arr(50, 150)],
  ],
})

compareAlternatives("map -> any", {
  lazy: function (arr) {
    return Lazy(arr).map(inc).any(isEven)
  },
  underscore: function (arr) {
    return _.chain(arr).map(inc).any(isEven)
  },
})

compareAlternatives("map -> all", {
  lazy: function (arr) {
    return Lazy(arr).map(inc).all(isEven)
  },
  underscore: function (arr) {
    return _.chain(arr).map(inc).every(isEven)
  },
})
