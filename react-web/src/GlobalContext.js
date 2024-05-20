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
  const navigate = useNavigate();


  useEffect(() => {
    axios.get("/organizations").then((response) => {
      setOrganizations(response.data);
    }).catch(error => {
      toast.error(error.response.data.error);
      console.log(error.response.data.error)
   });
  }, []);

  const loginSuccess = (response) => {
    if (response?.token) {
      Cookies.set('accessToken', response.token);
      if (response?.userRoles) {
        setRoles(response.userRoles);
      }
      //setUser(response.user)
      toast.success('you are logged in');
      setLoggedIn(true);
    }
    if(roles.length > 0){
      roles.forEach(r=>{loadProject(r.id)});
    }
  }

  const loadProject = (projectId) => {
    axios.get("/projects/"+projectId)
    .then((response) => {
      setProjects([...projects, response.data]);
    })
    .catch(error => {
      toast.success(error);
      console.log(error.response.data.error)
   })

  }

  const onLogout = () => {
    localStorage.clear()
    Cookies.remove('accessToken');
    setLoggedIn(false);
    setProjects([]);
    navigate("/Home");
    
  }

  return (
    <GlobalContext.Provider
      value={{user, setUser, loginSuccess, onLogout, roles, setRoles, loggedIn, projects, organizations }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalContext
export { GlobalProvider }
 