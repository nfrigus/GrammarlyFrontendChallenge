import { solve } from "./solver";
import { times } from "./data";

window.go = () => {
  const res = solve(
    times,
    { floor: window.currentFloor.value, room: window.currentRoom.value },
    { floor: window.nextFloor.value, room: window.nextRoom.value }
  )

  window.currentFloor.value = window.nextFloor.value
  window.currentRoom.value = window.nextRoom.value
};
