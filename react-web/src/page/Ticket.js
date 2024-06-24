import React, { useState, useContext,useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useLocation } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from "../api/axios";
import GlobalContext from '../GlobalContext';
import { Image } from 'react-bootstrap';
import {BASE_URL, TICKET_STATUS_LIST, PRIORITY_COLOR, PRIORITY_LIST} from '../conf';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Comment from '../components/tickets/Comment';
import moment from 'moment';
import ResponseTimeProgressBar from '../components/common/ResponseTimeProgressBar';
const Comments_URL = "/comments"; 

export default function Ticket() {
    const [ticket, setTicket] = useState(null);
    const [status, setStatus] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState();
    const [topic, setTopic] = useState(null);
    const [project, setProject] = useState(null);
    const {headerConfig, users, topics, projects} = useContext(GlobalContext);
    const location = useLocation();

    const loadTicket = ()=>{
    
        const code = location.pathname.split("/")[2];
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
            console.log("Topics....");
            console.log(topics);
            setStatus(ticket.status);
            const topic = topics?.find(t=>t.id === ticket.topicId);
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

    const getUserName = (id) => users?.find(u=>u.id===id)?.name;

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
                            {ticket?.attachments?.map((attachment)=>(                               
                                <Image key={attachment.id} style={{width: "200px"}} src={`${BASE_URL}/${attachment?.fileName}`}/>
                            )
                            )}
                        </Card.Body>
                    </Card>

                    <InputGroup className='my-2'>
                        <Form.Control as="textarea" value={comment} aria-label="With textarea" onChange={e => setComment(e.target.value)}/>
                        <InputGroup.Text><Button variant="primary" onClick={()=>postComment()} > Send </Button></InputGroup.Text>
                    </InputGroup>

                    <ListGroup className='p-0'>
                            {comments.map((comment)=>(   
                                <ListGroup.Item  className='p-0 mt-1' key={comment.id} style={{textAlign:'left'}}>
                                    <Comment comment={comment}/>
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
                            <Row>
                                <Col className='text-end'>Status</Col>
                                <Col className='text-left'>
                                    <Form.Select onChange={changeStatus} value={status||''}>
                                        {TICKET_STATUS_LIST?.map(status=>(
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='text-end'>Created By</Col>
                                <Col className='text-left'>{getUserName(ticket?.createdBy)}</Col>
                            </Row>
                            <Row>
                                <Col className='text-end'>Topic</Col>
                                <Col className='text-left'>{topic?.name}</Col>
                            </Row>
                            <Row>
                                <Col className='text-end'>Project</Col>
                                <Col className='text-left'>{project?.name}</Col>
                            </Row>
                            <Row>
                                <Col className='text-end'>Priority</Col>
                                <Col className='text-left'><span className={`badge rounded-pill text-bg-primary ${PRIORITY_COLOR[ticket?.priority]}`}>{PRIORITY_LIST[ticket?.priority]}</span></Col>
                            </Row>
                            <Row>
                                <Col className='text-end'>Created date</Col>
                                <Col className='text-left'>{moment(ticket?.createdAt)?.format('ddd, D MMMM, YYYY hh:mm A')}</Col>
                            </Row>
                            <Row>
                                <Col className='text-end'>Updated date</Col>
                                <Col className='text-left'>{moment(ticket?.createdAt)?.format('ddd, D MMMM, YYYY hh:mm A')}</Col>
                            </Row>
                            <Row>
                                <Col>
                                    <ResponseTimeProgressBar createdAt={ticket?.createdAt} updatedAt={ticket?.updatedAt} priority={ticket?.priority} responseStatus={ticket?.status}/>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    {ticket?.status !== 'Created' &&
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col className='text-end'>Assignment Status</Col>
                                <Col className='text-left'>{ticket?.assignmentStatus}</Col>
                            </Row>
                            <Row>
                                <Col className='text-end'>Assigned To</Col>
                                <Col className='text-left'>{getUserName(ticket?.assignedTo) }</Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    }
                </Col>
            </Row>
        </Container>
    );
}
