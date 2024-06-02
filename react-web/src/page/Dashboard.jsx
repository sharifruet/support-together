import React, { useState, useEffect, useContext } from "react";
import {
    MdAdminPanelSettings,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { LuClipboardEdit } from "react-icons/lu";
import { FaNewspaper, FaUsers } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import { summary, tasks } from "../assets/data";
// import UserInfo from "../components/UserInfo";
import { Chart } from "../components/Chart";
import { Table, OverlayTrigger, Popover, Card as BootstrapCard } from "react-bootstrap";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import Avatar from "../components/common/Avatar";
import AvatarIcon from '../assets/imgIcons/avatar.png';
import RecentOrdersTable from "../components/Table";
import useCrud from "../hooks/useCrud";
import ProjectCard from "../components/ProjectCard";
import GlobalContext from "../GlobalContext";

const UserInfo = ({ user }) => {
    const popover = (
        <Popover id="popover-basic">
            <Popover.Body className="d-flex align-items-center gap-3 p-3 shadow-lg bg-white rounded">
                <div className="w-16 h-16 bg-primary rounded-circle text-white d-flex align-items-center justify-center text-2xl">
                    <span className="text-center font-bold">{getInitials(user?.name)}</span>
                </div>
                <div className="d-flex flex-column gap-1">
                    <p className="text-black text-xl font-bold mb-0">{user?.name}</p>
                    <span className="text-base text-muted">{user?.title}</span>
                    <span className="text-primary">{user?.email ?? "email@example.com"}</span>
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <span>{getInitials(user?.name)}</span>
        </OverlayTrigger>
    );
};

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
        <tr className="border-bottom text-muted hover:bg-light">
            <td className="py-2">
                <div className="d-flex align-items-center gap-2">
                    <div className={`w-4 h-4 rounded-circle ${TASK_TYPE[task.stage]}`} />
                    <p className="text-base text-black mb-0">{task.title}</p>
                </div>
            </td>

            <td className="py-2">
                <div className="d-flex gap-1 align-items-center">
                    <span className={`text-lg ${PRIOTITYSTYELS[task.priority]}`}>
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
                            className={`w-7 h-7 rounded-circle text-white d-flex align-items-center justify-center text-sm ${BGS[index % BGS.length]}`}
                            style={{ marginLeft: index !== 0 ? '-0.5rem' : 0 }}
                        >
                            <UserInfo user={m} />
                        </div>
                    ))}
                </div>
            </td>
            <td className="py-2 d-none d-md-table-cell">
                <span className="text-base text-muted">
                    {moment(task?.date).fromNow()}
                </span>
            </td>
        </tr>
    );

    return (
        <div className="w-100 md-w-66 bg-white p-4 shadow-md rounded">
            <Table className="w-100">
                <TableHeader />
                <tbody>
                    {tasks?.map((task, id) => (
                        <TableRow key={id} task={task} />
                    ))}
                </tbody>
            </Table>
        </div>
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
        <tr className="border text-muted hover:bg-light">
            <td className="py-2">
                <div className="d-flex align-items-center gap-3">
                    <div className="w-9 h-9 rounded-circle text-white d-flex align-items-center justify-center text-sm bg-primary">
                        <span className="text-center">{getInitials(user?.name)}</span>
                    </div>

                    <div>
                        <p className="mb-0">{user.name}</p>
                        <span className="text-xs text-black">{user?.role}</span>
                    </div>
                </div>
            </td>

            <td>
                <p className={`w-fit px-3 py-1 rounded-pill text-sm ${user?.isActive ? "bg-info" : "bg-warning"}`}>
                    {user?.isActive ? "Active" : "Disabled"}
                </p>
            </td>
            <td className="py-2 text-sm">{moment(user?.createdAt).fromNow()}</td>
        </tr>
    );

    return (
        <div className="w-100 md-w-33 bg-white h-fit p-4 shadow-md rounded">
            <Table className="w-100 mb-5">
                <TableHeader />
                <tbody>
                    {users?.map((user, index) => (
                        <TableRow key={index + user?._id} user={user} />
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

const Dashboard = () => {

    const { getAll } = useCrud();
    // Logged in user roles
    const { user } = useContext(GlobalContext);
    const [projects, setProjects] = useState([]);
    const projectUrl = "/projects"
    const fetchProjects = async () => {
        try {
            const data = await getAll(projectUrl);
            setProjects(data);
        } catch (error) {
            // Handle error here
            console.error('Error fetching project:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const filteredProjects = () => {
        return projects?.filter(project => {
            return user?.roles?.some(role => role.projectId === project.id);
        });
    };

    const userProjects = filteredProjects() ?? [];

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

    const cardWidth = {
        1: 'row-cols-md-1 w-100 row-cols-1 row-cols-sm-2 py-4 row g-4',
        2: 'row-cols-md-2 w-100 row-cols-1 row-cols-sm-2 py-4 row g-4',
    }

    const Card = ({ label, count, bg, icon }) => {
        return (
            <BootstrapCard className="w-100 h-32 bg-white p-3 shadow-md rounded d-flex align-items-center justify-between">
                <div className="h-100 d-flex flex-column justify-between flex-1">
                    <p className="text-base text-muted">{label}</p>
                    <span className="text-2xl font-semibold">{count}</span>
                    <span className="text-sm text-gray-400">{"110 last month"}</span>
                </div>

                <div className={`w-10 h-10 rounded-circle d-flex align-items-center justify-center text-white ${bg}`}>
                    {icon}
                </div>
            </BootstrapCard>
        );
    };

    return (
        <div className="h-full pb-4">
            <div className="row row-cols-1 row-cols-md-4 g-4">
                {stats.map(({ icon, bg, label, total }, index) => (
                    <div className="col" key={index}>
                        <Card icon={icon} bg={bg} label={label} count={total} />
                    </div>
                ))}
            </div>

            <div className={userProjects && userProjects.length > 2 ? `w-100 py-4 row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4` : cardWidth[userProjects.length]}>
                {userProjects?.map((project, index) => (
                    <div className="col" key={index}>
                        <ProjectCard project={project} />
                    </div>
                ))}
            </div>

            <div className="w-100 bg-white my-4 p-4 rounded shadow-sm">
                <h4 className="text-xl text-muted font-semibold">Chart by Priority</h4>
                <Chart />
            </div>

            <div className="w-100 d-flex flex-column flex-md-row gap-4 py-4">
                <TaskTable tasks={summary.last10Task} />
                <UserTable users={summary.users} />
            </div>

            <RecentOrdersTable />
        </div>
    );
};

export default Dashboard;
