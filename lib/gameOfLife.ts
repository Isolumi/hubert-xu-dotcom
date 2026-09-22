export type LifeGrid = number[][]

export function stepLife(grid: LifeGrid): LifeGrid {
  const rows = grid.length
  const columns = grid[0]?.length ?? 0
  const next = Array.from({ length: rows }, () => Array<number>(columns).fill(0))

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      let neighbors = 0
      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          if (offsetX === 0 && offsetY === 0) continue
          neighbors += grid[y + offsetY]?.[x + offsetX] ?? 0
        }
      }

      next[y][x] = grid[y][x] === 1
        ? Number(neighbors === 2 || neighbors === 3)
        : Number(neighbors === 3)
    }
  }

  return next
}
