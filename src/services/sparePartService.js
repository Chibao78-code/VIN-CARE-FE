import api from './api';

export const sparePartService = {
  // lay linh kien be 
  getAllSpareParts: async () => {
    const response = await api.get('/spare-parts');
    return response;
  },
  
  // lay linh kien con hang
  getInStockParts: async () => {
    const response = await api.get('/spare-parts/in-stock');
    return response;
  },
  
  // lay linh kien theo id
  getSparePartById: async (id) => {
    const response = await api.get(`/spare-parts/${id}`);
    return response;
  },
  
  // Admin: Tao moi linh kien
  createSparePart: async (sparePartData) => {
    const response = await api.post('/spare-parts', sparePartData);
    return response;
  },
  
  //  admin: Cap nhat linh kien
  updateSparePart: async (id, sparePartData) => {
    const response = await api.put(`/spare-parts/${id}`, sparePartData);
    return response;
  },
  
  // admin xoa linh kien
  deleteSparePart: async (id) => {
    const response = await api.delete(`/spare-parts/${id}`);
    return response;
  },
};
