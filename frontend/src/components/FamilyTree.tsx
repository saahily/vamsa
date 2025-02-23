import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Node,
  Edge,
  Position,
  useReactFlow,
  ReactFlowProvider,
  EdgeTypes,
  OnNodesChange,
  NodeChange,
  applyNodeChanges,
  Viewport,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FamilyData, FamilyMember } from '../types/family';
import { FamilyMemberNode } from './FamilyMemberNode';
import { FamilyEdge } from './FamilyEdge';

const nodeTypes = {
  familyMember: FamilyMemberNode,
};

const edgeTypes: EdgeTypes = {
  family: FamilyEdge,
};

// Layout constants
const VERTICAL_SPACING = 300;
const HORIZONTAL_SPACING = 350;
const PARTNER_SPACING = 200;
const SIBLING_SPACING = 300;
const MIN_GENERATION_WIDTH = 1200;
const MIN_NODE_SPACING = 250;

interface FamilyTreeProps {
  data: FamilyData;
  currentYear: number;
  initialViewport: Viewport | null;
  onViewportChange: (viewport: Viewport) => void;
  focusedMemberId: string | null;
  onFocusChange: (memberId: string | null) => void;
}

const FamilyTreeInner: React.FC<FamilyTreeProps> = ({ 
  data, 
  currentYear,
  initialViewport,
  onViewportChange,
  focusedMemberId,
  onFocusChange,
}) => {
  const { fitView, setViewport, getViewport } = useReactFlow();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Apply initial viewport when component mounts
  useEffect(() => {
    if (initialViewport) {
      setViewport(initialViewport);
    }
  }, [initialViewport, setViewport]);

  // Save viewport changes
  useEffect(() => {
    const handleViewportChange = () => {
      const currentViewport = getViewport();
      onViewportChange(currentViewport);
    };

    // Debounce the viewport change handler
    let timeoutId: NodeJS.Timeout;
    const debouncedHandler = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleViewportChange, 100);
    };
    
    const container = document.querySelector('.react-flow__viewport');
    if (container) {
      // Add passive event listeners
      container.addEventListener('wheel', debouncedHandler, { passive: true });
      container.addEventListener('mouseup', debouncedHandler, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', debouncedHandler);
        container.removeEventListener('mouseup', debouncedHandler);
      }
      clearTimeout(timeoutId);
    };
  }, [getViewport, onViewportChange]);

  const isVisible = useCallback((member: FamilyMember) => {
    return parseInt(member.birthYear) <= currentYear;
  }, [currentYear]);

  const isMarriageVisible = useCallback((member: FamilyMember) => {
    return member.marriageYear && parseInt(member.marriageYear) <= currentYear;
  }, [currentYear]);

  const getConnectedMembers = useCallback((memberId: string) => {
    const member = data.members[memberId];
    const connectedIds = new Set<string>();
    const ancestorIds = new Set<string>();
    const descendantIds = new Set<string>();

    // Get all ancestors
    const getAncestors = (id: string) => {
      const person = data.members[id];
      person.parentIds.forEach(parentId => {
        if (isVisible(data.members[parentId])) {
          ancestorIds.add(parentId);
          // Add partner of parent if they exist
          const parent = data.members[parentId];
          if (parent.partnerId && isVisible(data.members[parent.partnerId])) {
            ancestorIds.add(parent.partnerId);
          }
          getAncestors(parentId);
        }
      });
    };

    // Get all descendants
    const getDescendants = (id: string) => {
      const person = data.members[id];
      person.childrenIds.forEach(childId => {
        if (isVisible(data.members[childId])) {
          descendantIds.add(childId);
          // Add partner of child if they exist
          const child = data.members[childId];
          if (child.partnerId && isVisible(data.members[child.partnerId])) {
            descendantIds.add(child.partnerId);
          }
          getDescendants(childId);
        }
      });
    };

    // Add the focused member
    connectedIds.add(memberId);

    // Add partner if exists
    if (member.partnerId && isVisible(data.members[member.partnerId])) {
      connectedIds.add(member.partnerId);
    }

    // Get ancestors and descendants
    getAncestors(memberId);
    getDescendants(memberId);

    return {
      all: new Set([...connectedIds, ...ancestorIds, ...descendantIds]),
      ancestors: ancestorIds,
      descendants: descendantIds,
      partner: member.partnerId
    };
  }, [data.members, isVisible]);

  const onNodesChange = useCallback<OnNodesChange>(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const handleFocusChange = useCallback((memberId: string | null) => {
    onFocusChange(memberId);
    setTimeout(() => fitView({ duration: 800, padding: 0.4 }), 50);
  }, [fitView, onFocusChange]);

  const calculateLayout = useCallback(() => {
    const nodePositions = new Map<string, { x: number; y: number }>();
    const levelMap = new Map<string, number>();
    const generationGroups = new Map<number, Set<string>>();
    
    // First pass: Calculate generation levels
    const calculateGenerationLevel = (memberId: string, level: number) => {
      if (levelMap.has(memberId)) {
        return;
      }
      
      levelMap.set(memberId, level);
      if (!generationGroups.has(level)) {
        generationGroups.set(level, new Set());
      }
      generationGroups.get(level)!.add(memberId);

      const member = data.members[memberId];
      
      // Add partner to same level
      if (member.partnerId && isVisible(data.members[member.partnerId])) {
        levelMap.set(member.partnerId, level);
        generationGroups.get(level)!.add(member.partnerId);
      }
      
      // Process children
      member.childrenIds.forEach(childId => {
        if (isVisible(data.members[childId])) {
          calculateGenerationLevel(childId, level + 1);
        }
      });
    };

    // Start from root nodes (those without parents)
    Object.values(data.members)
      .filter(member => member.parentIds.length === 0 && isVisible(member))
      .forEach(member => calculateGenerationLevel(member.id, 0));

    // Second pass: Calculate initial X positions
    const calculateInitialXPosition = (memberId: string, suggestedX: number = 0): number => {
      const member = data.members[memberId];
      const level = levelMap.get(memberId)!;
      
      // If position already calculated, return it
      if (nodePositions.has(memberId)) {
        return nodePositions.get(memberId)!.x;
      }

      let xPos = suggestedX;

      // If has parents, position relative to them
      if (member.parentIds.length > 0) {
        const parentPositions = member.parentIds
          .map(pid => nodePositions.get(pid))
          .filter((pos): pos is {x: number; y: number} => pos !== undefined);
        
        if (parentPositions.length > 0) {
          xPos = parentPositions.reduce((sum, pos) => sum + pos.x, 0) / parentPositions.length;
        }
      }

      // Get siblings (including self)
      const siblings = member.parentIds.length > 0 
        ? member.parentIds
            .flatMap(pid => data.members[pid].childrenIds)
            .filter(id => levelMap.get(id) === level)
        : [memberId];
      
      const siblingIndex = siblings.indexOf(memberId);
      const totalSiblings = siblings.length;
      
      // Adjust position based on sibling order
      xPos += (siblingIndex - (totalSiblings - 1) / 2) * SIBLING_SPACING;

      // Store position
      nodePositions.set(memberId, { x: xPos, y: level * VERTICAL_SPACING });

      // Position partner if exists
      if (member.partnerId && isVisible(data.members[member.partnerId])) {
        nodePositions.set(member.partnerId, {
          x: xPos + PARTNER_SPACING,
          y: level * VERTICAL_SPACING
        });
      }

      // Process children recursively
      member.childrenIds.forEach((childId, index) => {
        if (isVisible(data.members[childId])) {
          calculateInitialXPosition(childId, xPos);
        }
      });

      return xPos;
    };

    // Calculate initial positions starting from each root
    Object.values(data.members)
      .filter(member => member.parentIds.length === 0 && isVisible(member))
      .forEach((member, index, roots) => {
        calculateInitialXPosition(member.id, index * HORIZONTAL_SPACING * 2);
      });

    // Third pass: Resolve overlaps level by level
    generationGroups.forEach((members, level) => {
      const sortedMembers = Array.from(members)
        .sort((a, b) => nodePositions.get(a)!.x - nodePositions.get(b)!.x);

      // Ensure minimum spacing between nodes in the same level
      for (let i = 1; i < sortedMembers.length; i++) {
        const prevNode = sortedMembers[i - 1];
        const currentNode = sortedMembers[i];
        const prevPos = nodePositions.get(prevNode)!;
        const currentPos = nodePositions.get(currentNode)!;
        
        const minSpacing = data.members[prevNode].partnerId === sortedMembers[i] 
          ? PARTNER_SPACING 
          : HORIZONTAL_SPACING;

        if (currentPos.x - prevPos.x < minSpacing) {
          const shift = minSpacing - (currentPos.x - prevPos.x);
          
          // Shift current node and all its descendants
          const shiftSubtree = (nodeId: string, shiftAmount: number) => {
            const pos = nodePositions.get(nodeId)!;
            nodePositions.set(nodeId, { ...pos, x: pos.x + shiftAmount });
            
            const node = data.members[nodeId];
            if (node.partnerId) {
              const partnerPos = nodePositions.get(node.partnerId)!;
              nodePositions.set(node.partnerId, { ...partnerPos, x: partnerPos.x + shiftAmount });
            }
            
            node.childrenIds.forEach(childId => {
              if (isVisible(data.members[childId])) {
                shiftSubtree(childId, shiftAmount);
              }
            });
          };

          shiftSubtree(currentNode, shift);
        }
      }
    });

    // Final pass: Center the entire tree
    let minX = Infinity;
    let maxX = -Infinity;
    
    nodePositions.forEach(({ x }) => {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
    });

    const centerX = (minX + maxX) / 2;
    
    nodePositions.forEach((pos, id) => {
      nodePositions.set(id, {
        x: pos.x - centerX,
        y: pos.y
      });
    });

    // Create final nodes and edges
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const processedParentPairs = new Set<string>();

    // Get connected members if focusing
    const connectedMembers = focusedMemberId 
      ? getConnectedMembers(focusedMemberId)
      : null;

    // Create nodes and edges with centered positions
    Object.values(data.members).forEach(member => {
      if (!isVisible(member)) return;
      
      // Skip if focusing and member is not connected
      if (focusedMemberId && !connectedMembers?.all.has(member.id)) return;

      const position = nodePositions.get(member.id);
      if (!position) return;

      let nodeType = null;
      if (connectedMembers) {
        if (connectedMembers.ancestors.has(member.id)) {
          nodeType = 'ancestor';
        } else if (connectedMembers.descendants.has(member.id)) {
          nodeType = 'descendant';
        } else if (member.id === focusedMemberId) {
          nodeType = 'focused';
        } else if (member.id === connectedMembers.partner) {
          nodeType = 'partner';
        }
      }

      newNodes.push({
        id: member.id,
        type: 'familyMember',
        position,
        data: { 
          member,
          nodeType,
          onFocus: handleFocusChange,
          isFocused: focusedMemberId === member.id,
          currentYear,
        },
        draggable: true,
      });

      // Marriage connections - only if marriage year is reached
      if (member.partnerId && 
          isVisible(data.members[member.partnerId]) && 
          isMarriageVisible(member) &&
          !processedParentPairs.has(`${member.id}-${member.partnerId}`)) {
        // Skip if focusing and either partner is not connected
        if (!focusedMemberId || 
            (connectedMembers?.all.has(member.id) && 
             connectedMembers?.all.has(member.partnerId))) {
          newEdges.push({
            id: `marriage-${member.id}-${member.partnerId}`,
            source: member.id,
            target: member.partnerId,
            sourceHandle: 'marriage-right',
            targetHandle: 'marriage-left',
            type: 'family',
            data: { type: 'marriage' },
            style: { stroke: 'rgba(219, 39, 119, 0.5)' },
          });
        }
        processedParentPairs.add(`${member.id}-${member.partnerId}`);
        processedParentPairs.add(`${member.partnerId}-${member.id}`);
      }

      // Parent-child connections
      member.childrenIds.forEach(childId => {
        if (isVisible(data.members[childId])) {
          // Skip if focusing and either parent or child is not connected
          if (!focusedMemberId || 
              (connectedMembers?.all.has(member.id) && 
               connectedMembers?.all.has(childId))) {
            newEdges.push({
              id: `parent-child-${member.id}-${childId}`,
              source: member.id,
              target: childId,
              sourceHandle: 'parent-bottom',
              targetHandle: 'child-top',
              type: 'family',
              data: { type: 'parent-child' },
              style: { stroke: 'rgba(59, 130, 246, 0.5)' },
            });
          }
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [
    data,
    currentYear,
    focusedMemberId,
    getConnectedMembers,
    isVisible,
    isMarriageVisible,
    handleFocusChange
  ]);

  useEffect(() => {
    calculateLayout();
  }, [calculateLayout]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView={!initialViewport}
      minZoom={0.1}
      maxZoom={1.5}
      defaultViewport={initialViewport || { x: 0, y: 0, zoom: 0.5 }}
      fitViewOptions={{
        padding: 0.4,
        minZoom: 0.3,
        maxZoom: 1,
      }}
      deleteKeyCode={null} // Disable node deletion
    >
      <Controls 
        className="!bg-slate-800/50 !border-slate-700/50"
        style={{
          button: {
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            color: '#94a3b8',
            borderColor: 'rgba(51, 65, 85, 0.5)',
          },
          buttonHovered: {
            backgroundColor: 'rgba(51, 65, 85, 0.5)',
            color: '#e2e8f0',
          },
        }}
      />
    </ReactFlow>
  );
};

export const FamilyTree: React.FC<FamilyTreeProps> = (props) => {
  return (
    <div className="w-full h-[calc(100vh-12rem)]">
      <ReactFlowProvider>
        <FamilyTreeInner {...props} />
      </ReactFlowProvider>
    </div>
  );
};