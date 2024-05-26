import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Navbar, Button } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
import GlobalContext from '../GlobalContext';

const NavBar = () => {
    const navigate = useNavigate();
    const gContext = useContext(GlobalContext);

    return (
        <Container fluid>
            <Row>
                <Navbar bg="dark" className="navbar navbar-expand-sm bg-dark navbar-dark sticky-top">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link active d-flex" to='/dashboard' style={{ color: '#fff', fontWeight: '400', fontFamily: 'revert' }}>
                                <img src="/support-together.png" alt="logo" style={{ height: 30 }} /> Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/about' style={{ color: '#fff', fontWeight: '400', fontFamily: 'revert' }}>
                                Support
                            </Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav" style={{ marginLeft: 'auto', paddingRight: '10px' }}>
                        {gContext.loggedIn === false ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link d-flex justify-center" to='/loginreg' style={{ color: '#fff', fontWeight: '400', fontFamily: 'revert' }}>
                                        <FaSignInAlt className="mr-2 fs-5 mt-1"/>
                                        <span>Login</span>                                        
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to='/signup' style={{ color: '#fff', fontWeight: '400', fontFamily: 'revert' }}>
                                        Signup
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Button onClick={gContext.onLogout} style={{ color: '#fff', fontWeight: '400', fontFamily: 'revert' }}>
                                    <FaSignInAlt /> Logout
                                </Button>
                            </li>
                        )}
                    </ul>
                </Navbar>
            </Row>
            <br />
        </Container>
    );
}

export default NavBar;
