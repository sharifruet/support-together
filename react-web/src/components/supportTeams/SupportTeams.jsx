import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Form, Button, Pagination } from 'react-bootstrap';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { Tooltip } from "@mui/material";
import moment from 'moment';
import useSupportTeamService from '../../hooks/useSupportTeamService';
import SupportTeamModal from './SupportTeamModal';
import { ReactComponent as AddIcon } from '../../assets/svgIcons/add.svg';
import OpenModalButton from '../common/OpenModalButton';


const SupportTeams = () => {
    const { getAllSupportTeams} = useSupportTeamService();
    const [supportTeams, setSupportTeams] = useState([]);
    const [selectedSupportTeam, setSelectedSupportTeam] = useState(null);
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

    const handleOpenModal = (supportTeam, modalType) => {
        setSelectedSupportTeam(supportTeam);
        setModalType(modalType);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedSupportTeam(null);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const fetchSupportTeams = async () => {
        try {
            const data = await getAllSupportTeams();
            setSupportTeams(data);
        } catch (error) {
            // Handle error here
            console.error('Error fetching Support Team:', error);
        }
    };

    useEffect(() => {
        fetchSupportTeams();
    }, []);

    const filteredSupportTeam = supportTeams.filter((topic) =>
        topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let sortedSupportTeam = [...filteredSupportTeam];
    if (sortField) {
        sortedSupportTeam = sortedSupportTeam.sort((a, b) => {
            const x = a[sortField];
            const y = b[sortField];
            return sortOrder === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
        });
    }

    const startIndex = (page - 1) * rowsPerPage;
    const paginatedSupportTeam = sortedSupportTeam.slice(startIndex, startIndex + rowsPerPage);
    
    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Col>
                        <div className="col-span-1 flex items-center">
                            {/* It's open the add organization modal */}
                            <div onClick={() => handleOpenModal(null, "add")}>
                                <OpenModalButton label={"Add Support Team"} icon={<AddIcon />} />
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
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th onClick={() => handleSortChange('name')}>Name</th>
                            <th onClick={() => handleSortChange('userIds')}>Users</th>
                            <th onClick={() => handleSortChange('createdAt')}>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedSupportTeam?.map((supportTeam) => (
                            <tr key={supportTeam.id}>
                                <td>{supportTeam.name}</td>
                                <td>
                                    {supportTeam?.Users?.map((user) => user.name+', ')}
                                </td>
                                <td>{moment(supportTeam.createdAt).format('ddd, D MMMM, YYYY hh:mm A')}</td>
                                <td>
                                    <Tooltip title={`Edit this ${supportTeam.name} Support Team`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-primary border-0' onClick={() => handleOpenModal(supportTeam, "edit")}>
                                            <FaEdit />
                                        </Button>
                                    </Tooltip>
                                   
                                    <Tooltip title={`Delete this ${supportTeam.name} Support Team`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-danger border-0' onClick={() => handleOpenModal(supportTeam, "delete")}>
                                            <FaTrashAlt />
                                        </Button>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} />
                    <Pagination.Prev onClick={() => handlePageChange(page - 1)} />
                    {[...Array(Math.ceil(filteredSupportTeam.length / rowsPerPage)).keys()]?.map(number => (
                        <Pagination.Item key={number + 1} active={number + 1 === page} onClick={() => handlePageChange(number + 1)}>
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(page + 1)} />
                    <Pagination.Last onClick={() => handlePageChange(Math.ceil(filteredSupportTeam.length / rowsPerPage))} />
                </Pagination>
            </Container>

            <SupportTeamModal
                modalType={modalType}
                supportTeam={selectedSupportTeam}
                closeModal={handleCloseModal}
                fetchSupportTeams={fetchSupportTeams}
            />
        </>
    );
};

export default SupportTeams;
