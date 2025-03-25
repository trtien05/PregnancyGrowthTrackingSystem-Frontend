import axiosClient from '../utils/apiCaller';

const userService = {
  // Get all users with pagination
  getAllUsers: async (page = 0, size = 20) => {
    try {
      return await axiosClient.get('/users', {
        params: { page, size }
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get a single user by ID
  getUserById: async (id) => {
    try {
      return await axiosClient.get(`/users/${id}`);
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new user
  createUser: async (userData) => {
    try {
      // Format the data to match the expected backend format
      const processedData = formatUserData(userData);
      
      console.log('Creating user with data:', processedData);
      const response = await axiosClient.post('/users', processedData);
      console.log('Response:', response);
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      // Log more detailed error information if available
      if (error.response) {
        console.error('Server responded with:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  },

  // Update an existing user
  updateUser: async (id, userData) => {
    try {
      // Format the data to match the expected backend format
      const processedData = formatUserData(userData);
      
      console.log('Updating user with data:', processedData);
      return await axiosClient.put(`/users/${id}`, processedData);
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }
  },

  // Toggle user enabled status - simplified direct approach
  toggleUserStatus: async (id, enabled) => {
    try {
      console.log(`Attempting to toggle user ${id} status to ${enabled ? 'Active' : 'Inactive'}`);
      
      // First get the user
      const userResponse = await axiosClient.get(`/users/${id}`);
      const userData = userResponse.data;
      
      if (!userData) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      // Create a minimal payload with just the required fields
      const minimumPayload = {
        id: userData.id,
        fullName: userData.fullName,
        username: userData.username,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        nationality: userData.nationality,
        bloodType: userData.bloodType || 'O_POSITIVE',
        role: userData.role || 'user',
        symptoms: userData.symptoms || 'None',
        gender: userData.gender !== undefined ? userData.gender : false,
        dateOfBirth: userData.dateOfBirth,
        enabled: enabled, // The value we want to change
        verified: userData.verified !== undefined ? userData.verified : false
      };
      
      // Format dates properly
      if (minimumPayload.dateOfBirth && !minimumPayload.dateOfBirth.includes('T00:00:00')) {
        minimumPayload.dateOfBirth = minimumPayload.dateOfBirth.split('T')[0] + 'T00:00:00';
      }
      
      console.log('Sending toggle status update with payload:', minimumPayload);
      
      const response = await axiosClient.put(`/users/${id}`, minimumPayload);
      console.log('Toggle status response:', response);
      
      return response;
    } catch (error) {
      console.error(`Error toggling status for user ${id}:`, error);
      if (error.response) {
        console.error('Server response:', error.response.status);
        console.error('Error data:', error.response.data);
      }
      throw error;
    }
  }
};

// Helper function to format user data consistently for both create and update
function formatUserData(userData) {
  // Create a clean copy of the data
  const processedData = { ...userData };
  
  // Ensure date is in the correct format (YYYY-MM-DDT00:00:00)
  if (processedData.dateOfBirth) {
    // If it's already a string but not in the right format, convert it
    if (typeof processedData.dateOfBirth === 'string' && !processedData.dateOfBirth.includes('T00:00:00')) {
      processedData.dateOfBirth = processedData.dateOfBirth.split('T')[0] + 'T00:00:00';
    }
    // If it's a Date object or something else, convert to ISO and format
    else if (!(typeof processedData.dateOfBirth === 'string')) {
      processedData.dateOfBirth = new Date(processedData.dateOfBirth).toISOString().split('T')[0] + 'T00:00:00';
    }
  }
  
  // Make sure symptoms field is always set
  processedData.symptoms = processedData.symptoms || 'None';
  
  // If password is empty and we're updating, we should remove it
  if (processedData.password === '') {
    delete processedData.password;
  }
  
  return processedData;
}

export default userService;