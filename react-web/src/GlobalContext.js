import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from './api/axios'
//import { deleteAllCookies } from '../interceptor'
//import useApiHelper from 'src/api'

const GlobalContext = React.createContext()

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [roles, setRoles] = useState([])
  const [loggedIn, setLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [accesstoken, setAccesstoken] = useState(null);

  const navigate = useNavigate();

  // useEffect(()=>{
  //   if(!loggedIn){
  //     console.log('here')
  //     onLogout();
  //   }
  // },[loggedIn]);

  useEffect(() => {
    if (!loggedIn) {
      localStorage.clear();
      Cookies.remove('accessToken');
      setLoggedIn(false);
      setAccesstoken(null);
      setProjects([]);
      navigate("/Home");
      // toast.success('👋 You have successfully logged out!', { className: 'toast-success' });
    }
  }, [loggedIn, navigate]);

  useEffect(() => {
    axios.get("/organizations", headerConfig()).then((response) => {
      setOrganizations(response.data);
    }).catch(error => {
      // toast.error(error.response.data.error, { className: 'toast-error' });
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
       console.log(response);
      setAccesstoken(response.token);
      //  console.log("AT="+ accesstoken);
      if (response?.userRoles) {
        setRoles(response.userRoles);
      }
      //setUser(response.user)
      toast.success('🎉 You have successfully logged in!', { className: 'toast-success' });
      setLoggedIn(true);
    }

  }

  const headerConfig = () => {
    // console.log("HC AT" + accesstoken);
    return { headers: { Authorization: `Bearer ${accesstoken}`, "Content-Type": "application/json" } };
  }

  const loadProject = (projectId) => {
    axios.get("/projects/" + projectId, headerConfig())
      .then((response) => {
        setProjects([...projects, response.data]);
      })
      .catch(error => {
        toast.success(error);
        //  console.log(error.response.data.error)
      })

  }

  // const onLogout = () => {
  //   if(loggedIn) {
  //     localStorage.clear()
  //     setAccesstoken(null);
  //     setLoggedIn(false);
  //     setProjects([]);
  //     navigate("/Home");
  //     toast.success('👋 You have successfully logged out!', { className: 'toast-success' });
  //   }
  // }

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