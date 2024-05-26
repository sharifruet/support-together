import useCrud from './useCrud';

const useOrganizationService = () => {
  const { getAll, getById, create, update, remove } = useCrud();

  const getAllOrganizations = () => {
    return getAll('/organizations');
  };

  const getOrganizationById = (id) => {
    return getById('/organizations', id);
  };

  const createOrganization = (data) => {
    return create('/organizations', data);
  };

  const updateOrganization = (id, data) => {
    return update('/organizations', id, data);
  };

  const deleteOrganization = (id) => {
    return remove('/organizations', id);
  };

  return {
    getAllOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  };
};

export default useOrganizationService;
