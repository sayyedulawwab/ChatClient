import apiClient from './apiClient';

export const createRoom = async (name: string, password: string) => {
  const response = await apiClient.post('/rooms', { name, password });
  return response.data;
};

export const joinRoom = async (roomId: string) => {
  const response = await apiClient.put(`/rooms`, { roomId });
  return response.data;
};

export const getRoomDetails = async (roomId: string) => {
  const response = await apiClient.get(`/rooms/${roomId}`);
  return response.data;
};

export const getRoomMessages = async (roomId: string, page: number, pageSize: number) => {
  const response = await apiClient.get(`/conversations/${roomId}?page=${page}&pageSize=${pageSize}`);
  return response.data;
};