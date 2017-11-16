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
  // TODO: implement me
  return [{ floor: 0, room: 0 }, { floor: 1, room: 1 }]
}

window.solve = solve