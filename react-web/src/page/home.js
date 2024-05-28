import React, { useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Box from '@mui/material/Box';
import '../App.css';
import Slider from '../layout/slider';
import LogReg from './Login';
import GlobalContext from '../GlobalContext';
import { useNavigate } from 'react-router-dom';


const Home = () =>{
    const gContext = useContext(GlobalContext);
    const navigate = useNavigate();

    useEffect(()=>{
        if(gContext.loggedIn){
            navigate("/dashboard");
        }
    },[]);

    return(
        <Container>
            <Row>
                <Col sm={6}>
                    <i>If you can't find a solution to your problems in our knowledgebase, you can submit a ticket by selecting the appropriate topic.</i>
                    <Box><Slider/></Box>
                </Col>
                <Col sm={2}>
                   
                </Col>
                <Col sm={4}>
                    <LogReg/> 
                </Col>
            </Row>
        </Container>
    )
}

export default Home