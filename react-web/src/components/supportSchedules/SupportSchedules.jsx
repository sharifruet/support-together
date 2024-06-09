import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Form, Button, Pagination } from 'react-bootstrap';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { Tooltip } from "@mui/material";
import { format } from 'date-fns';
import useCrud from '../../hooks/useCrud';
import './SupportSchedulesStyles.css';
import SupportScheduleModal from './SupportScheduleModal';
import { ReactComponent as AddIcon } from '../../assets/svgIcons/add.svg';
import OpenModalButton from '../common/OpenModalButton';


const SupportSchedules = () => {
    const { getAll } = useCrud();
    const [supportSchedules, setSupportSchedules] = useState([]);
    const [selectedSupportSchedule, setSelectedSupportSchedule] = useState(null);
    const [modalType, setModalType] = useState(null);
    const supportTeamSchedulesUrl = "/support-schedules";

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

    const handleOpenModal = (supportSchedule, modalType) => {
        setSelectedSupportSchedule(supportSchedule);
        setModalType(modalType);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedSupportSchedule(null);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const fetchSupportSchedules = async () => {
        try {
            const data = await getAll(supportTeamSchedulesUrl);
            setSupportSchedules(data);
            console.log(data)
        } catch (error) {
            // Handle error here
            console.error('Error fetching Support Team Schedule:', error);
        }
    };

    useEffect(() => {
        fetchSupportSchedules();
    }, []);

    const filteredSupportSchedules = supportSchedules?.filter((supportSchedule) =>
        supportSchedule?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
    );

    let sortedSupportSchedules = [...filteredSupportSchedules];
    if (sortField) {
        sortedSupportSchedules = sortedSupportSchedules.sort((a, b) => {
            const x = a[sortField];
            const y = b[sortField];
            return sortOrder === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
        });
    }

    const startIndex = (page - 1) * rowsPerPage;
    const paginatedSupportSchedules = sortedSupportSchedules.slice(startIndex, startIndex + rowsPerPage);

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Col>
                        <div className="col-span-1 flex items-center">
                            {/* It's open the add EmailTemplate modal */}
                            <div onClick={() => handleOpenModal(null, "add")}>
                                <OpenModalButton label={"Add Support Team Schedule"} icon={<AddIcon />} />
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
                            <th onClick={() => handleSortChange('createdAt')}>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedSupportSchedules?.map((supportSchedule) => (
                            <tr key={supportSchedule.id}>
                                <td>{supportSchedule?.name}</td>
                                <td>{format(new Date(supportSchedule.createdAt), 'MM/dd/yyyy')}</td>
                                <td>
                                    <Tooltip title={`Edit this ${supportSchedule?.name} SupportSchedule`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-primary border-0' onClick={() => handleOpenModal(supportSchedule, "edit")}>
                                            <FaEdit />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`View this ${supportSchedule?.name} SupportSchedule`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-success border-0' onClick={() => handleOpenModal(supportSchedule, "view")}>
                                            <FaEye />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`Delete this ${supportSchedule?.name} SupportSchedule`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-danger border-0' onClick={() => handleOpenModal(supportSchedule, "delete")}>
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
                    {[...Array(Math.ceil(filteredSupportSchedules.length / rowsPerPage)).keys()].map(number => (
                        <Pagination.Item key={number + 1} active={number + 1 === page} onClick={() => handlePageChange(number + 1)}>
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(page + 1)} />
                    <Pagination.Last onClick={() => handlePageChange(Math.ceil(filteredSupportSchedules.length / rowsPerPage))} />
                </Pagination>
            </Container>

            <SupportScheduleModal
                modalType={modalType}
                supportSchedule={selectedSupportSchedule}
                closeModal={handleCloseModal}
                fetchSupportSchedules={fetchSupportSchedules}
            />
        </>
    );
};

export default SupportSchedules;
