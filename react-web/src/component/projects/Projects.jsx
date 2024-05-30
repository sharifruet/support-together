import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Form, Button, Pagination } from 'react-bootstrap';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { FaCirclePlus } from "react-icons/fa6";
import { Tooltip } from "@mui/material";
import { format } from 'date-fns';
import useProjectService from '../../hooks/useProjectService';
import './ProjectsStyles.css';
import ProjectModal from './ProjectModal';
import { ReactComponent as AddIcon } from '../../assets/svgIcons/add.svg';
import { LuUserPlus2 } from "react-icons/lu";
import OpenModalButton from '../common/OpenModalButton';
import TopicModal from '../topics/TopicModal';
import InviteUsers from '../inviteUsers/InviteUsersModal';

const Projects = () => {
    const { getAllProjects } = useProjectService();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [modalTypeForTopic, setModalTypeForTopic] = useState(null);
    const [modalTypeForInviteUsers, setModalTypeForInviteUsers] = useState(false);

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

    const handleOpenModal = (project, modalType) => {
        setSelectedProject(project);
        setModalType(modalType);
    };

    const handleOpenTopicModal = (project, modalType) => {
        setSelectedProject(project);
        setModalTypeForTopic(modalType);
    };

    const handleOpenInviteModal = (project, modalType) => {
        setSelectedProject(project);
        setModalTypeForInviteUsers(modalType);
    };

    const handleCloseModal = () => {
        setModalTypeForTopic(null);
        setModalType(null);
        setSelectedProject(null);
        setModalTypeForInviteUsers(null);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const fetchProjects = async () => {
        try {
            const data = await getAllProjects();
            setProjects(data);
        } catch (error) {
            // Handle error here
            console.error('Error fetching project:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter((org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let sortedProjects = [...filteredProjects];
    if (sortField) {
        sortedProjects = sortedProjects.sort((a, b) => {
            const x = a[sortField];
            const y = b[sortField];
            return sortOrder === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
        });
    }

    const startIndex = (page - 1) * rowsPerPage;
    const paginatedProjects = sortedProjects.slice(startIndex, startIndex + rowsPerPage);

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Col>
                        <div className="col-span-1 flex items-center" onClick={() => handleOpenModal(null, "add")}>
                        {/* It's open the add EmailTemplate modal */}
                            <OpenModalButton label={"Add Project"} icon={<AddIcon />} />
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
                        {paginatedProjects.map((project) => (
                            <tr key={project.id}>
                                <td>{project.name}</td>
                                <td>{format(new Date(project.createdAt), 'MM/dd/yyyy')}</td>
                                <td>
                                    
                                    <Tooltip title={`Assign user to this ${project.name} Project`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-secondary border-0'>
                                            <LuUserPlus2 className='fs-5' onClick={() => handleOpenInviteModal(project, "invite")} />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`Add Topic to this ${project.name} Project`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-success border-0'>
                                            <FaCirclePlus onClick={() => handleOpenTopicModal(project, "add")} />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`Edit this ${project.name} Project`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-primary border-0'>
                                            <FaEdit onClick={() => handleOpenModal(project, "edit")} />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`View this ${project.name} Project`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-success border-0' onClick={() => handleOpenModal(project, "view")}>
                                            <FaEye />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`Delete this ${project.name} Project`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-danger border-0' onClick={() => handleOpenModal(project, "delete")}>
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
                    {[...Array(Math.ceil(filteredProjects.length / rowsPerPage)).keys()].map(number => (
                        <Pagination.Item key={number + 1} active={number + 1 === page} onClick={() => handlePageChange(number + 1)}>
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(page + 1)} />
                    <Pagination.Last onClick={() => handlePageChange(Math.ceil(filteredProjects.length / rowsPerPage))} />
                </Pagination>
            </Container>

            <ProjectModal
                modalType={modalType}
                project={selectedProject}
                closeModal={handleCloseModal}
                fetchProjects={fetchProjects}
                organization={null}
            />

            <TopicModal
                modalType={modalTypeForTopic}
                topic={null}
                closeModal={handleCloseModal}
                fetchTopics={null}
                project={selectedProject}
            />

            <InviteUsers 
                modalType={modalTypeForInviteUsers}
                project={selectedProject}
                closeModal={handleCloseModal}
                fetchProjects={fetchProjects}
            />
        </>
    );
};

export default Projects;
