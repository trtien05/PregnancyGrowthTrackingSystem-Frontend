import { useCallback, useEffect, useState } from 'react';
import cookieUtils from '../utils/cookieUtils'
import axios from 'axios';

const getRole = () => {
  const decoded = cookieUtils.decodeJwt();

  if (!decoded || !decoded.role) return null;

  return decoded.authorities;
};

const useAuth = () => {
  const [role, setRole] = useState(getRole());
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  const token = cookieUtils.getToken();

  // Function to check token expiration
  const checkTokenExpiration = useCallback(() => {
    if (token) {
      const decoded = cookieUtils.decodeJwt();

      // Check if the token is expired
      if (!decoded || decoded.exp < Date.now() / 1000) {
        setRole(null);
        cookieUtils.deleteUser();
        return;
      }
    }
  }, [token]);

  useEffect(() => {
    const token = cookieUtils.getToken();

    // If there is no token, set the role to null
    if (!token) {
      setRole(null);
      return;
    }

    try {
      setLoading(true);

      // Set role
      setRole(getRole());

      // Fetch API to get info user
      const getInfo = async () => {
        const { data } = await axios.get('http://localhost:8080/api/v1/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("data", data);
        setUser(data);
      };

      getInfo();
    } finally {
      setLoading(false);
    }

    // Set up an interval to check token expiration every 5 seconds
    const intervalId = setInterval(checkTokenExpiration, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [checkTokenExpiration]);

  return { loading, role, user };
};

export default useAuth;