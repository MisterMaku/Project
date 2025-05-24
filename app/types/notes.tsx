export interface Note {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}