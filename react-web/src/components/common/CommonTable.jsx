import React from 'react';
import { Container, Row, Col, Form, Button, Table, Pagination } from 'react-bootstrap';

const CommonTable = ({ title, addButtonLabel, searchQuery, handleSearchChange, children, pagination, handleOpenModal, handleSortChange }) => {
    return (
        <Container>
            <Row className="mb-3">
                <Col>
                    <div className="col-span-1 flex items-center" onClick={() => handleOpenModal(null, "add")}>
                        <Button>{addButtonLabel}</Button>
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
                    {title && (
                        <tr>
                            {title.map((column, index) => (
                                <th key={index} onClick={() => handleSortChange(column.field)}>
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    )}
                </thead>
                <tbody>
                    {children}
                </tbody>
            </Table>
            {pagination && (
                <Pagination>
                    {pagination}
                </Pagination>
            )}
        </Container>
    );
};

export default CommonTable;
