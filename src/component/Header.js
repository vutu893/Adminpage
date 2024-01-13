import { useContext} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';

const Header = (props) => {

    const { logout, user } = useContext(UserContext)

    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
        toast.success('Log out success!')
    }

    
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>                
                <NavLink to='/' className='nav-link'><span>H3TSHOP</span></NavLink>                    
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav"> 
                    {(user && user.auth || window.location.pathname === '/') &&
                        <>                                  
                            <Nav className="me-auto">                                                 
                                <NavLink to='/' className='nav-link'><span>HOME</span></NavLink>                                                                    
                                <NavLink to='/listusers' className='nav-link'><span>Manage Users</span></NavLink>                       
                            </Nav>
                            <Nav>
                                {user && user.email && user.auth === true && <span className='nav-link'>Welcom {user.email}</span>}
                                <NavDropdown title="Setting">
                                    {user && user.auth !== true                                      
                                        ? <NavLink to='/login' className='nav-link'><span>Log in</span></NavLink>    
                                        : <NavLink to='/login' className='nav-link' onClick={() => {handleLogout()}}><span>Log out</span></NavLink>                                
                                    }
                                </NavDropdown>
                            </Nav>
                        </>
                    }   
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header