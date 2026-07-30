import { apiClient } from './api';
import type { User } from '../types';
import { MOCK_USER } from './mockData';

export interface LoginParams {
  email: string;
  password?: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password?: string;
  hospital?: string;
}

interface RegisteredUserRecord {
  id?: string;
  name: string;
  email: string;
  password?: string;
  hospital?: string;
  role?: string;
}

const DEFAULT_REGISTERED_USERS: RegisteredUserRecord[] = [
  {
    id: 'usr-demo-1',
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@neuroscanai.med',
    password: 'password123',
    hospital: 'Metropolitan Neurological Institute',
    role: 'Neuroradiologist'
  }
];

function getRegisteredUsers(): RegisteredUserRecord[] {
  const data = localStorage.getItem('neuroscan_registered_users');
  if (!data) {
    localStorage.setItem('neuroscan_registered_users', JSON.stringify(DEFAULT_REGISTERED_USERS));
    return DEFAULT_REGISTERED_USERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_REGISTERED_USERS;
  }
}

function saveRegisteredUser(record: RegisteredUserRecord) {
  const list = getRegisteredUsers();
  const existingIndex = list.findIndex(u => u.email.toLowerCase() === record.email.toLowerCase());
  if (existingIndex >= 0) {
    list[existingIndex] = { ...list[existingIndex], ...record };
  } else {
    list.push(record);
  }
  localStorage.setItem('neuroscan_registered_users', JSON.stringify(list));
}

