import React from "react";
import { Container, Row, Col, Form, Button, Table, Pagination } from "react-bootstrap";

const CommonTable = ({ title, addButtonLabel, searchQuery, handleSearchChange, children, pagination, handleOpenModal, handleSortChange }) => {
    return (
        <Container>
            <Row className="mb-3 align-items-center">
                {/* Add Button */}
                <Col md="auto">
                    <Button onClick={() => handleOpenModal(null, "add")}>{addButtonLabel}</Button>
                </Col>
                {/* Search Input */}
                <Col>
                    <Form.Control type="text" placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
                </Col>
            </Row>

            {/* Table */}
            <Table striped bordered hover responsive>
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
                <tbody>{children}</tbody>
            </Table>

            {/* Pagination */}
            {pagination && (
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <Pagination>{pagination}</Pagination>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default CommonTable;
