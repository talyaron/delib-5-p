import { Statement } from "delib-npm";

export function getTops(sortedSubStatements: Statement[]): {statementId: string, top: number}[] {
  let topSum = 30;
  const tops: number[] = [topSum];

  sortedSubStatements.forEach((statementSub: Statement, i: number) => {
    //get the top of the element
    if (statementSub.elementHight) {
      topSum += statementSub.elementHight + 30;
      tops.push(topSum);
    }
  });

  return tops;
}