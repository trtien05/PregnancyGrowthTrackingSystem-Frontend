export interface UserDto {
  id: number;
  fullName: string;
  email: string;
  username: string;
  enabled: boolean;
  verified: boolean;
  role: string;
  phoneNumber: string;
  dateOfBirth: string;
  avatarUrl: string;
  gender: boolean;
  bloodType: string;
  symptoms: string;
  nationality: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBlogPost {
  id: number;
  heading: string;
  pageTitle: string;
  shortDescription: string;
  content: string;
  nameTags: string[];
  isVisible: boolean;
  featuredImageUrl: string;
  userDto?: UserDto;
  createdAt: string;
  updatedAt: string;
}