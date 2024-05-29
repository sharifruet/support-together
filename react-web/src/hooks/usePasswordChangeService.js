import useCrud from './useCrud';

const usePasswordChangeService = () => {
  const { getAll, getById, create, update, remove } = useCrud();

  const getAllPasswordChanges = () => {
    return getAll('/change-password');
  };

  const getPasswordChangeById = (id) => {
    return getById('/change-password', id);
  };

  const createPasswordChange = (data) => {
    return create('/change-password', data);
  };

  const updatePasswordChange = (id, data) => {
    return update('/change-password', id, data);
  };

  const deletePasswordChange = (id) => {
    return remove('/change-password', id);
  };

  return {
    getAllPasswordChanges,
    getPasswordChangeById,
    createPasswordChange,
    updatePasswordChange,
    deletePasswordChange,
  };
};

export default usePasswordChangeService;
