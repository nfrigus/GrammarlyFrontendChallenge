export function transpose(m) {
  let mt = []
  let rows = m.length
  let cols = m[0].length

  for (let j = 0; j < cols; j++) {
    for (let i = 0; i < rows; i++) {
      if (!mt[j]) {
        mt[j] = []
      }
      mt[j][i] = m[i][j]
    }
  }

  return mt
}
