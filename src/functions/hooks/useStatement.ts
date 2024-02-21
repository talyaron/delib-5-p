import { useState } from "react";
import { statementSelector } from "../../model/statements/statementsSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export function useListenStatement(statementId: string|undefined ) {
    const statement = useAppSelector(statementSelector(statementId));
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    try {
        if (!statementId) {
            throw new Error("statementId is undefined");
        }
    
        useEffect(() => {
            if (statementId) {
                getStatementFromDB(statementId, dispatch)
                    .then(() => {
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error(error);
                        setError(true);
                        setLoading(false);
                    });
            }
        }, []);
    } catch (error:any) {
        console.error(error);
        return { statement:undefined, loading:false, error:error.message };
    }

   

    return { statement, loading, error };
}