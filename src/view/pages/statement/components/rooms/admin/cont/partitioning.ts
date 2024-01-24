import { Participant } from "delib-npm";

export function partitionRooms(
    participants: Participant[],
    maxParticipants: number,
    axisId: string,
): Participant[][] {
    let rooms: Participant[][] = [];
    let room: Participant[] = [];
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
    const roomsArray: Participant[][] = Array.from({ length: numberOfRooms }, () => []);

    participantsSorted.forEach((participant: Participant) => {
        const minimalRoom = roomsArray.reduce((prev, curr) => {
            return prev.length < curr.length ? prev : curr;
        }
    });
    rooms.push(room);
    return rooms;
}

function minimalRoom(rooms: Participant[][],axisId:string): Participant[] {
    let minimalRoom: Participant[] = [];
    rooms.forEach((room: Participant[]) => {
        if (room.length < minimalRoom.length) minimalRoom = room;


    }
}
```
