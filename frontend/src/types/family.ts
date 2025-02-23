export interface FamilyMember {
  id: string;
  name: string;
  teluguName?: string;
  birthYear: string;
  deathYear?: string;
  imageUrl: string;
  parentIds: string[];
  childrenIds: string[];
  partnerId?: string;
  marriageYear?: string;
  biography?: string;
  username?: string;
  gender: 'male' | 'female' | 'other';
}

export interface FamilyData {
  members: Record<string, FamilyMember>;
  rootId: string;
}