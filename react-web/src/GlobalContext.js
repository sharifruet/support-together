import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "./api/axios";

const GlobalContext = React.createContext();

const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [projects, setProjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [accessToken, setAccessToken] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const publicPaths = ["/about", "/login", "/signup", "/forgotPass"];
        const currentPath = location.pathname;

        if (!loggedIn && !publicPaths.some((path) => currentPath.endsWith(path))) {
            localStorage.clear();
            setLoggedIn(false);
            setAccessToken(null);
            setProjects([]);
            navigate("/home");
        }
    }, [loggedIn, navigate, location.pathname]);

    useEffect(() => {
        if (accessToken != null) {
            axios
                .get("/organizations", headerConfig())
                .then((response) => {
                    setOrganizations(response.data);
                })
                .catch((error) => {
                    console.log(error.response.data.error);
                });
            axios
                .get("/users", headerConfig())
                .then((response) => {
                    setUsers(response.data);
                })
                .catch((error) => {
                    console.log(error.response.data.error);
                });
            user.roles.forEach((role) => {
                loadProject(role.projectId);
            });
        }
    }, [accessToken]);

    useEffect(() => {
        console.log(user);
        if (!user?.user?.name) {
            navigate("/profileUpdate");
        }
    }, [user]);

    const loginSuccess = (response) => {
        if (response?.token) {
            console.log(response.token);
            setAccessToken(response.token);
            setUser(jwtDecode(response.token));

            toast.success("🎉 You have successfully logged in!", { className: "toast-success" });
            setLoggedIn(true);
        }
    };

    const headerConfig = () => {
        return { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } };
    };

    const loadProject = (projectId) => {
        axios
            .get("/projects/" + projectId, headerConfig())
            .then((response) => {
                // setProjects([...projects, response.data]);

                setProjects((prevProjects) => {
                    // Create a Map from the previous projects array
                    const projectMap = new Map(prevProjects.map((project) => [project.id, project]));

                    // Add or update the project in the Map
                    projectMap.set(response.data.id, response.data);

                    // Convert the Map back to an array and return it
                    return Array.from(projectMap.values());
                });
            })
            .catch((error) => {
                toast.error(error);
            });
    };

    const onLogout = () => {
        if (loggedIn) {
            localStorage.clear();
            setAccessToken(null);
            setLoggedIn(false);
            setProjects([]);
            navigate("/home");
            toast.success("👋 You have successfully logged out!", { className: "toast-success" });
        }
    };

    return (
        <GlobalContext.Provider value={{ user, setUser, users, loginSuccess, onLogout, loggedIn, setLoggedIn, topics, projects, organizations, headerConfig, accessToken }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalContext;
export { GlobalProvider };
