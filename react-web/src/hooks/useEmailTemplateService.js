import useCrud from './useCrud';

const useEmailTemplateService = () => {
  const { getAll, getById, create, update, remove } = useCrud();

  const getAllEmailTemplates = () => {
    return getAll('/email-templates');
  };

  const getEmailTemplateById = (id) => {
    return getById('/email-templates', id);
  };

  const createEmailTemplate = (data) => {
    return create('/email-templates', data);
  };

  const updateEmailTemplate = (id, data) => {
    return update('/email-templates', id, data);
  };

  const deleteEmailTemplate = (id) => {
    return remove('/email-templates', id);
  };

  return {
    getAllEmailTemplates,
    getEmailTemplateById,
    createEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
  };
};

export default useEmailTemplateService;
