import React, { useState, useContext,useEffect } from 'react';
import { Button, CssBaseline, TextField, FormControlLabel, Grid, Box, Container, Checkbox } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "../api/axios";
import GlobalContext from '../GlobalContext';

const defaultTheme = createTheme();

export default function Ticket() {
    const [ticket, setTicket] = useState({});
    const {headerConfig} = useContext(GlobalContext);

    const location = useLocation();

    useEffect(() => {
        const code = location.pathname.split("/")[2];
        axios.get('/tickets/code/'+code, headerConfig()
        ).then(data=>{
            console.log(data.data);
            setTicket(data.data);
        });
    },[]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <h3>{ticket.code}</h3>
                <h1>{ticket.title}</h1>
                <p>{ticket.description}</p>
            </Container>
        </ThemeProvider>
    );
}
