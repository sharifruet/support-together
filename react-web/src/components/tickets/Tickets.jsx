import React, { useState, useEffect, useCallback } from 'react';
import { Table, Container, Row, Col, Form, Button, Modal, Pagination, ListGroup, Badge } from 'react-bootstrap';
import useCrud from '../../hooks/useCrud';
import './TicketsStyles.css';
import TicketModal from "./TicketModal";
import { ReactComponent as AddIcon } from '../../assets/svgIcons/add.svg';
import OpenModalButton from '../common/OpenModalButton';
import { Link, useNavigate } from 'react-router-dom';

const Tickets = () => {
    const { getAll } = useCrud();
    const ticketUrl = "/tickets";

    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [modalType, setModalType] = useState(null);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(1);
    };

    const handleOpenModal = (ticket, modalType) => {
        setSelectedTicket(ticket);
        setModalType(modalType);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedTicket(null);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const fetchTickets = async () => {
        try {
            const data = await getAll(ticketUrl);
            console.log(data)
            setTickets(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const filteredTickets = tickets.filter((ticket) =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let sortedTickets = [...filteredTickets];
    if (sortField) {
        sortedTickets = sortedTickets.sort((a, b) => {
            const x = a[sortField];
            const y = b[sortField];
            return sortOrder === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
        });
    }

    const startIndex = (page - 1) * rowsPerPage;
    const paginatedTickets = sortedTickets.slice(startIndex, startIndex + rowsPerPage);

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Col>
                        <div className="col-span-1 flex items-center">
                            {/* It's open the add ticket modal */}
                            <div onClick={() => navigate("/dashboard/createTicket")}>
                                <OpenModalButton label={"Create Ticket"} icon={<AddIcon />} />
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Col>
                </Row>
                <ListGroup as="ol">
                    {paginatedTickets.map((ticket) => (
                        <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">    
                            <div className="ms-2 me-auto">  
                                <div class="fs-4"> [<Link className='link-primary link-underline link-underline-opacity-0' to={'../../ticket/'+ticket.code}> {ticket.code} </Link>] {ticket.title} </div>
                                <div className="fs-6">Createt At {new Date(ticket.createdAt).toLocaleDateString()} </div>
                            </div>
                            <Badge bg="primary"> {ticket.status} </Badge>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
               
                <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} />
                    <Pagination.Prev onClick={() => handlePageChange(page - 1)} />
                    {[...Array(Math.ceil(filteredTickets.length / rowsPerPage)).keys()].map(number => (
                        <Pagination.Item key={number + 1} active={number + 1 === page} onClick={() => handlePageChange(number + 1)}>
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(page + 1)} />
                    <Pagination.Last onClick={() => handlePageChange(Math.ceil(filteredTickets.length / rowsPerPage))} />
                </Pagination>
            </Container>

            <TicketModal
                modalType={modalType}
                ticket={selectedTicket}
                closeModal={handleCloseModal}
                fetchTickets={fetchTickets}
                topic={null}
            />
        </>
    );
};

export default Tickets;