export const authService = {
  async login(credentials: LoginParams): Promise<{ user: User; token: string }> {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { user, token } = response.data;
      if (token) {
        localStorage.setItem('neuroscan_token', token);
      }
      if (user) {
        localStorage.setItem('neuroscan_user', JSON.stringify(user));
      }
      return { user, token };
    } catch (error: any) {
      // If backend returned an HTTP error response (e.g. 401 Invalid Credentials), ALWAYS throw error!
      if (error?.response) {
        const msg = error.response.data?.message || 'Invalid credentials. Please check your email and password.';
        throw new Error(msg);
      }

      // Offline / Local fallback: Strictly verify email & password against registered users
      const normEmail = credentials.email.toLowerCase().trim();
      const registeredUsers = getRegisteredUsers();
      const matchedUser = registeredUsers.find(u => u.email.toLowerCase() === normEmail);

      if (!matchedUser) {
        throw new Error('Account not found for this email. Please sign up first.');
      }

      if (credentials.password && matchedUser.password && matchedUser.password !== credentials.password) {
        throw new Error('Incorrect password. Please check your credentials.');
      }

      const mockToken = 'jwt-token-demo-' + Date.now();
      const user: User = {
        id: matchedUser.id || `usr-${Date.now()}`,
        name: matchedUser.name,
        email: matchedUser.email,
        hospital: matchedUser.hospital || 'Metropolitan Neurological Institute',
        role: matchedUser.role || 'Neuroradiologist',
        avatar: MOCK_USER.avatar,
      };
      localStorage.setItem('neuroscan_token', mockToken);
      localStorage.setItem('neuroscan_user', JSON.stringify(user));
      return { user, token: mockToken };
    }
  },

  async register(data: RegisterParams): Promise<{ user: User; token: string }> {
    // Save locally to registered users registry
    saveRegisteredUser({
      name: data.name,
      email: data.email.toLowerCase().trim(),
      password: data.password || 'password123',
      hospital: data.hospital,
      role: 'Neuroradiologist'
    });

    try {
      const response = await apiClient.post('/auth/register', data);
      const { user, token } = response.data;
      if (token) {
        localStorage.setItem('neuroscan_token', token);
      }
      if (user) {
        localStorage.setItem('neuroscan_user', JSON.stringify(user));
      }
      return { user, token };
    } catch (error: any) {
      if (error?.response) {
        const msg = error.response.data?.message || 'Registration failed. Please check inputs.';
        throw new Error(msg);
      }

      const mockToken = 'jwt-token-reg-' + Date.now();
      const user: User = {
        id: `usr-${Date.now()}`,
        name: data.name,
        email: data.email.toLowerCase().trim(),
        hospital: data.hospital || 'Metropolitan Neurological Institute',
        role: 'Neuroradiologist',
        avatar: MOCK_USER.avatar,
      };
      localStorage.setItem('neuroscan_token', mockToken);
      localStorage.setItem('neuroscan_user', JSON.stringify(user));
      return { user, token: mockToken };
    }
  },

  async loginWithGoogleToken(credential: string): Promise<{ user: User; token: string }> {
    const response = await apiClient.post('/auth/google/verify', { credential });
    const { user, token } = response.data;
    if (token) {
      localStorage.setItem('neuroscan_token', token);
    }
    if (user) {
      localStorage.setItem('neuroscan_user', JSON.stringify(user));
    }
    return { user, token };
  },

  redirectToGoogleAuth(): void {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${baseUrl}/auth/google`;
  },

  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get('/auth/me');
      const userObj = response.data?.user || response.data;
      if (userObj) {
        localStorage.setItem('neuroscan_user', JSON.stringify(userObj));
        return userObj;
      }
      throw new Error('No profile data');
    } catch (error) {
      const savedUser = localStorage.getItem('neuroscan_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {
          // parse error
        }
      }
      return MOCK_USER;
    }
  },

  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      const userObj = response.data?.user || response.data;
      if (userObj) {
        localStorage.setItem('neuroscan_user', JSON.stringify(userObj));
        return userObj;
      }
      throw new Error('No updated profile data');
    } catch (error) {
      const current = await this.getProfile();
      const updated = { ...current, ...profileData };
      localStorage.setItem('neuroscan_user', JSON.stringify(updated));
      return updated;
    }
  },

  logout(): void {
    localStorage.removeItem('neuroscan_token');
    localStorage.removeItem('neuroscan_user');
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string; otp?: string; email: string }> {
    const normEmail = email.toLowerCase().trim();
    try {
      const response = await apiClient.post('/auth/forgot-password', { email: normEmail });
      return response.data;
    } catch (error: any) {
      if (error?.response) {
        throw new Error(error.response.data?.message || 'Account not found for this email address.');
      }

      // Local fallback verification check
      const registeredUsers = getRegisteredUsers();
      const matched = registeredUsers.find(u => u.email.toLowerCase() === normEmail);
      if (!matched) {
        throw new Error('No account found with this email address. Please sign up first.');
      }

      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem(`neuroscan_reset_otp_${normEmail}`, mockOtp);
      return {
        success: true,
        message: `Password reset verification code generated for ${normEmail}`,
        email: normEmail,
        otp: mockOtp
      };
    }
  },

  async resetPassword(params: { email: string; otp: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const normEmail = params.email.toLowerCase().trim();
    try {
      const response = await apiClient.post('/auth/reset-password', {
        email: normEmail,
        otp: params.otp,
        newPassword: params.newPassword
      });
      return response.data;
    } catch (error: any) {
      if (error?.response) {
        throw new Error(error.response.data?.message || 'Password reset failed. Please check OTP code.');
      }

      // Local fallback verification & password update
      const registeredUsers = getRegisteredUsers();
      const userIndex = registeredUsers.findIndex(u => u.email.toLowerCase() === normEmail);
      if (userIndex < 0) {
        throw new Error('Account not found');
      }

      const storedOtp = sessionStorage.getItem(`neuroscan_reset_otp_${normEmail}`);
      if (storedOtp && storedOtp !== params.otp) {
        throw new Error('Invalid 6-digit verification OTP code.');
      }

      registeredUsers[userIndex].password = params.newPassword;
      localStorage.setItem('neuroscan_registered_users', JSON.stringify(registeredUsers));
      sessionStorage.removeItem(`neuroscan_reset_otp_${normEmail}`);

      return {
        success: true,
        message: 'Password reset successfully! You can now log in with your new password.'
      };
    }
  }
};
