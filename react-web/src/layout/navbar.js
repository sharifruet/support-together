import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Navbar, NavDropdown } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
const NavBar = () =>{
    const lock = useNavigate()
    const handleClick = () =>{
        lock(-1)
    }
    return(
        <Container fluid>
            <Row>
                <Navbar bg="dark" className="navbar navbar-expand-sm bg-dark navbar-dark sticky-top">
                    <ul className="navbar-nav">
                        <li className="nav-item"><Link style={{color:'#fff',fontWeight:'400',fontFamily: 'revert'}} className="nav-link active" to='/home'>Home</Link></li>
                        <li className="nav-item"><Link style={{color:'#fff',fontWeight:'400',fontFamily: 'revert'}} className="nav-link" to='/about'>Support</Link></li>
                    </ul>
                    <NavDropdown title="Why Us" id="nav-dropdown" style={{color:'#fff',fontWeight:'400',fontFamily: 'revert'}}>
                        <NavDropdown.Item eventKey="4.1">Policy</NavDropdown.Item>
                        <NavDropdown.Item eventKey="4.2">Administration Action</NavDropdown.Item>
                        <NavDropdown.Item eventKey="4.3">24/Help</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item eventKey="4.4">Complain Box</NavDropdown.Item>
                    </NavDropdown>
                    <ul className="navbar-nav" style={{marginLeft:'Auto',paddingRight:'10px'}}>
                        <li className="nav-item"><Link style={{color:'#fff',fontWeight:'400',fontFamily: 'revert'}} className="nav-link" to='/loginreg'><FaSignInAlt/> Login</Link></li>
                        <li className="nav-item"><Link style={{color:'#fff',fontWeight:'400',fontFamily: 'revert'}} className="nav-link" to='/signup'> Signup</Link></li>
                    </ul>
                </Navbar>
            </Row>
            <br/>
        </Container>
        
    )     
}

export default NavBar