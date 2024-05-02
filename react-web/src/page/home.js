import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Box from '@mui/material/Box';
import '../App.css';
import Button from '@mui/material/Button';
import Slider from '../layout/slider';
import LogReg from './loginreg';
const Home = () =>{
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };
    return(
        <Container>
            <Row>
                <Col sm={6}>
                    <i>If you can't find a solution to your problems in our knowledgebase, you can submit a ticket by selecting the appropriate department below.</i>
                    <br/> <br/>
                    <Box><Slider/></Box>
                </Col>
                <Col sm={2}>
                   
                </Col>
                <Col sm={4}>
                    {/* <Box><CategoryList/></Box> */}
                    <Button variant="outlined">Please Login</Button>
                    <br/>
                    <LogReg/>
                </Col>
            </Row>
        </Container>
    )
}

export default Home