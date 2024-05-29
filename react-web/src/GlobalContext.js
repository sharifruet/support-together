import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from './api/axios';

const GlobalContext = React.createContext()

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [roles, setRoles] = useState([])
  const [loggedIn, setLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [accesstoken, setAccesstoken] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   const pathname = location.pathname;
  //   if (!loggedIn && !pathname.endsWith('/about') || !loggedIn && !pathname.endsWith('/login') || !loggedIn && !pathname.endsWith('/signup' || !loggedIn && !pathname.endsWith('/forgotPass'))) {
  //     localStorage.clear();
  //     Cookies.remove('accessToken');
  //     setLoggedIn(false);
  //     setAccesstoken(null);
  //     setProjects([]);
  //     navigate("/home");
  //   }
  // }, [loggedIn, navigate, location.pathname]);

  useEffect(() => {
    const publicPaths = ['/about', '/login', '/signup', '/forgotPass'];
    const currentPath = location.pathname;

    if (!loggedIn && !publicPaths.some(path => currentPath.endsWith(path))) {
      localStorage.clear();
      Cookies.remove('accessToken');
      setLoggedIn(false);
      setAccesstoken(null);
      setProjects([]);
      navigate("/home");
    }
  }, [loggedIn, navigate, location.pathname]);

  useEffect(() => {
    axios.get("/organizations", headerConfig()).then((response) => {
      setOrganizations(response.data);
    }).catch(error => {
      console.log(error.response.data.error)
    });
  }, [accesstoken]);

  useEffect(() => {
    if (roles.length > 0) {
      roles.forEach(r => { loadProject(r.id) });
    }
  }, [roles]);

  const loginSuccess = (response) => {
    if (response?.token) {
      setAccesstoken(response.token);
      if (response?.userRoles) {
        setRoles(response.userRoles);
        console.log(response)
      }
      toast.success('🎉 You have successfully logged in!', { className: 'toast-success' });
      setLoggedIn(true);
    }

  }

  const headerConfig = () => {
    return { headers: { Authorization: `Bearer ${accesstoken}`, "Content-Type": "application/json" } };
  }

  const loadProject = (projectId) => {
    axios.get("/projects/" + projectId, headerConfig())
      .then((response) => {
        setProjects([...projects, response.data]);
      })
      .catch(error => {
        toast.error(error);
      })

  }

  const onLogout = () => {
    if (loggedIn) {
      localStorage.clear()
      setAccesstoken(null);
      setLoggedIn(false);
      setProjects([]);
      navigate("/Home");
      toast.success('👋 You have successfully logged out!', { className: 'toast-success' });
    }
  };

  return (
    <GlobalContext.Provider
      value={{ user, setUser, loginSuccess, onLogout, roles, setRoles, loggedIn, projects, organizations, headerConfig, accesstoken }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalContext
export { GlobalProvider }