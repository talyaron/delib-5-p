import { RoomAskToJoin } from "delib-npm";

export function partitionRooms(
    participants: RoomAskToJoin[],
    maxParticipants: number,
    axisId: string,
): RoomAskToJoin[][] {
    let rooms: RoomAskToJoin[][] = [];
    let room: RoomAskToJoin[] = [];
    let i = 0;

    // Sort the elements in descending order.
   const  participantsSorted = participants.sort((a, b) => {
        try {
            const paradigmA = a.paradigmAxes?.find(
                (paradigm) => paradigm?.paradigmAxis === axisId,
            );
            const paradigmB = b.paradigmAxes?.find(
                (paradigm) => paradigm?.paradigmAxis === axisId,
            );
            if (paradigmA === undefined || paradigmB === undefined)
                throw new Error("Paradigm not found");
            if (paradigmA.value === undefined || paradigmB.value === undefined)
                throw new Error("Paradigm value not found");
            return paradigmA.value - paradigmB.value;
        } catch (error) {
            console.error(error);
            return 0;
        }
    });
    // Create X empty groups.
    const numberOfRooms = Math.ceil(participantsSorted.length / maxParticipants);
    const roomsArray: RoomAskToJoin[][] = Array.from({ length: numberOfRooms }, () => []);

    participantsSorted.forEach((participant: RoomAskToJoin) => {
        const minimalRoom = roomsArray.reduce((prev, curr) => {
            return prev.length < curr.length ? prev : curr;
        }
    });
    rooms.push(room);
    return rooms;
}

function minimalRoom(rooms: RoomAskToJoin[][],axisId:string): RoomAskToJoin[] {
    let minimalRoom: RoomAskToJoin[] = [];
    rooms.forEach((room: RoomAskToJoin[]) => {
        if (room.length < minimalRoom.length) minimalRoom = room;

        
    }
}
```
