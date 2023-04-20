export interface User {
  email: string;
  emailVerified: any;
  id: string;
  image: string;
  name: string;
  post?: Post[];
}

export interface Post {
  createdAt: string;
  id: string;
  published: boolean;
  title: string;
  updatedAt: string;
  userId: string;
  user?: User;
  comment: string[];
}