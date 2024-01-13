import Header from './component/Header';
import TableUsers from './component/TableUsers';
import Container from 'react-bootstrap/Container';
import './App.scss';
import Login from './component/Login';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import Home from './component/Home';
import { UserContext } from './context/UserContext';
import { useContext, useEffect } from 'react';



function App() {

  const { loginContext } = useContext(UserContext)

  useEffect( () => {
    if(localStorage.getItem('token')) {
      loginContext(localStorage.getItem('email'), localStorage.getItem('token'))
    }
  },[])

  return (
    <>
      <div className='app-container'>
        <Header />
        <Container>       
          <Routes>
             <Route path='/' element={<Home />} />
             <Route path='/listusers' element={<TableUsers />} />
             <Route path='/login' element={<Login />} />
          </Routes>
        </Container>
        
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
