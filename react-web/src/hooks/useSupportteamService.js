import useCrud from './useCrud';

const useSupportTeamService = () => {
  const { getAll, getById, create, update, remove } = useCrud();

  const getAllSupportTeams = () => {
    return getAll('/support-teams');
  };

  const getSupportTeamById = (id) => {
    return getById('/support-teams', id);
  };

  const createSupportTeam = (data) => {
    return create('/support-teams', data);
  };

  const updateSupportTeam = (id, data) => {
    return update('/support-teams', id, data);
  };

  const deleteSupportTeam = (id) => {
    return remove('/support-teams', id);
  };
  const getSupportTeamMemberById = (id) => {
    return getById('/support-teams', id);
  };

  return {
    getAllSupportTeams,
    getSupportTeamById,
    createSupportTeam,
    updateSupportTeam,
    deleteSupportTeam,
    getSupportTeamMemberById,
  };
};

export default useSupportTeamService;
