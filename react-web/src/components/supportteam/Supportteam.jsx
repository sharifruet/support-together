import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Form, Button, Pagination } from 'react-bootstrap';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { Tooltip } from "@mui/material";
import { format } from 'date-fns';
import useSupportteamService from '../../hooks/useSupportteamService';
import SupportteamModal from './SupportteamModal';
import { ReactComponent as AddIcon } from '../../assets/svgIcons/add.svg';
import OpenModalButton from '../common/OpenModalButton';


const Supportteam = () => {
    const { getAllSupportteam } = useSupportteamService();
    const [supportteam, setSupportteam] = useState([]);
    const [selectedSupportteam, setSelectedSupportteam] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState(null);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
console.log(supportteam);
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(1);
    };

    const handleOpenModal = (topic, modalType) => {
        setSelectedSupportteam(supportteam);
        setModalType(modalType);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setModalType(null);
        setSelectedSupportteam(null);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const fetchSupportteam = async () => {
        try {
            const data = await getAllSupportteam();
            setSupportteam(data);
        } catch (error) {
            // Handle error here
            console.error('Error fetching Suppor-tteam:', error);
        }
    };

    useEffect(() => {
        fetchSupportteam();
    }, []);

    const filteredSupportteam = supportteam.filter((topic) =>
        topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let sortedSupportteam = [...filteredSupportteam];
    if (sortField) {
        sortedSupportteam = sortedSupportteam.sort((a, b) => {
            const x = a[sortField];
            const y = b[sortField];
            return sortOrder === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
        });
    }

    const startIndex = (page - 1) * rowsPerPage;
    const paginatedSupportteam = sortedSupportteam.slice(startIndex, startIndex + rowsPerPage);

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Col>
                        <div className="col-span-1 flex items-center">
                            <div onClick={() => handleOpenModal(null, "add")}>
                                <OpenModalButton label={"Add Supportteam"} icon={<AddIcon />} />
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
                        {paginatedSupportteam.map((supportteam) => (
                            <tr key={supportteam.id}>
                                <td>{supportteam.name}</td>
                                <td>{supportteam.userids}</td>
                                <td>{format(new Date(supportteam.createdAt), 'MM/dd/yyyy')}</td>
                                <td>
                                    <Tooltip title={`Edit this ${supportteam.name} supportteam`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-primary border-0' onClick={() => handleOpenModal(supportteam, "edit")}>
                                            <FaEdit />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`View this ${supportteam.name} supportteam`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-success border-0' onClick={() => handleOpenModal(supportteam, "view")}>
                                            <FaEye />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`Delete this ${supportteam.name} supportteam`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-danger border-0' onClick={() => handleOpenModal(supportteam, "delete")}>
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
                    {[...Array(Math.ceil(filteredSupportteam.length / rowsPerPage)).keys()].map(number => (
                        <Pagination.Item key={number + 1} active={number + 1 === page} onClick={() => handlePageChange(number + 1)}>
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(page + 1)} />
                    <Pagination.Last onClick={() => handlePageChange(Math.ceil(filteredSupportteam.length / rowsPerPage))} />
                </Pagination>
            </Container>

            <SupportteamModal
                modalType={modalType}
                supportteam={setSelectedSupportteam}
                closeModal={handleCloseModal}
                fetchSupportteam={fetchSupportteam}
                users
            />
        </>
    );
};

export default Supportteam;
