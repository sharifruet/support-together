import React, { useState, useContext,useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useLocation } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from "../api/axios";
import GlobalContext from '../GlobalContext';
import { Image } from 'react-bootstrap';
import { MdOutlineHeight } from 'react-icons/md';
import { MenuItem, Select } from '@mui/material';
const Comments_URL = "/comments"; 

  
export default function Ticket() {
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState();
    const {headerConfig} = useContext(GlobalContext);

    const location = useLocation();

    const attachments=["1717498199815-44267254.PNG","1717498199820-686742128.png"];

    const loadTicket = ()=>{
        const code = location.pathname.split("/")[2];
        axios.get('/tickets/code/'+code, headerConfig()
        ).then(data=>{
            setTicket(data.data);
        });
    }

    useEffect(() => {
        loadTicket();
    },[]);

    const loadComments = ()=>{
        axios.get('/tickets/' + ticket.id + '/comments', headerConfig()
        ).then(data=>{
            setComments(data.data);
        });
    }
    useEffect(() => {
        if(ticket == null )
            return;
        loadComments();
    },[ticket]);

    const postComment = () => {
        try {
            axios.post(
            Comments_URL, 
            JSON.stringify({ content: comment, ticketId: ticket.id }),
            headerConfig()
            ).then(response =>{
                loadComments();
            });
        } catch (err) {
            if (!err?.response) {
                alert("No Server Response");
            } else if (err.response?.status === 401) {
                alert("Unauthorized");
            } else {
                alert("Failed Added");
            }    
        }
    }

    const changeStatus = (e) => {
        axios.put('/tickets/'+ticket.id, 
            JSON.stringify({status: e.target.value}),
            headerConfig()
        ).then(response =>{
            loadTicket();
            console.log('Status Updated');
        }).catch(err=>{
            console.log(err);
        });
    }

    return (
        <Container fluid="md">
            <Row>
                <Col sm={12}><b style={{float:'left'}}>TICKET DETAILS</b>
                    <Select style={{float:'right'}} labelId="demo-simple-select-label"
                        id="demo-simple-select"  value={ticket?.status}  label="Status"
                        onChange={changeStatus}
                    >
                        <MenuItem value='Created'>Created</MenuItem>
                        <MenuItem value='Assigned'>Assigned</MenuItem>
                        <MenuItem value='Done'>Done</MenuItem>
                    </Select>
                </Col>
                <Col sm={8}> 
                    <Card>
                        <Card.Body>
                            <Table responsive>
                                <tbody>
                                    <tr><td><b>Code</b> :</td> <td> {ticket?.code}</td></tr>
                                    <tr><td><b>Title</b> :</td> <td> {ticket?.title}</td></tr>
                                    <tr aria-rowspan={2}><td colSpan={2}> {ticket?.description}</td></tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            {attachments.map((fileName)=>(                               
                                <Image style={{width: "200px"}} src={'http://localhost:5000/api/uploads/'+fileName}/>
                            )
                            )}
                        </Card.Body>
                    </Card>

                    <Card style={{minHeight:'500px'}}>
                        <Card.Body> 
                            {comments.map((comment)=>(   
                                <ListGroup>
                                    <ListGroup.Item style={{textAlign:'left'}}>{comment.content}</ListGroup.Item>
                                </ListGroup>                            
                            )
                            )}
                            <br/>
                            <textarea placeholder='Comments...' className='form-control'  onChange={e => setComment(e.target.value)}></textarea>
                            <br/>
                            <Button onClick={()=>postComment()}>Send</Button>
                        </Card.Body>
                    </Card>

                </Col>
                <Col sm={4}>
                    <Card>
                        <Card.Body>
                            <Table responsive>
                                <tbody>
                                    <tr><td><b>Status</b> :</td> <td> {ticket?.status}</td></tr>
                                    <tr><td><b>Project</b> :</td> <td> {ticket?.topicId}</td></tr>
                                    <tr><td><b>Created date</b> :</td> <td> {ticket?.createdAt}</td></tr>
                                    <tr><td><b>Updated date</b> :</td> <td> {ticket?.updatedAt}</td></tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
