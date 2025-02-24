import { FamilyData, FamilyMember } from '../types/family';

type Gender = 'male' | 'female' | 'other';

// Basic relationship types that can be combined to form more complex relationships
type BasicRelationType = 
  | 'parent'
  | 'child'
  | 'sibling'
  | 'spouse'
  | 'cousin';

// Helper to find the most recent common ancestor (MRCA) and distances
interface AncestorResult {
  ancestor: string | null;
  dist1: number;  // Distance from person1 to MRCA
  dist2: number;  // Distance from person2 to MRCA
}

function findMRCA(id1: string, id2: string, familyData: FamilyData): AncestorResult {
  const ancestors1 = new Map<string, number>();
  const ancestors2 = new Map<string, number>();

  function getAncestors(id: string, distMap: Map<string, number>, dist: number = 0) {
    if (distMap.has(id)) return;
    distMap.set(id, dist);
    const member = familyData.members[id];
    member.parentIds.forEach(pid => getAncestors(pid, distMap, dist + 1));
  }

  getAncestors(id1, ancestors1);
  getAncestors(id2, ancestors2);

  let minTotalDist = Infinity;
  let result: AncestorResult = { ancestor: null, dist1: 0, dist2: 0 };

  ancestors1.forEach((dist1, ancestorId) => {
    const dist2 = ancestors2.get(ancestorId);
    if (dist2 !== undefined) {
      const totalDist = dist1 + dist2;
      if (totalDist < minTotalDist) {
        minTotalDist = totalDist;
        result = { ancestor: ancestorId, dist1, dist2 };
      }
    }
  });

  return result;
}

// Get gender-specific term for a basic relationship
function getGenderedTerm(relation: BasicRelationType, gender: Gender): string {
  const terms: Record<BasicRelationType, Record<Gender, string>> = {
    parent: { male: 'father', female: 'mother', other: 'parent' },
    child: { male: 'son', female: 'daughter', other: 'child' },
    sibling: { male: 'brother', female: 'sister', other: 'sibling' },
    spouse: { male: 'husband', female: 'wife', other: 'spouse' },
    cousin: { male: 'cousin', female: 'cousin', other: 'cousin' }
  };
  return terms[relation][gender];
}

// Add appropriate prefix for ancestor generations
function addGenerationalPrefix(term: string, generations: number): string {
  if (generations <= 1) return term;
  if (generations === 2) return `grand${term}`;
  return `great-`.repeat(generations - 2) + `grand${term}`;
}

function getRelationshipFromMRCA(dist1: number, dist2: number, targetGender: Gender, fromId?: string, toId?: string, familyData?: FamilyData): string {
  // Direct lineage cases
  if (dist1 === 0) {
    return addGenerationalPrefix(
      getGenderedTerm('child', targetGender), 
      dist2
    );
  }
  if (dist2 === 0) {
    return addGenerationalPrefix(
      getGenderedTerm('parent', targetGender), 
      dist1
    );
  }

  // Sibling cases
  if (dist1 === 1 && dist2 === 1) {
    return getGenderedTerm('sibling', targetGender);
  }

  // Aunt/Uncle cases
  if (dist2 === 1 && dist1 > 1) {
    const prefix = dist1 === 2 ? '' : 
                  dist1 === 3 ? 'great-' : 
                  `great-great-`.repeat(dist1 - 3);
    return prefix + (targetGender === 'female' ? 'aunt' : 'uncle');
  }

  // Niece/Nephew cases
  if (dist1 === 1 && dist2 > 1) {
    const prefix = dist2 === 2 ? '' : 
                  dist2 === 3 ? 'great-' : 
                  `great-great-`.repeat(dist2 - 3);
    return prefix + (targetGender === 'female' ? 'niece' : 'nephew');
  }

  // Cousin cases
  if (dist1 === dist2) {
    const degree = dist1 - 1;
    if (degree === 1) return 'cousin';
    return `${degree}${getNumberSuffix(degree)} cousin`;
  }

  // For more complex relationships, use descriptive path
  if (fromId && toId && familyData) {
    return buildDescriptivePath(dist1, dist2, targetGender, fromId, toId, familyData);
  }
  return buildDescriptivePath(dist1, dist2, targetGender, '', '', { members: {} }); // fallback
}

function getNumberSuffix(num: number): string {
  if (num === 1) return 'st';
  if (num === 2) return 'nd';
  if (num === 3) return 'rd';
  return 'th';
}

