"use client";

import React, { useMemo } from "react";
import ReactFlow, { Background, Controls, Edge, Node } from "reactflow";
import "reactflow/dist/style.css";

import { useCourseQuery } from "@/hooks/api/useCoursesQuery";
import { useCoursesQuery } from "@/hooks/api/useCoursesQuery";

interface PrerequisiteGraphProps {
  courseCode: string;
}

/**
 * Visualises a course and all of its prerequisite courses as a simple
 * directed graph using React Flow.
 *
 *      +-------------+
 *  --> |  MATH 11   | --+
 *      +-------------+   \
 *                        +--> |  CSCI 61  |
 *      +-------------+   /    +-------------+
 *  --> |  CSCI 60    | --+
 *      +-------------+
 */
const PrerequisiteGraph: React.FC<PrerequisiteGraphProps> = ({
  courseCode,
}) => {
  const { data: course } = useCourseQuery(courseCode);
  const { data: catalog = [] } = useCoursesQuery();

  const { nodes, edges } = useMemo(() => {
    const effectivePrereqs = course?.prerequisites;

    if (!effectivePrereqs || effectivePrereqs.length === 0) {
      return { nodes: [] as Node[], edges: [] as Edge[] };
    }

    // Root node – the course itself
    const nodes: Node[] = [
      {
        id: courseCode,
        data: { label: courseCode },
        position: { x: 250, y: 150 },
        style: {
          background: "#fff",
          border: "1px solid #949494",
          padding: 8,
          borderRadius: 4,
          fontWeight: 600,
        },
      },
    ];

    const edges: Edge[] = [];

    // Helper to choose canonical code among cross-listed aliases
    const chooseCanonical = (aliases: string[]): string => {
      const csci = aliases.find((c) => c.startsWith("CSCI"));
      return csci ?? aliases[0];
    };

    // Build alias mapping using crossListedAs info from catalog
    const aliasToCanonical: Record<string, string> = {};
    catalog.forEach((c) => {
      if (c.crossListedAs && c.crossListedAs.length > 0) {
        const canonical = chooseCanonical([c.code!, ...c.crossListedAs]);
        [c.code!, ...c.crossListedAs].forEach((alias) => {
          aliasToCanonical[alias] = canonical;
        });
      }
    });

    // Build nodes & edges using canonical codes
    let xPos = 0;
    effectivePrereqs.forEach((group) => {
      const addedForGroup = new Set<string>();
      group.courses.forEach((rawCode: string) => {
        const code = aliasToCanonical[rawCode] ?? rawCode;

        if (!nodes.find((n) => n.id === code)) {
          nodes.push({
            id: code,
            data: { label: code },
            position: { x: xPos, y: 0 },
            style: {
              background: "#F9FAFB",
              border: "1px solid #D1D5DB",
              padding: 6,
              borderRadius: 4,
              fontSize: 12,
            },
          });
          xPos += 150;
        }

        // Only one edge per canonical prerequisite per group
        if (!addedForGroup.has(code)) {
          edges.push({
            id: `${code}->${courseCode}`,
            source: code,
            target: courseCode,
            animated: group.type === "or",
            style: { strokeWidth: 2 },
          });
          addedForGroup.add(code);
        }
      });
    });

    return { nodes, edges };
  }, [course, courseCode, catalog]);

  // If the course has no prerequisites, render nothing
  if (!nodes.length) {
    return null;
  }

  return (
    <div className="border rounded-md bg-muted/50 p-2" style={{ height: 320 }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background gap={16} size={1} />
        <Controls position="bottom-right" />
      </ReactFlow>
    </div>
  );
};

export default PrerequisiteGraph;
