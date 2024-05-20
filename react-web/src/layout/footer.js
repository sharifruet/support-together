import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaFacebook, FaGoogle, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
const Footer = () =>{
    return (
        <Container fluid style={{position:'fixed', bottom:'0'}}>
            <Row className='bg-secondary p-2 text-white' >
                <Col>Powered by <a className='link-light link-underline link-underline-opacity-0' href="https://www.i2gether.com"> <img src="https://hirebangladeshi.com/uploads/company/logo/9edcc8ca-8965-428a-8b69-bfb63a920f9c/Together_logo.png" style={{height:20}}/> Together Initiatives (p) Limites</a></Col>
            </Row>
        </Container>
    );
}

export default Footer