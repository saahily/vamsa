import { FamilyData, FamilyMember } from '../types/family';

type RelationType = 
  | 'parent'
  | 'child'
  | 'sibling'
  | 'partner'
  | 'grandparent'
  | 'grandchild'
  | 'aunt/uncle'
  | 'niece/nephew'
  | 'cousin'
  | 'parent-in-law'
  | 'child-in-law'
  | 'sibling-in-law'
  | `great-grandparent`
  | `great-grandchild`
  | `great-great-grandparent`
  | `great-great-grandchild`;

function getDirectRelation(member: FamilyMember, otherId: string): RelationType | null {
  if (member.parentIds.includes(otherId)) return 'parent';
  if (member.childrenIds.includes(otherId)) return 'child';
  if (member.partnerId === otherId) return 'partner';
  return null;
}

function areSiblings(member1Id: string, member2Id: string, familyData: FamilyData): boolean {
  const member1 = familyData.members[member1Id];
  const member2 = familyData.members[member2Id];
  return member1.parentIds.some(parentId => member2.parentIds.includes(parentId));
}

function getRelationType(fromId: string, toId: string, familyData: FamilyData): RelationType | null {
  const from = familyData.members[fromId];
  const to = familyData.members[toId];
  
  if (!from || !to) return null;

  // Direct relationships
  const directRelation = getDirectRelation(from, toId);
  if (directRelation) return directRelation;

  // Check for ancestors (great-grandparents)
  let current = from;
  let generations = 0;
  while (current && current.parentIds.length > 0) {
    if (current.parentIds.includes(toId)) {
      return generations === 0 ? 'parent' :
             generations === 1 ? 'grandparent' :
             `great${'-great'.repeat(generations - 2)}-grandparent`;
    }
    current = familyData.members[current.parentIds[0]];
    generations++;
  }

  // Check for descendants (great-grandchildren)
  current = from;
  generations = 0;
  let descendants = [from.id];
  while (descendants.length > 0) {
    const nextGen: string[] = [];
    for (const descId of descendants) {
      const desc = familyData.members[descId];
      if (desc.childrenIds.includes(toId)) {
        return generations === 0 ? 'child' :
               generations === 1 ? 'grandchild' :
               `great${'-great'.repeat(generations - 2)}-grandchild`;
      }
      nextGen.push(...desc.childrenIds);
    }
    descendants = nextGen;
    generations++;
  }

  // Siblings
  if (areSiblings(fromId, toId, familyData)) return 'sibling';

  // Aunts/Uncles (by blood or marriage)
  if (from.parentIds.some(parentId => {
    const parent = familyData.members[parentId];
    return (
      // Blood aunt/uncle (parent's sibling)
      areSiblings(parent.id, toId, familyData) ||
      // Aunt/uncle by marriage (parent's sibling's spouse)
      parent.parentIds.some(grandparentId => 
        familyData.members[grandparentId].childrenIds.some(auntUncleId => {
          const auntUncle = familyData.members[auntUncleId];
          return auntUncle.partnerId === toId;
        })
      )
    );
  })) return 'aunt/uncle';

  // Nieces/Nephews
  if (areSiblings(fromId, from.id, familyData) && 
    familyData.members[from.id].childrenIds.includes(toId)
  ) return 'niece/nephew';

  // Cousins
  if (from.parentIds.some(parentId =>
    familyData.members[parentId].parentIds.some(grandparentId =>
      familyData.members[grandparentId].childrenIds.some(auntUncleId =>
        familyData.members[auntUncleId].childrenIds.includes(toId)
      )
    )
  )) return 'cousin';

  // In-laws through partner
  if (from.partnerId) {
    const partnerRelation = getDirectRelation(familyData.members[from.partnerId], toId);
    if (partnerRelation === 'parent') return 'parent-in-law';
    if (partnerRelation === 'sibling') return 'sibling-in-law';
  }

  // In-laws through siblings
  if (from.parentIds.some(parentId =>
    familyData.members[parentId].childrenIds.some(siblingId =>
      familyData.members[siblingId].partnerId === toId
    )
  )) return 'sibling-in-law';

  // Child's partner
  if (from.childrenIds.some(childId =>
    familyData.members[childId].partnerId === toId
  )) return 'child-in-law';

  return null;
}

