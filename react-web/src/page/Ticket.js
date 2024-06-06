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
import { MenuItem, Select } from '@mui/material';
import {BASE_URL, TICKET_STATUS_LIST} from '../conf';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Comment from '../components/tickets/Comment';
import { format } from 'date-fns';
const Comments_URL = "/comments"; 

export default function Ticket() {
    const [ticket, setTicket] = useState(null);
    const [status, setStatus] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState();
    const [topic, setTopic] = useState(null);
    const [project, setProject] = useState(null);
    const {headerConfig, users,topics, projects} = useContext(GlobalContext);
    const location = useLocation();

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

    useEffect(() => {
        if(ticket){
            
            setStatus(ticket.status);
            const topic = topics?.find(t=>t.id == ticket.topicId);
            console.log(topic);
            const project = projects?.find(p=>p.id===topic?.ProjectId);
            setTopic(topic);
            setProject(project);
            loadComments();
        }
    },[ticket]);

    const loadComments = ()=>{
        axios.get(`/tickets/${ ticket.id }/comments`, headerConfig()
        ).then(data=>{
            setComments(data.data.reverse());
        });
    }

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
        const newStatus = e.target.value;
        setStatus(newStatus);
        axios.put(`/tickets/${ticket.id}/status/${newStatus}`, 
            {},
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
                        <Card.Body className='text-left fs-5'>
                            <p><label className='fw-bold'>Code:</label> {ticket?.code}</p>
                            <p><label className='fw-bold'>Title:</label> {ticket?.title}</p>
                            <p><label className='fw-bold'>Description:</label><br/> {ticket?.description}</p>

                            <br/>
                            {ticket?.attachments.map((attachment)=>(                               
                                <Image key={attachment.id} style={{width: "200px"}} src={`${BASE_URL}/${attachment.fileName}`}/>
                            )
                            )}
                        </Card.Body>
                    </Card>

                    <InputGroup className='my-2'>
                        <Form.Control as="textarea" value={comment} aria-label="With textarea" onChange={e => setComment(e.target.value)}/>
                        <InputGroup.Text><Button variant="primary" onClick={()=>postComment()} > Send </Button></InputGroup.Text>
                    </InputGroup>

                    <ListGroup className='p-0'>
                            {comments.map((comnt)=>(   
                                <ListGroup.Item  className='p-0 mt-1' key={comnt.id} style={{textAlign:'left'}}>
                                    <Comment comment={comnt}/>
                                </ListGroup.Item>
                            )
                            )}
                    </ListGroup>
                    <br/>
                    <br/>
                </Col>
                <Col sm={4}>
                    <Card>
                        <Card.Body>
                            <Table>
                                <tbody>
                                    <tr><td><b>Status</b> :</td>
                                        <td> 
                                            <Select labelId="ticket-status-select-label" id="ticket-status-select" onChange={changeStatus} value={status||''} >
                                                {TICKET_STATUS_LIST.map(status=>(
                                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                                ))}
                                            </Select>
                                        </td>
                                    </tr>
                                    <tr><td><b>Topic</b> :</td> <td> {topic?.name}</td></tr>
                                    <tr><td><b>Project</b> :</td> <td> {project?.name}</td></tr>
                                    <tr><td><b>Created date</b> :</td> <td> {format(new Date(ticket?.createdAt||'2024'),'yyyy-MM-dd hh:mm aaa')}</td></tr>
                                    <tr><td><b>Updated date</b> :</td> <td> {format(new Date(ticket?.updatedAt||'2024'),'yyyy-MM-dd hh:mm aaa')} </td></tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
