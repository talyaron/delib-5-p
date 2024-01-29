export function fromMilliseconsToFourDigits(millis: number):number[] {

    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    const minutesFirstDigit = Math.floor(minutes / 10);
    const minutesSecondDigit = minutes % 10;
    const secondsFirstDigit = Math.floor(seconds / 10);
    const secondsSecondDigit = seconds % 10;

    return [minutesFirstDigit,minutesSecondDigit,secondsFirstDigit,secondsSecondDigit]
   
}

export function fromFourDigitsToMillisecons(digits: number[]):number {
    const minutes = digits[0]*10 + digits[1];
    const seconds = digits[2]*10 + digits[3];
    return (seconds + minutes * 60) * 1000;
   
}