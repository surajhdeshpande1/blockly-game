export type MazeCell = 0 | 1 | 2 | 3;
export type Direction = 'up' | 'right' | 'down' | 'left';

export interface LevelData {
  id: number;
  grid: MazeCell[][];
  startPos: { x: number; y: number };
  startDir: Direction;
  maxBlocks: number;
  toolbox: any;
}

// 0: Path, 1: Wall, 2: Start, 3: Goal
const W = 1;
const P = 0;
const S = 2;
const G = 3;

// Common Toolbox Definitions
const TB_MOVE = { kind: 'block', type: 'maze_moveForward' };
const TB_TURN = { kind: 'block', type: 'maze_turn' };
const TB_REPEAT = { kind: 'block', type: 'maze_forever' };
const TB_IF = { kind: 'block', type: 'maze_if' };
const TB_IFELSE = { kind: 'block', type: 'maze_ifElse' };

export const levels: LevelData[] = [
  // ==========================================
  // EASY (Levels 1-3)
  // ==========================================
  
  // Level 1: Straight Line
  {
    id: 1,
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W],
      [W,S,P,G,W,W,W,W],
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W]
    ],
    startPos: { x: 1, y: 4 },
    startDir: 'right',
    maxBlocks: 2, // move, move
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE] }
  },
  
  // Level 2: L-Shape
  {
    id: 2,
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W],
      [W,W,W,G,W,W,W,W],
      [W,W,W,P,W,W,W,W],
      [W,S,P,P,W,W,W,W],
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W]
    ],
    startPos: { x: 1, y: 4 },
    startDir: 'right',
    maxBlocks: 4, // move, move, turn left, move
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN] }
  },
  
  // Level 3: Long straight (Repeat Intro)
  {
    id: 3,
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W],
      [W,S,P,P,P,P,G,W],
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W]
    ],
    startPos: { x: 1, y: 4 },
    startDir: 'right',
    maxBlocks: 2, // repeat { move }
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_REPEAT] }
  },

  // ==========================================
  // MEDIUM (Levels 4-8)
  // ==========================================
  
  // Level 4: Zig-Zag / Stairs
  {
    id: 4,
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,G,W,W],
      [W,W,W,W,W,P,W,W],
      [W,W,W,W,P,P,W,W],
      [W,W,W,P,P,W,W,W],
      [W,W,P,P,W,W,W,W],
      [W,S,P,W,W,W,W,W],
      [W,W,W,W,W,W,W,W]
    ],
    startPos: { x: 1, y: 6 },
    startDir: 'right',
    maxBlocks: 5, // repeat { move, turn left, move, turn right }
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN, TB_REPEAT] }
  },
  
  // Level 5: Left Turn Spiral
  {
    id: 5,
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,P,P,P,P,P,W,W],
      [W,P,W,W,W,P,W,W],
      [W,P,W,G,W,P,W,W],
      [W,P,W,P,P,P,W,W],
      [W,P,W,W,W,W,W,W],
      [W,S,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W]
    ],
    startPos: { x: 1, y: 6 },
    startDir: 'up',
    maxBlocks: 4, // repeat { move, if left { turn left } }
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN, TB_REPEAT, TB_IF] }
  },
  
  // Level 6: Left and Right branches
  {
    id: 6,
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,W,P,P,P,G,W,W],
      [W,W,P,W,W,W,W,W],
      [W,W,P,P,P,W,W,W],
      [W,W,W,W,P,W,W,W],
      [W,S,P,P,P,W,W,W],
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W]
    ],
    startPos: { x: 1, y: 5 },
    startDir: 'right',
    maxBlocks: 6, // repeat { move, if left { turn left }, if right { turn right } }
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN, TB_REPEAT, TB_IF] }
  },
  
  // Level 7: Intro to If-Else (Right-turning spiral)
  {
    id: 7,
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,P,P,P,P,P,W,W],
      [W,P,W,W,W,P,W,W],
      [W,P,W,G,P,P,W,W],
      [W,P,W,W,W,W,W,W],
      [W,P,W,W,W,W,W,W],
      [W,S,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W]
    ],
    startPos: { x: 1, y: 6 },
    startDir: 'up',
    maxBlocks: 4, // repeat { if ahead { move } else { turn right } }
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN, TB_REPEAT, TB_IFELSE] }
  },
  
  // Level 8: Left Wall Follower 
  {
    id: 8,
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,G,P,P,W,W,W,W],
      [W,W,W,P,W,W,W,W],
      [W,W,W,P,P,P,W,W],
      [W,W,W,W,W,P,W,W],
      [W,W,W,W,W,P,W,W],
      [W,S,P,P,P,P,W,W],
      [W,W,W,W,W,W,W,W]
    ],
    startPos: { x: 1, y: 6 },
    startDir: 'right',
    maxBlocks: 6, // repeat { if left { turn left }, if ahead { move } else { turn right } }
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN, TB_REPEAT, TB_IF, TB_IFELSE] }
  },

  // ==========================================
  // HARD (Levels 9-10)
  // ==========================================
  
  // Level 9: Nested If-Else
  {
    id: 9,
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,G,P,P,P,P,W,W],
      [W,W,W,W,W,P,W,W],
      [W,W,P,P,P,P,W,W],
      [W,W,P,W,W,W,W,W],
      [W,S,P,W,W,W,W,W],
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W]
    ],
    startPos: { x: 1, y: 5 },
    startDir: 'right',
    maxBlocks: 6, // repeat { if ahead { move } else { if left { turn left } else { turn right } } }
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN, TB_REPEAT, TB_IFELSE] }
  },
  
  // Level 10: The Ultimate Maze (Dead ends require smart turning)
  {
    id: 10,
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,G,P,W,P,W,W,W],
      [W,W,P,W,P,W,W,W],
      [W,W,P,P,P,W,W,W],
      [W,W,W,W,P,W,W,W],
      [W,P,P,P,P,W,W,W],
      [W,S,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W]
    ],
    startPos: { x: 1, y: 6 },
    startDir: 'up',
    maxBlocks: 6, // repeat { if left { turn left } if right { turn right } move }
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN, TB_REPEAT, TB_IF, TB_IFELSE] }
  }
];
