import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaFacebook, FaGoogle, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <Container fluid style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
            <Row className="bg-secondary p-2 text-white">
                <Col className="d-flex justify-content-center align-items-center">
                    Powered by
                    <a
                        className="link-light link-underline link-underline-opacity-0 ms-1 me-2"
                        href="https://www.i2gether.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="https://hirebangladeshi.com/uploads/company/logo/9edcc8ca-8965-428a-8b69-bfb63a920f9c/Together_logo.png"
                            alt="Together Initiatives"
                            style={{ height: 20, marginLeft: 5 }}
                        />
                    </a>
                    Together Initiatives (P) Limited
                </Col>
            </Row>
        </Container>
    );
}

export default Footer;
