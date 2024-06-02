import React from "react";
import {
    MdAdminPanelSettings,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { LuClipboardEdit } from "react-icons/lu";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import { summary } from "../assets/data";
import { Chart } from "../components/Chart";
import { getInitials } from "../utils";
import UserInfo from "../components/UserInfo";
import { Table, Container, Row, Col, Card, Button } from 'react-bootstrap';

const TaskTable = ({ tasks }) => {
    const ICONS = {
        high: <MdKeyboardDoubleArrowUp />,
        medium: <MdKeyboardArrowUp />,
        low: <MdKeyboardArrowDown />,
    };

    const TableHeader = () => (
        <thead className="border-bottom">
            <tr className="text-black text-left">
                <th className="py-2">Task Title</th>
                <th className="py-2">Priority</th>
                <th className="py-2">Team</th>
                <th className="py-2 d-none d-md-table-cell">Created At</th>
            </tr>
        </thead>
    );

    const TableRow = ({ task }) => (
        <tr className="border-bottom text-gray-600 hover:bg-light">
            <td className="py-2">
                <div className="d-flex align-items-center gap-2">
                    <div className={`w-4 h-4 rounded-circle ${task.stage}`} />
                    <p className="text-base text-black">{task.title}</p>
                </div>
            </td>
            <td className="py-2">
                <div className="d-flex gap-1 align-items-center">
                    <span className={`text-lg ${task.priority}`}>
                        {ICONS[task.priority]}
                    </span>
                    <span className="text-capitalize">{task.priority}</span>
                </div>
            </td>
            <td className="py-2">
                <div className="d-flex">
                    {task.team.map((m, index) => (
                        <div
                            key={index}
                            className={`w-7 h-7 rounded-circle text-white d-flex align-items-center justify-center text-sm me-1 ${index % 2 === 0 ? "bg-primary" : "bg-secondary"}`}
                        >
                            <UserInfo user={m} />
                        </div>
                    ))}
                </div>
            </td>
            <td className="py-2 d-none d-md-table-cell">
                <span className="text-base text-gray-600">
                    {moment(task?.date).fromNow()}
                </span>
            </td>
        </tr>
    );

    return (
        <Card className="w-100 md:w-2/3 bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded">
            <Table className="w-100">
                <TableHeader />
                <tbody>
                    {tasks?.map((task, id) => (
                        <TableRow key={id} task={task} />
                    ))}
                </tbody>
            </Table>
        </Card>
    );
};

const UserTable = ({ users }) => {
    const TableHeader = () => (
        <thead className="border-bottom">
            <tr className="text-black text-left">
                <th className="py-2">Full Name</th>
                <th className="py-2">Status</th>
                <th className="py-2">Created At</th>
            </tr>
        </thead>
    );

    const TableRow = ({ user }) => (
        <tr className="border-bottom text-gray-600 hover:bg-light">
            <td className="py-2">
                <div className="d-flex align-items-center gap-3">
                    <div className="w-9 h-9 rounded-circle text-white d-flex align-items-center justify-center text-sm bg-violet-700">
                        <span className="text-center">{getInitials(user?.name)}</span>
                    </div>
                    <div>
                        <p>{user.name}</p>
                        <span className="text-xs text-black">{user?.role}</span>
                    </div>
                </div>
            </td>
            <td>
                <p className={`w-fit px-3 py-1 rounded-pill text-sm ${user?.isActive ? "bg-blue-200" : "bg-yellow-100"}`}>
                    {user?.isActive ? "Active" : "Disabled"}
                </p>
            </td>
            <td className="py-2 text-sm">{moment(user?.createdAt).fromNow()}</td>
        </tr>
    );

    return (
        <Card className="w-100 md:w-1/3 bg-white h-fit px-2 md:px-6 py-4 shadow-md rounded">
            <Table className="w-100 mb-5">
                <TableHeader />
                <tbody>
                    {users?.map((user, index) => (
                        <TableRow key={index + user?._id} user={user} />
                    ))}
                </tbody>
            </Table>
        </Card>
    );
};

const Dashboard = () => {
    const totals = summary.tasks;

    const stats = [
        {
            _id: "1",
            label: "TOTAL TASK",
            total: summary?.totalTasks || 0,
            icon: <FaNewspaper />,
            bg: "bg-primary",
        },
        {
            _id: "2",
            label: "COMPLETED TASK",
            total: totals["completed"] || 0,
            icon: <MdAdminPanelSettings />,
            bg: "bg-success",
        },
        {
            _id: "3",
            label: "TASK IN PROGRESS",
            total: totals["in progress"] || 0,
            icon: <LuClipboardEdit />,
            bg: "bg-warning",
        },
        {
            _id: "4",
            label: "TODOS",
            total: totals["todo"],
            icon: <FaArrowsToDot />,
            bg: "bg-danger",
        },
    ];

    const StatCard = ({ label, count, bg, icon }) => {
        return (
            <Card className="w-100 h-32 bg-white p-5 shadow-md rounded-md d-flex align-items-center justify-between">
                <div className="h-100 d-flex flex-column justify-between flex-1">
                    <p className="text-base text-gray-600">{label}</p>
                    <span className="text-2xl font-semibold">{count}</span>
                    <span className="text-sm text-gray-400">{"110 last month"}</span>
                </div>
                <div className={`w-10 h-10 rounded-circle d-flex align-items-center justify-center text-white ${bg}`}>
                    {icon}
                </div>
            </Card>
        );
    };

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                {stats.map(({ icon, bg, label, total }, index) => (
                    <Col key={index} xs={12} md={6} lg={3} className="mb-4">
                        <StatCard icon={icon} bg={bg} label={label} count={total} />
                    </Col>
                ))}
            </Row>
            <Card className="w-100 bg-white my-4 p-4 rounded shadow-sm">
                <h4 className="text-xl text-gray-600 font-semibold">
                    Chart by Priority
                </h4>
                <Chart />
            </Card>
            <Row className="w-100 d-flex flex-column flex-md-row gap-4 py-4">
                <Col>
                    <TaskTable tasks={summary.last10Task} />
                </Col>
                <Col>
                    <UserTable users={summary.users} />
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
