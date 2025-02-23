import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

export function FamilyEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: EdgeProps) {
  const isMarriage = data?.type === 'marriage';

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: isMarriage ? 0 : 0.5,
  });

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: isMarriage ? 2 : 2,
          strokeDasharray: isMarriage ? '5 5' : 'none',
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <path
        style={{
          ...style,
          strokeWidth: isMarriage ? 4 : 4,
          opacity: 0.1,
          filter: 'blur(2px)',
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />
    </>
  );
}