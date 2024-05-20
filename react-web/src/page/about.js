import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Image,thumbnail} from 'react-bootstrap/Image';
const About = () =>{
    return (
        <Container>
          <Row>
            <Col sm={8}>
                <p style={{textAlign:'justify',paddingBlock:'10px',fontFamily:'Gill Sans'}}> 
                the ticketing platform that supports your team, so they can support your customers. Say goodbye to complicated and embrace a new era of seamless, efficient, and customer-centric support with
                </p>
                <ul  style={{textAlign:'justify',paddingBlock:'10px',fontFamily:'Gill Sans'}}>
                    <li><b>Authenticity</b>: We aim to capture the authenticity and charm of physical markets by curating a diverse range of high-quality products that reflect the unique offerings found in traditional marketplaces.</li>
                    <li><b>Interactive Experience</b>: Through innovative technologies and user-friendly interfaces, we intend to create an engaging and interactive online shopping experience. This may include features such as 360-degree product views, virtual product demonstrations, and real-time customer support.</li>
                </ul>
            </Col>
            <Col sm={4}><img src="./sdv.png" className='rounded' style={{maxWidth:'400px'}}/></Col>
          </Row>
        </Container>
    );
}

export default About