function getGenderedTerm(relationType: RelationType, gender: 'male' | 'female' | 'other'): string {
  // Handle great-grandparent/child cases
  if (relationType.startsWith('great')) {
    const baseRelation = relationType.endsWith('parent') ? 'grandparent' : 'grandchild';
    const prefix = relationType.substring(0, relationType.length - baseRelation.length);
    const baseTerm = getGenderedTerm(baseRelation as RelationType, gender);
    return prefix + baseTerm;
  }

  const terms: Record<RelationType, Record<string, string>> = {
    'parent': { male: 'father', female: 'mother', other: 'parent' },
    'child': { male: 'son', female: 'daughter', other: 'child' },
    'sibling': { male: 'brother', female: 'sister', other: 'sibling' },
    'partner': { male: 'husband', female: 'wife', other: 'spouse' },
    'grandparent': { male: 'grandfather', female: 'grandmother', other: 'grandparent' },
    'grandchild': { male: 'grandson', female: 'granddaughter', other: 'grandchild' },
    'aunt/uncle': { male: 'uncle', female: 'aunt', other: 'parent\'s sibling' },
    'niece/nephew': { male: 'nephew', female: 'niece', other: 'sibling\'s child' },
    'cousin': { male: 'cousin', female: 'cousin', other: 'cousin' },
    'parent-in-law': { male: 'father-in-law', female: 'mother-in-law', other: 'parent-in-law' },
    'child-in-law': { male: 'son-in-law', female: 'daughter-in-law', other: 'child-in-law' },
    'sibling-in-law': { male: 'brother-in-law', female: 'sister-in-law', other: 'sibling-in-law' }
  };

  return terms[relationType]?.[gender] || relationType;
}

function findRelationshipPath(fromId: string, toId: string, familyData: FamilyData): string[] {
  const visited = new Set<string>();
  const queue: Array<{ id: string; path: string[] }> = [{ id: fromId, path: [] }];
  
  while (queue.length > 0) {
    const { id, path } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    const member = familyData.members[id];
    const connections = [
      ...member.parentIds.map(pid => ({ id: pid, type: 'parent' })),
      ...member.childrenIds.map(cid => ({ id: cid, type: 'child' })),
      ...(member.partnerId ? [{ id: member.partnerId, type: 'partner' }] : [])
    ];

    for (const { id: nextId, type } of connections) {
      if (nextId === toId) {
        return [...path, type];
      }
      if (!visited.has(nextId)) {
        queue.push({ id: nextId, path: [...path, type] });
      }
    }
  }
  return [];
}

function simplifyRelationship(path: string[], fromId: string, toId: string, familyData: FamilyData): string | null {
  // Check for cousin's children
  if (path.length === 5 && 
      path[0] === 'parent' && 
      path[1] === 'parent' && 
      path[2] === 'child' && 
      path[3] === 'child' && 
      path[4] === 'child') {
    const targetMember = familyData.members[toId];
    return `cousin's ${getGenderedTerm('child', targetMember.gender)}`;
  }

  // Check for uncle/aunt's parent (through marriage or blood)
  if (path.length === 5 &&
      path[0] === 'parent' &&
      path[1] === 'parent' &&
      path[2] === 'child' &&
      path[3] === 'partner' &&
      path[4] === 'parent') {
    // Find the uncle/aunt (the partner in this case)
    const currentId = fromId;
    const parentId = familyData.members[currentId].parentIds[0];
    const grandparentId = familyData.members[parentId].parentIds[0];
    const auntUnclePartnerId = familyData.members[grandparentId].childrenIds
      .find(id => familyData.members[id].partnerId && 
        familyData.members[familyData.members[id].partnerId!].parentIds.includes(toId));

    if (auntUnclePartnerId) {
      // The actual uncle/aunt is the partner of the person we found
      const auntUncleId = familyData.members[auntUnclePartnerId].partnerId!;
      const targetMember = familyData.members[toId];
      return `${getGenderedTerm('aunt/uncle', familyData.members[auntUncleId].gender)}'s ${getGenderedTerm('parent', targetMember.gender)}`;
    }
  }

  // Add more patterns here
  return null;
}

function buildPossessiveChain(path: string[], fromId: string, toId: string, familyData: FamilyData): string {
  if (path.length === 0) return '';

  // Try to simplify the relationship first
  const simplified = simplifyRelationship(path, fromId, toId, familyData);
  if (simplified) return simplified;

  const terms: string[] = [];
  let currentId = fromId;

  for (let i = 0; i < path.length; i++) {
    const type = path[i];
    let nextId: string;

    const current = familyData.members[currentId];
    switch (type) {
      case 'parent':
        nextId = current.parentIds.find(pid => {
          const parent = familyData.members[pid];
          return parent.childrenIds.includes(
            i < path.length - 1 ? 
            familyData.members[currentId].parentIds[0] : toId
          );
        }) || current.parentIds[0];
        terms.push(getGenderedTerm('parent', familyData.members[nextId].gender));
        break;
      case 'child':
        nextId = current.childrenIds.find(cid => {
          const child = familyData.members[cid];
          return i === path.length - 1 ? 
            cid === toId : 
            child.childrenIds.includes(toId);
        }) || current.childrenIds[0];
        terms.push(getGenderedTerm('child', familyData.members[nextId].gender));
        break;
      case 'partner':
        nextId = current.partnerId!;
        terms.push(getGenderedTerm('partner', familyData.members[nextId].gender));
        break;
      default:
        nextId = currentId;
    }
    currentId = nextId;

    // Add possessive form for all except the last term
    if (i < path.length - 1) {
      const term = terms[terms.length - 1];
      terms[terms.length - 1] = term + (term.endsWith('s') ? '\'' : '\'s');
    }
  }

  return terms.join(' ');
}

