import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from './api/axios'
//import { deleteAllCookies } from '../interceptor'
//import useApiHelper from 'src/api'

// Your existing imports

const GlobalContext = React.createContext();

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [accesstoken, setAccesstoken] = useState(localStorage.getItem('accessToken') || null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/organizations", headerConfig());
        setOrganizations(response.data);
      } catch (error) {
        toast.error(error.response?.data?.error || "An error occurred");
      }
    };
    if (accesstoken) {
      fetchData();
    }
  }, [accesstoken]);

  useEffect(() => {
    roles.forEach(r => loadProject(r.id));
  }, [roles]);

  const loginSuccess = async (response) => {
    if (response?.token) {
      setAccesstoken(response.token);
      localStorage.setItem('accessToken', response.token);
      if (response?.userRoles) {
        setRoles(response.userRoles);
      }
      toast.success('You are logged in');
      setLoggedIn(true);
    }
  };

  const headerConfig = () => ({
    headers: { Authorization: `Bearer ${accesstoken}` }
  });

  const loadProject = async (projectId) => {
    try {
      const response = await axios.get(`/projects/${projectId}`, headerConfig());
      setProjects(prevProjects => [...prevProjects, response.data]);
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
    }
  };

  const onLogout = () => {
    localStorage.removeItem('accessToken');
    setAccesstoken(null);
    setLoggedIn(false);
    setProjects([]);
    navigate("/Home");
  };

  return (
    <GlobalContext.Provider
      value={{ user, setUser, loginSuccess, onLogout, roles, setRoles, loggedIn, projects, organizations, headerConfig }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
export { GlobalProvider };
