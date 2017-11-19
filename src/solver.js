import { Graph, astar } from "javascript-astar"

/**
 * Find a shortes path from start to end
 *
 * @param times number[][] - A matrix specifying the time it takes
 * for the lift to pass through an apartment.
 * times[i][j] equals 0 means that there is no way through that apartment [i,j].
 *
 * @param start {floor: number, room: number}
 * @param end {floor: number, room: number}
 *
 * @returns {floor: number, room: number}[] - shortest path from `start` to `end`
 */
export function solve(times, start, end) {
  times = times.slice().reverse()
  const building = new Graph(times)
  const liftPosition = building.grid[start.floor][start.room]
  const liftDestionation = building.grid[end.floor][end.room]

  return astar.search(
    building,
    liftPosition,
    liftDestionation,
  ).map(i => ({
    floor: i.x,
    room: i.y,
  }));
}

window.solve = solve
