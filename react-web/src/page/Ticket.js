import React, { useState, useContext,useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Form, useLocation } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from "../api/axios";
import GlobalContext from '../GlobalContext';
import { Image } from 'react-bootstrap';
import { MenuItem, Select } from '@mui/material';
import {BASE_URL} from '../conf';
import Comment from '../components/tickets/Comment';
const Comments_URL = "/comments"; 

  
export default function Ticket() {
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState();
    const {headerConfig, users} = useContext(GlobalContext);
    const location = useLocation();

    const attachments=["1717498199815-44267254.PNG","1717498199820-686742128.png"];

    const loadTicket = ()=>{
        const code = location.pathname.split("/")[3];
        axios.get(`/tickets/code/${code}`, headerConfig()
        ).then(data=>{
            setTicket(data.data);
        });
    }

    useEffect(() => {
        loadTicket();
    },[]);

    const loadComments = ()=>{
        axios.get(`/tickets/${ ticket.id }/comments`, headerConfig()
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
        axios.post(
            Comments_URL, 
            { content: comment, ticketId: ticket.id },
            headerConfig()
        ).then(response =>{
            setComment('');
            loadComments();
        }).catch((error) => console.log(error));
    }

    const changeStatus = (e) => {
        axios.put(`/tickets/${ticket.id}`, 
            {status: e.target.value},
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
                <Col sm={8}> 
                    <Card>
                        <Card.Body className='text-left'>
                            <p><label>Code:</label> {ticket?.code}</p>
                            <p><label>Title:</label> {ticket?.title}</p>
                            <p><label>Description:</label><br/> {ticket?.description}</p>

                            <br/>
                            {attachments.map((fileName)=>(                               
                                <Image style={{width: "200px"}} src={`${BASE_URL}/uploads/${fileName}`}/>
                            )
                            )}
                        </Card.Body>
                    </Card>

                    
                    <ListGroup>
                            {comments.map((comment)=>(   
                                <ListGroup.Item key={comment.id} style={{textAlign:'left'}}>
                                    <Comment comment={comment}/>
                                </ListGroup.Item>
                            )
                            )}
                    </ListGroup>
                    <br/>
                    <textarea placeholder='Comments...' className='form-control'  onChange={e => setComment(e.target.value)}></textarea>
                    <br/>
                    <Button onClick={()=>postComment()}>Send</Button>
                       

                </Col>
                <Col sm={4}>
                    <Card>
                        <Card.Body>
                            <Table responsive>
                                <Select style={{float:'right'}} labelId="demo-simple-select-label"
                                    id="demo-simple-select"  value={ticket?.status || ''}  label="Status"
                                    onChange={changeStatus}
                                >
                                    <MenuItem value='Created'>Created</MenuItem>
                                    <MenuItem value='Assigned'>Assigned</MenuItem>
                                    <MenuItem value='Done'>Done</MenuItem>
                                </Select>

                                {/* <Select
                                    style={{ float: 'right' }}
                                    labelId="status-select-label"
                                    id="status-select"
                                    value={ticket?.status || ''}
                                    label="Status"
                                    onChange={changeStatus}
                                >
                                    <MenuItem value='Created'>Created</MenuItem>
                                    <MenuItem value='Assigned'>Assigned</MenuItem>
                                    <MenuItem value='Done'>Done</MenuItem>
                                </Select> */}

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
