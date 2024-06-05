import useCrud from './useCrud';

const useUserService = () => {
  const { getAll, getById, create, update, remove } = useCrud();

  const getAllUsers = () => {
    return getAll('/users');
  };

  const getUsersById = (id) => {
    return getById('/users', id);
  };

  const createUsers = (data) => {
    return create('/users', data);
  };

  const updateUsers = (id, data) => {
    return update('/users', id, data);
  };

  const deleteUsers = (id) => {
    return remove('/users', id);
  };

  return {
    getAllUsers,
    getUsersById,
    createUsers,
    updateUsers,
    deleteUsers,
  };
};

export default useUserService;