function findCommonAncestor(fromId: string, toId: string, familyData: FamilyData): { 
  ancestor: string | null;
  dist1: number;
  dist2: number;
} {
  const ancestors1 = new Map<string, number>();
  const ancestors2 = new Map<string, number>();

  function traverseUp(id: string, ancestors: Map<string, number>, dist: number) {
    const member = familyData.members[id];
    ancestors.set(id, dist);
    member.parentIds.forEach(pid => {
      if (!ancestors.has(pid)) {
        traverseUp(pid, ancestors, dist + 1);
      }
    });
  }

  traverseUp(fromId, ancestors1, 0);
  traverseUp(toId, ancestors2, 0);

  let closestAncestor = null;
  let minTotalDist = Infinity;
  let dist1 = 0, dist2 = 0;

  ancestors1.forEach((d1, id) => {
    if (ancestors2.has(id)) {
      const d2 = ancestors2.get(id)!;
      const totalDist = d1 + d2;
      if (totalDist < minTotalDist) {
        minTotalDist = totalDist;
        closestAncestor = id;
        dist1 = d1;
        dist2 = d2;
      }
    }
  });

  return { ancestor: closestAncestor, dist1, dist2 };
}

function findBaseRelationship(fromId: string, toId: string, familyData: FamilyData, checkPartner: boolean = true): string | null {
  const from = familyData.members[fromId];
  const to = familyData.members[toId];

  // Handle direct relationships first
  if (from.parentIds.includes(toId)) return 'parent';
  if (from.childrenIds.includes(toId)) return 'child';
  if (from.partnerId === toId) return 'partner';

  // Find relationship through common ancestor
  const { ancestor, dist1, dist2 } = findCommonAncestor(fromId, toId, familyData);
  if (ancestor) {
    // Siblings
    if (dist1 === 1 && dist2 === 1) return 'sibling';
    
    // Cousins
    if (dist1 === 2 && dist2 === 2) return 'cousin';

    // Grandparent
    if (dist1 === 2 && dist2 === 0) return 'grandparent';

    // Grandchild
    if (dist1 === 0 && dist2 === 2) return 'grandchild';

    // Aunt/Uncle
    if (dist1 === 2 && dist2 === 1) return 'aunt/uncle';
    
    // Niece/Nephew
    if (dist1 === 1 && dist2 === 2) return 'niece/nephew';
  }

  // Check for relationships through marriage
  if (checkPartner) {
    // Check if target is someone's partner
    if (to.partnerId) {
      const partnerBaseRelation = findBaseRelationship(fromId, to.partnerId, familyData, false);
      if (partnerBaseRelation === 'aunt/uncle') {
        return 'aunt/uncle'; // Return just aunt/uncle instead of "aunt/uncle's partner"
      }
      if (partnerBaseRelation) {
        return `${partnerBaseRelation} partner`;
      }
    }

    // Check if target is a partner of someone we have a relationship with
    const partnerOf = Object.values(familyData.members)
      .find(member => member.partnerId === toId);
    if (partnerOf) {
      const baseRelation = findBaseRelationship(fromId, partnerOf.id, familyData, false);
      if (baseRelation === 'aunt/uncle') {
        return 'aunt/uncle'; // Return just aunt/uncle for spouse of aunt/uncle
      }
    }
  }

  return null;
}

function buildRelationship(fromId: string, toId: string, familyData: FamilyData): string {
  const baseRelation = findBaseRelationship(fromId, toId, familyData);
  if (!baseRelation) {
    // Only fall back to path-based as a last resort
    const path = findRelationshipPath(fromId, toId, familyData);
    return buildPossessiveChain(path, fromId, toId, familyData);
  }

  // Handle special cases for partner relationships
  if (baseRelation.endsWith(' partner')) {
    const mainRelation = baseRelation.slice(0, -' partner'.length);
    const gender = familyData.members[toId].gender;
    return `${mainRelation}'s ${getGenderedTerm('partner', gender)}`;
  }

  return getGenderedTerm(baseRelation as RelationType, familyData.members[toId].gender);
}

export function getRelationship(fromId: string, toId: string, familyData: FamilyData): string {
  // Use the new relationship builder that can handle complex relationships
  return buildRelationship(fromId, toId, familyData);
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