function buildDescriptivePath(dist1: number, dist2: number, targetGender: Gender, fromId: string, toId: string, familyData: FamilyData): string {
  // Find the actual path through the family tree
  function findActualPath(currentId: string, targetId: string, depth: number, path: string[] = []): string[] | null {
    if (depth < 0) return null;
    if (currentId === targetId) return path;

    const current = familyData.members[currentId];

    // Try parents
    for (const parentId of current.parentIds) {
      const result = findActualPath(parentId, targetId, depth - 1, [...path, parentId]);
      if (result) return result;
    }

    // Try children
    for (const childId of current.childrenIds) {
      const result = findActualPath(childId, targetId, depth - 1, [...path, childId]);
      if (result) return result;
    }

    return null;
  }

  // Handle cases like "parent's cousin" or "cousin's child"
  if (dist1 > dist2) {
    const baseRelation = getRelationshipFromMRCA(dist1 - dist2, 0, targetGender, fromId, toId, familyData);
    // Find the actual parent in the path
    const pathToTarget = findActualPath(fromId, toId, dist1 + dist2, []);
    if (pathToTarget && pathToTarget.length > 0) {
      const intermediateId = pathToTarget[0]; // First step in the path
      const intermediateGender = familyData.members[intermediateId].gender;
      const intermediateRelation = getGenderedTerm('parent', intermediateGender);
      return `${intermediateRelation}'s cousin`;
    }
    return `${baseRelation}'s cousin`;
  } else {
    const baseRelation = getRelationshipFromMRCA(0, dist2 - dist1, targetGender, fromId, toId, familyData);
    return `cousin's ${baseRelation}`;
  }
}

function getSpouseBasedRelationship(
  fromId: string, 
  toId: string, 
  familyData: FamilyData,
  visited = new Set<string>()
): string | null {
  const from = familyData.members[fromId];
  const to = familyData.members[toId];

  // Prevent infinite loops
  if (visited.has(fromId)) return null;
  visited.add(fromId);

  // Direct spouse
  if (from.partnerId === toId) {
    return getGenderedTerm('spouse', to.gender);
  }

  // Check if target is spouse of someone we have a relationship with
  for (const memberId of Object.keys(familyData.members)) {
    const member = familyData.members[memberId];
    if (member.partnerId === toId) {
      const relationToSpouse = getRelationship(fromId, memberId, familyData, new Set(visited));
      if (relationToSpouse === 'no relation') continue;

      // Handle basic family unit cases
      switch (relationToSpouse) {
        case 'father':
        case 'mother':
          return getGenderedTerm('parent', to.gender);
        case 'grandfather':
        case 'grandmother':
          return 'grand' + getGenderedTerm('parent', to.gender);
        case 'great-grandfather':
        case 'great-grandmother':
          return 'great-grand' + getGenderedTerm('parent', to.gender);
      }

      // Special cases for aunt/uncle relationships
      if (relationToSpouse === 'uncle') return 'aunt';
      if (relationToSpouse === 'great-uncle') return 'great-aunt';
      if (relationToSpouse.endsWith('great-uncle')) return relationToSpouse.replace('uncle', 'aunt');
      
      // For other cases, append "'s wife/husband/spouse"
      return `${relationToSpouse}'s ${getGenderedTerm('spouse', to.gender)}`;
    }
  }

  // Check relationships through spouse's family
  if (from.partnerId) {
    const throughSpouse = getRelationship(from.partnerId, toId, familyData, visited);
    if (throughSpouse && throughSpouse !== 'no relation') {
      return throughSpouse + '-in-law';
    }
  }

  return null;
}

export function getRelationship(
  fromId: string, 
  toId: string, 
  familyData: FamilyData,
  visited = new Set<string>()
): string {
  if (fromId === toId) return 'self';

  const from = familyData.members[fromId];
  const to = familyData.members[toId];

  // Try spouse-based relationship first
  const spouseRelation = getSpouseBasedRelationship(fromId, toId, familyData, visited);
  if (spouseRelation) return spouseRelation;

  // Find relationship through common ancestor
  const { ancestor, dist1, dist2 } = findMRCA(fromId, toId, familyData);
  
  if (ancestor) {
    return getRelationshipFromMRCA(dist1, dist2, to.gender, fromId, toId, familyData);
  }

  return 'no relation';
}

export function getRelationshipToUser(
  memberId: string, 
  username: string | null, 
  familyData: FamilyData
): string {
  if (!username) return '';

  const currentUser = Object.values(familyData.members)
    .find(member => member.username === username);

  if (!currentUser) return '';
  if (currentUser.id === memberId) return 'you';

  const relationship = getRelationship(currentUser.id, memberId, familyData);
  return relationship ? `your ${relationship}` : '';
}