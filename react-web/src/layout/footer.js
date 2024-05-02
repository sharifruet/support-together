import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { FaFacebook, FaGoogle, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
const Footer = () =>{
    return (
        <Container fluid style={{position:'fixed',left:'0',bottom:'0',right:'0',color:'#ffffff'}}>
            <Row className='bg-secondary' style={{padding:'10px'}}>
                <Col sm={3}>
                     <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <Button size="small"><FaFacebook/></Button>
                        <Button size="small"><FaGoogle/></Button>
                        <Button size="small"><FaYoutube/></Button>
                        <Button size="small"><FaTwitter/></Button>
                    </ButtonGroup>
                </Col>
                <Col sm={6}>Copyright @ 2023 Open-Support</Col>
                <Col sm={3}></Col>
            </Row>
        </Container>
    );
}

export default Footer