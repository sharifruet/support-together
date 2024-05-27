import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
import { useContext } from 'react';
import GlobalContext from '../GlobalContext';
const NavBar = () =>{
    const lock = useNavigate()
    const handleClick = () =>{
        lock(-1)
    }
    const gContext = useContext(GlobalContext);

    return(
        <Container fluid>
            <Row>
                <Navbar bg="dark" className="navbar navbar-expand-sm bg-dark navbar-dark sticky-top">
                    <ul className="navbar-nav">

                        <li className="nav-item"><Link style={{color:'#fff',fontWeight:'400',fontFamily: 'revert'}} className="nav-link active" to='/dashboard'> <img style={{height:30}} src="../../public/support-together.png"/> Home</Link></li>
                        <li className="nav-item"><Link style={{color:'#fff',fontWeight:'400',fontFamily: 'revert'}} className="nav-link" to='/about'>Support</Link></li>          
                    </ul>
                    <ul className="navbar-nav" style={{marginLeft:'Auto',paddingRight:'10px'}}>
                        {gContext.loggedIn===false?(
                            <>
                                <li className="nav-item"><Link style={{color:'#fff',fontWeight:'400',fontFamily: 'revert'}} className="nav-link" to='/loginreg'><FaSignInAlt/> Login</Link></li>
                                <li className="nav-item"><Link style={{color:'#fff',fontWeight:'400',fontFamily: 'revert'}} className="nav-link" to='/signup'> Signup</Link></li>
                            </>
                        ):(
                            <li className="nav-item"><Button onClick={gContext.onLogout}><FaSignInAlt/> Logout</Button></li>
                        )}
                    </ul>
                </Navbar>
            </Row>
            <br/>
        </Container>
        
    )     
}

export default NavBar