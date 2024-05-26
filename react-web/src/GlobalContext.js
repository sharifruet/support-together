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

    axios.get("/organizations", headerConfig()).then((response) => {
      setOrganizations(response.data);
    }).catch(error => {
      toast.error(error.response.data.error);
    //  console.log(error.response.data.error)
   });
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


  const headerConfig = ()=>{
   // console.log("HC AT" + accesstoken);
    return  {headers: { Authorization: `Bearer ${accesstoken}`, "Content-Type":"application/json" } };
  }

  const loadProject = (projectId) => {
    axios.get("/projects/"+projectId, headerConfig())
    .then((response) => {
      setProjects([...projects, response.data]);
    })
    .catch(error => {
      toast.success(error);
    //  console.log(error.response.data.error)
   })

  }

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
