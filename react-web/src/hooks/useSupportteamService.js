import useCrud from './useCrud';

const useSupportteamService = () => {
  const { getAll, getById, create, update, remove } = useCrud();

  const getAllSupportteam = () => {
    return getAll('/support-teams');
  };

  const getSupportteamById = (id) => {
    return getById('/support-teams', id);
  };

  const createSupportteam = (data) => {
    return create('/support-teams', data);
  };

  const updateSupportteam = (id, data) => {
    return update('/support-teams', id, data);
  };

  const deleteSupportteam = (id) => {
    return remove('/support-teams', id);
  };
  const getSupportteamMemberById = (id) => {
    return getById('/support-teams', id);
  };

  return {
    getAllSupportteam,
    getSupportteamById,
    createSupportteam,
    updateSupportteam,
    deleteSupportteam,
    getSupportteamMemberById,
  };
};

export default useSupportteamService;
