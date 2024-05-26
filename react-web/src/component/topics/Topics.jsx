import React, { useState, useEffect, useCallback } from 'react';
import { Table, Container, Row, Col, Form, Button, Modal, Pagination } from 'react-bootstrap';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import useTopicService from '../../hooks/useTopicService';
import './TopicsStyles.css';
import TopicModal from './TopicModal';
import { ReactComponent as AddIcon } from '../../assets/svgIcons/add.svg';

const Topics = () => {
    const { getAllTopics } = useTopicService();
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [openModal, setOpenModal] = useState(false);
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

    const handleOpenModal = (topic, modalType) => {
        setSelectedTopic(topic);
        setModalType(modalType);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setModalType(null);
        setSelectedTopic(null);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const fetchTopics = async () => {
        try {
            const data = await getAllTopics();
            setTopics(data);
        } catch (error) {
            console.error('Error fetching Topic:', error);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const filteredTopics = topics.filter((org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let sortedTopics = [...filteredTopics];
    if (sortField) {
        sortedTopics = sortedTopics.sort((a, b) => {
            const x = a[sortField];
            const y = b[sortField];
            return sortOrder === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
        });
    }

    const startIndex = (page - 1) * rowsPerPage;
    const paginatedTopics = sortedTopics.slice(startIndex, startIndex + rowsPerPage);

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Col>
                        <div className="col-span-1 flex items-center">
                            <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-start w-full">
                                {/* It's open the add topic modal */}
                                <div
                                    style={{ background: "#303031" }}
                                    onClick={() => handleOpenModal(null, "add")}
                                    className="cursor-pointer rounded-full p-2 flex items-center justify-center text-gray-100 font-semibold text-sm uppercase"
                                >
                                    <AddIcon className="w-6 h-6 text-gray-100 mr-2" />
                                    Add Topic
                                </div>
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
                            <th onClick={() => handleSortChange('address')}>Address</th>
                            <th onClick={() => handleSortChange('createdAt')}>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTopics.map((topic) => (
                            <tr key={topic.id}>
                                <td>{topic.name}</td>
                                <td>{topic.address}</td>
                                <td>{format(new Date(topic.createdAt), 'MM/dd/yyyy')}</td>
                                <td>
                                    <Button variant="standard" className='text-primary' onClick={() => handleOpenModal(topic, "edit")}>
                                        <FaEdit />
                                    </Button>{' '}
                                    <Button variant="standard" className='text-success' onClick={() => handleOpenModal(topic, "view")}>
                                        <FaEye />
                                    </Button>{' '}
                                    <Button variant="standard" className='text-danger' onClick={() => handleOpenModal(topic, "delete")}>
                                        <FaTrashAlt />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} />
                    <Pagination.Prev onClick={() => handlePageChange(page - 1)} />
                    {[...Array(Math.ceil(filteredTopics.length / rowsPerPage)).keys()].map(number => (
                        <Pagination.Item key={number + 1} active={number + 1 === page} onClick={() => handlePageChange(number + 1)}>
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(page + 1)} />
                    <Pagination.Last onClick={() => handlePageChange(Math.ceil(filteredTopics.length / rowsPerPage))} />
                </Pagination>
            </Container>

            <TopicModal
                modalType={modalType}
                topic={selectedTopic}
                closeModal={handleCloseModal}
                fetchTopics={fetchTopics}
                project={null}
            />
        </>
    );
};

export default Topics;
