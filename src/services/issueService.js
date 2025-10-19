import api from './api';

export const issueService = {
  // Lấy tất cả issues
  getAllIssues: async () => {
    const response = await api.get('/issues');
    return response;
  },
  
  // Lấy issues theo offer type
  getIssuesByOfferType: async (offerTypeId) => {
    const response = await api.get(`/issues/by-offer-type/${offerTypeId}`);
    return response;
  },
  
  // Lấy issue theo ID
  getIssueById: async (id) => {
    const response = await api.get(`/issues/${id}`);
    return response;
  },
};
