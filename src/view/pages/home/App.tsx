import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../functions/hooks/reduxHooks';

import {  deleteSubscribedStatement,  setStatementSubscription } from '../../../model/statements/statementsSlice';
import { StatementSubscription } from 'delib-npm';
import { listenStatmentsSubsciptions } from '../../../functions/db/statements/getStatement';

import useAuth from '../../../functions/hooks/authHooks';
import { userSelector } from '../../../model/users/userSlice';

export const listenedStatements = new Set<string>();
let unsubscribe: Function = () => { };

function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLgged = useAuth();
  const user = useAppSelector(userSelector);

  function updateStoreStSubCB(statementSubscription: StatementSubscription) {
    dispatch(setStatementSubscription(statementSubscription));
  }
  function deleteStoreStSubCB(statementId: string) {
    dispatch(deleteSubscribedStatement(statementId));
  }



  useEffect(() => {

    if (isLgged) {

      unsubscribe = listenStatmentsSubsciptions(updateStoreStSubCB, deleteStoreStSubCB);
    }
    return () => {
      unsubscribe()
    }
  }, [isLgged])



  useEffect(() => {

    if (!user) navigate('/');
   

  }, [user])
  return (
    <>
      <Outlet />
    </>
  )
}

export default App
