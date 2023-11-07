import { doc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import { DB } from '../config';
import { Collections, ResultsBy } from 'delib-npm';

export async function updateResults(statementId:string, resultsBy:ResultsBy = ResultsBy.topOptions){
    try {
        z.string().parse(statementId);

        const statementRef = doc(DB, Collections.resultsTriggers, statementId);
        await setDoc(statementRef, {results: new Date().getTime(), resultsBy}, { merge: true });
        
    } catch (error) {
        console.error(error)
    }
}