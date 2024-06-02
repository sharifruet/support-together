import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Navbar, Button } from 'react-bootstrap';
import GlobalContext from '../GlobalContext';
import UserAvatar from '../components/common/UserAvatar';

const NavBar = () => {
    const { loggedIn, onLogout } = useContext(GlobalContext);

    // Define JSON configuration for the navigation items
    const navItems = [
        { title: 'Home', path: '/dashboard', imgPath: '/support-together.png', icon: '', condition: true, action: '', itemType: 'navigation' },
        { title: 'Support', path: '/about', imgPath: '', icon: '', condition: true, action: '', itemType: 'navigation' },
        { title: 'Login', path: '/login', imgPath: '', icon: <FaSignInAlt />, condition: !loggedIn, action: '', itemType: 'authentication' },
        // { title: 'Signup', path: '/signup', imgPath: '', icon: '', condition: !loggedIn, action: '', itemType: 'authentication' },
        { title: <UserAvatar />, path: '', imgPath: '', icon: <FaSignOutAlt />, condition: loggedIn, action: "userProfile", itemType: 'authentication' },
    ];

    return (
        <Container fluid>
            <Row>
                <Navbar bg="dark" className="navbar navbar-expand-sm bg-dark navbar-dark sticky-top" style={{ position: 'relative' }}>
                    <ul className="navbar-nav w-100">
                        {navItems.filter(item => item.condition).map((item, index) => (
                            <li className={`nav-item ${item.itemType === 'authentication' ? 'ml-auto me-1 pe-2' : ''}`} key={index} style={{ position: item.title === 'Signup' ? 'absolute' : 'static', right: item.title === 'Signup' ? 80 : '', }}>
                                {item.action ? (
                                    <>
                                     {/* <Button style={{ color: '#fff', fontWeight: '400', fontFamily: 'revert' }}> */}
                                        {item.title}
                                    {/* // </Button> */}
                                    </>
                                ) : (
                                    <Link className={`nav-link ${index === 0 ? 'active d-flex' : ''}`} to={item.path} style={{ color: '#fff', fontWeight: '400', fontFamily: 'revert' }}>
                                        <span className="me-1">{item.imgPath ? <img src={item.imgPath} alt="logo" style={{ height: 30, marginRight: '15px' }} /> : item.icon}</span>
                                        <span>{item.title}</span>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </Navbar>
            </Row>
            <br />
        </Container>
    );
}

export default NavBar;
