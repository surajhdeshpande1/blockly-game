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
  // Level 1: Simple straight line (needs 2 moves)
  // Blocks needed: move, move (Total: 2). Max: 3
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
    maxBlocks: 2,
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE] }
  },
  
  // Level 2: Turn required
  // Path: Move 2 right, turn left, move 1 up
  // Blocks needed: move, move, turn, move (Total: 4). Max: 5
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
    maxBlocks: 5,
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN] }
  },

  // Level 3: Introduction to Repeat
  // Long straight line
  // Blocks needed: repeat { move } (Total: 2). Max: 2
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
    maxBlocks: 2,
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_REPEAT] }
  },

  // Level 4: Stairs
  // Blocks needed: repeat { move, turn left, move, turn right } (Total: 5). Max: 5
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
    maxBlocks: 5,
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN, TB_REPEAT] }
  },

  // Level 5: Left-turn spiral, variable length segments
  // Blocks needed: repeat { move, if left { turn left } } (Total: 4). Max: 4
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
    maxBlocks: 4,
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN, TB_REPEAT, TB_IF] }
  },

  // Level 6: Right-turn spiral, variable length segments
  // Blocks needed: repeat { move, if right { turn right } } (Total: 4). Max: 4
  {
    id: 6,
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,W,P,P,P,P,P,W],
      [W,W,P,W,W,W,P,W],
      [W,W,P,W,G,W,P,W],
      [W,W,P,P,P,W,P,W],
      [W,W,P,W,W,W,W,W],
      [W,W,S,W,W,W,W,W],
      [W,W,W,W,W,W,W,W]
    ],
    startPos: { x: 2, y: 6 },
    startDir: 'up', 
    maxBlocks: 4,
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN, TB_REPEAT, TB_IF] }
  },

  // Level 7: Tricky - both left and right turns needed.
  // Blocks needed: repeat { move, if left { turn left }, if right { turn right } } (Total: 6). Max: 6
  {
    id: 7,
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,W,W,P,P,P,G,W],
      [W,W,W,P,W,W,W,W],
      [W,P,P,P,W,W,W,W],
      [W,P,W,W,W,W,W,W],
      [W,P,P,P,P,W,W,W],
      [W,W,W,W,S,W,W,W],
      [W,W,W,W,W,W,W,W]
    ],
    startPos: { x: 4, y: 6 },
    startDir: 'up',
    maxBlocks: 6,
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN, TB_REPEAT, TB_IF] }
  },

  // Level 8: Introduction to If-Else (Dead ends)
  // The path has small dead ends to the left. If they follow the left wall, they get stuck.
  // Solution: repeat { if-else forward { move } else { turn right } } (Total: 4). Max: 4
  {
    id: 8,
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,G,W,W],
      [W,W,W,W,W,P,W,W],
      [W,W,P,P,P,P,W,W], // dead end at (2,3)
      [W,W,P,W,W,W,W,W],
      [W,W,P,P,P,W,W,W], // dead end at (4,5)
      [W,W,W,W,S,W,W,W],
      [W,W,W,W,W,W,W,W]
    ],
    startPos: { x: 4, y: 6 },
    startDir: 'up',
    maxBlocks: 4,
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN, TB_REPEAT, TB_IFELSE] }
  },

  // Level 9: If-Else Left (Dead ends on the right)
  // Solution: repeat { if-else forward { move } else { turn left } } (Total: 4). Max: 4
  {
    id: 9,
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,G,W,W,W,W,W,W],
      [W,P,W,W,W,W,W,W],
      [W,P,P,P,W,W,W,W], // dead end at (3,3)
      [W,W,W,P,W,W,W,W],
      [W,W,P,P,W,W,W,W], // dead end at (2,5)
      [W,W,P,W,W,W,W,W],
      [W,W,S,W,W,W,W,W]
    ],
    startPos: { x: 2, y: 7 },
    startDir: 'up',
    maxBlocks: 4,
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN, TB_REPEAT, TB_IFELSE] }
  },

  // Level 10: The Ultimate Maze
  // Combines many concepts. Need 8 blocks.
  {
    id: 10,
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,G,W,P,P,P,W,W],
      [W,P,W,P,W,P,W,W],
      [W,P,P,P,W,P,W,W],
      [W,W,W,W,W,P,W,W],
      [W,P,P,P,P,P,W,W],
      [W,S,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W]
    ],
    startPos: { x: 1, y: 6 },
    startDir: 'up',
    maxBlocks: 8,
    toolbox: { kind: 'flyoutToolbox', contents: [TB_MOVE, TB_TURN, TB_REPEAT, TB_IF, TB_IFELSE] }
  }
];

// Ensure Level 6 start direction is correctly oriented for the path
levels[5].startDir = 'up';
