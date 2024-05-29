import useCrud from './useCrud';

const useUserInviteService = () => {
  const { getAll, getById, create, update, remove } = useCrud();

  const getAllUserInvites = () => {
    return getAll('/invite');
  };

  const getUserInviteById = (id) => {
    return getById('/invite', id);
  };

  const createUserInvite = (data) => {
    return create('/invite', data);
  };

  const updateUserInvite = (id, data) => {
    return update('/invite', id, data);
  };

  const deleteUserInvite = (id) => {
    return remove('/invite', id);
  };

  return {
    getAllUserInvites,
    getUserInviteById,
    createUserInvite,
    updateUserInvite,
    deleteUserInvite,
  };
};

export default useUserInviteService;
