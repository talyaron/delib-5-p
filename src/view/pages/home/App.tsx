import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector } from '../../../functions/hooks/reduxHooks';
import { userSelector } from '../../../model/users/userSlice';



function App() {
  const navigate = useNavigate();


  const user = useAppSelector(userSelector)
  useEffect(() => {
    
      if(!user) navigate('/');
 
  }, [user])
  return (
    <>
      <Outlet />
    </>
  )
}

export default App
