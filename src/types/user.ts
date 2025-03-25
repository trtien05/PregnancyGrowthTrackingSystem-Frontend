export interface IUser {
    id: number;
    fullName: string;
    email: string;
    username: string;
    role: 'admin' | 'member' | 'user';
    phoneNumber: string;
    dateOfBirth: string;
    nationality: string;
    bloodType: 
      | 'O_POSITIVE' 
      | 'O_NEGATIVE' 
      | 'A_POSITIVE' 
      | 'A_NEGATIVE' 
      | 'B_POSITIVE' 
      | 'B_NEGATIVE' 
      | 'AB_POSITIVE' 
      | 'AB_NEGATIVE';
    gender: boolean;
    symptoms?: string;
    enabled: boolean;
    verified: boolean;
    avatarUrl?: string;
    createdAt?: string;
    updatedAt?: string;
  }