import useCrud from './useCrud';

const useProjectService = () => {
  const { getAll, getById, create, update, remove, loading, error, } = useCrud();

  const getAllProjects = () => {
    return getAll('/projects');
  };

  const getProjectById = (id) => {
    return getById('/projects', id);
  };

  const createProject = (data) => {
    return create('/projects', data);
  };

  const updateProject = (id, data) => {
    return update('/projects', id, data);
  };

  const deleteProject = (id) => {
    return remove('/projects', id);
  };

  return {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    error,
    loading
  };
};

export default useProjectService;
