import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Helper to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Token expired');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Create a new journal entry
export const createJournalEntry = async (entryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/entries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(entryData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create journal entry');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating journal entry:', error);
    throw error;
  }
};

// Get all journal entries with optional filtering
export const getJournalEntries = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.mood) queryParams.append('mood', params.mood);
    if (params.search) queryParams.append('search', params.search);
    
    const response = await fetch(`${API_BASE_URL}/entries?${queryParams}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch journal entries');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }
};

// Get a specific journal entry
export const getJournalEntry = async (entryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/entries/${entryId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch journal entry');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    throw error;
  }
};

// Update a journal entry
export const updateJournalEntry = async (entryId, entryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/entries/${entryId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(entryData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update journal entry');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating journal entry:', error);
    throw error;
  }
};

// Delete a journal entry
export const deleteJournalEntry = async (entryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/entries/${entryId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete journal entry');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    throw error;
  }
};

// Get journal statistics
export const getJournalStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/entries/stats`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch journal statistics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching journal statistics:', error);
    throw error;
  }
};
