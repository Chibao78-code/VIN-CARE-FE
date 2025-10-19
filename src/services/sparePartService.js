import api from './api';

export const sparePartService = {
  // lay tat ca linh kien tu be
  getAllSpareParts: async () => {
    const response = await api.get('/spare-parts');
    return response;
  },
  
  // check xem linh kien nao con hang
  getInStockParts: async () => {
    const response = await api.get('/spare-parts/in-stock');
    return response;
  },
  
  // Lay linh kien theo id
  getSparePartById: async (id) => {
    const response = await api.get(`/spare-parts/${id}`);
    return response;
  },
  
  // admin them linh kien moi
  createSparePart: async (sparePartData) => {
    const response = await api.post('/spare-parts', sparePartData);
    return response;
  },
  
  // admin cap nhat linh kien 
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
