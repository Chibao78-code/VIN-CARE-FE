import api from './api';

export const maintenancePackageService = {
  // Get all maintenance packages
  getAllPackages: async () => {
    const response = await api.get('/maintenance-packages');
    return response;
  },
  
  // Get packages by offer type
  getPackagesByOfferType: async (offerTypeId) => {
    const response = await api.get(`/maintenance-packages/by-offer-type/${offerTypeId}`);
    return response;
  }
};
