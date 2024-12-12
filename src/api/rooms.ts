import apiClient from './apiClient';

export const createRoom = async (name: string, password: string) => {
  const response = await apiClient.post('/rooms', { name, password });
  return response.data;
};

export const createConversation = async (roomId: string, participants: Array<string>) => {
  const response = await apiClient.post('/conversations', { roomId, participants });
  return response.data;
};

export const getConversation = async(roomId: string) => {
  try {
    const response = await apiClient.get(`/conversations/${roomId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // Return null for "no conversation" case
      return null;
    }
    // Rethrow other errors
    throw error;
  }
}

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