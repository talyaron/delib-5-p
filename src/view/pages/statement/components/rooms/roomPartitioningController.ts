import { Participant } from "delib-npm";

export function partitionRooms(
	participants: Participant[],
	maxParticipants: number,
	axisId: string,
): Participant[][] {

	//see documentation for more details (partitionProblem.md)

	// Sort the elements in descending order.
	const participantsSorted = getSortedPartipants(participants, axisId)

	// Create X empty groups.
	const numberOfRooms = Math.ceil(
		participantsSorted.length / maxParticipants,
	);
	const rooms: Participant[][] = new Array(numberOfRooms);
	participantsSorted.forEach((participant) => {
		const roomIndex = getMinimalRoomIndex(rooms, axisId);
		rooms[roomIndex].push(participant);
	});

	return rooms;
}

function getMinimalRoomIndex(rooms: Participant[][], axisId: string): number {
	const minimalParticipantsRoom: Participant[] = [];
	let minimalParticipantsRoomIndex = 0;

	//find the room with the least amount of participants
	for (let i = 0; i < rooms.length; i++) {
		if (rooms[i].length < minimalParticipantsRoom.length) {
			minimalParticipantsRoomIndex = i;
		}
	}

	//find the room leat amount of participants paradigm value
	const roomsValue: number[] = [];
	rooms.forEach((room, index) => {
		let sumValue = 0;
		room.forEach((participant) => {
			const paradigm = participant.paradigmAxes?.find(
				(paradigm) => paradigm?.paradigmAxis === axisId,
			);
			if (paradigm?.value) {
				sumValue += paradigm.value;
			}
		});
		roomsValue[index] = sumValue;
	});

	//return the room with least value in roomsValue array
	const minValue: number = Math.min(...roomsValue);
	const minimalValueRoomIndex = roomsValue.indexOf(minValue);

	return minimalParticipantsRoomIndex === minimalValueRoomIndex
		? minimalParticipantsRoomIndex
		: minimalValueRoomIndex;
}

function getSortedPartipants(participants:Participant[], axisId:string):Participant[]{
	return  participants.sort((a, b) => {
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
}
