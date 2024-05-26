import useCrud from './useCrud';

const useTopicService = () => {
  const { getAll, getById, create, update, remove } = useCrud();

  const getAllTopics = () => {
    return getAll('/topics');
  };

  const getTopicById = (id) => {
    return getById('/topics', id);
  };

  const createTopic = (data) => {
    return create('/topics', data);
  };

  const updateTopic = (id, data) => {
    return update('/topics', id, data);
  };

  const deleteTopic = (id) => {
    return remove('/topics', id);
  };

  return {
    getAllTopics,
    getTopicById,
    createTopic,
    updateTopic,
    deleteTopic,
  };
};

export default useTopicService;
