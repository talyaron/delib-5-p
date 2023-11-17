export function bubbleclass(isQuestion: boolean | undefined, isMe: boolean) {
    if (isQuestion) {
        if (isMe) {
            return "bubble right question--yes";
        } else {
            return "bubble left question--yes";
        }
    } else {
        if (isMe) {
            return "bubble right question--no";
        } else {
            return "bubble left question--no";
        }
    }
}
