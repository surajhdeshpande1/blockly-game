"use client";

import { useEffect, useState, useRef } from 'react';
import { BlocklyWorkspace } from 'react-blockly';
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import { defineMazeBlocks } from '../game/blocks';
import { levels, LevelData, Direction, MazeCell } from '../game/levels';
import styles from './Game.module.css';

import { UserData } from './Onboarding';

interface GameProps {
  user: UserData;
}

// Define blocks outside the component so they are registered before render
if (typeof window !== 'undefined') {
  defineMazeBlocks();
}

export default function Game({ user }: GameProps) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [xml, setXml] = useState('');
  const [blocksUsed, setBlocksUsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<'won' | 'lost' | null>(null);
  
  const levelData = levels[levelIndex];
  
  // Game State Refs (we use refs for state that the async evaluator accesses)
  const playerPos = useRef({ ...levelData.startPos });
  const playerDir = useRef<Direction>(levelData.startDir);
  const isPlayingRef = useRef(false);

  // Force re-render for UI updates
  const [, forceRender] = useState(0);
  
  // Reset when level changes
  useEffect(() => {
    playerPos.current = { ...levelData.startPos };
    playerDir.current = levelData.startDir;
    setGameResult(null);
    setIsPlaying(false);
    isPlayingRef.current = false;
    setXml(''); // Clear workspace for new level
    forceRender(r => r + 1);
  }, [levelIndex, levelData]);

  const onWorkspaceChange = (workspace: Blockly.Workspace) => {
    const code = javascriptGenerator.workspaceToCode(workspace);
    // Rough count of blocks
    setBlocksUsed(workspace.getAllBlocks(false).length);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // The Game Engine API exposed to Blockly
  const api = {
    moveForward: async () => {
      if (!isPlayingRef.current) return;
      const { x, y } = playerPos.current;
      let newX = x, newY = y;
      
      switch (playerDir.current) {
        case 'up': newY -= 1; break;
        case 'right': newX += 1; break;
        case 'down': newY += 1; break;
        case 'left': newX -= 1; break;
      }
      
      // Check boundaries and walls
      if (
        newY >= 0 && newY < levelData.grid.length &&
        newX >= 0 && newX < levelData.grid[0].length &&
        levelData.grid[newY][newX] !== 1 // 1 is Wall
      ) {
        playerPos.current = { x: newX, y: newY };
      } else {
        // Hit a wall
        setGameResult('lost');
        isPlayingRef.current = false;
      }
      forceRender(r => r + 1);
      await sleep(300); // Animation delay
    },
    turnLeft: async () => {
      if (!isPlayingRef.current) return;
      const dirs: Direction[] = ['up', 'left', 'down', 'right'];
      const idx = dirs.indexOf(playerDir.current);
      playerDir.current = dirs[(idx + 1) % 4];
      forceRender(r => r + 1);
      await sleep(200);
    },
    turnRight: async () => {
      if (!isPlayingRef.current) return;
      const dirs: Direction[] = ['up', 'right', 'down', 'left'];
      const idx = dirs.indexOf(playerDir.current);
      playerDir.current = dirs[(idx + 1) % 4];
      forceRender(r => r + 1);
      await sleep(200);
    },
    notDone: async () => {
      const { x, y } = playerPos.current;
      return levelData.grid[y][x] !== 3; // 3 is Goal
    },
    isPathForward: async () => {
      const { x, y } = playerPos.current;
      let newX = x, newY = y;
      switch (playerDir.current) {
        case 'up': newY -= 1; break;
        case 'right': newX += 1; break;
        case 'down': newY += 1; break;
        case 'left': newX -= 1; break;
      }
      return newY >= 0 && newY < levelData.grid.length && newX >= 0 && newX < levelData.grid[0].length && levelData.grid[newY][newX] !== 1;
    },
    isPathLeft: async () => {
      const { x, y } = playerPos.current;
      let newX = x, newY = y;
      switch (playerDir.current) {
        case 'up': newX -= 1; break;
        case 'right': newY -= 1; break;
        case 'down': newX += 1; break;
        case 'left': newY += 1; break;
      }
      return newY >= 0 && newY < levelData.grid.length && newX >= 0 && newX < levelData.grid[0].length && levelData.grid[newY][newX] !== 1;
    },
    isPathRight: async () => {
      const { x, y } = playerPos.current;
      let newX = x, newY = y;
      switch (playerDir.current) {
        case 'up': newX += 1; break;
        case 'right': newY += 1; break;
        case 'down': newX -= 1; break;
        case 'left': newY -= 1; break;
      }
      return newY >= 0 && newY < levelData.grid.length && newX >= 0 && newX < levelData.grid[0].length && levelData.grid[newY][newX] !== 1;
    }
  };

  const handleRunProgram = async () => {
    // Reset player position first
    playerPos.current = { ...levelData.startPos };
    playerDir.current = levelData.startDir;
    setGameResult(null);
    setIsPlaying(true);
    isPlayingRef.current = true;
    forceRender(r => r + 1);
    
    // Get code from workspace
    const workspace = Blockly.getMainWorkspace();
    const code = javascriptGenerator.workspaceToCode(workspace);
    
    // Create an async function with the API functions in scope
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    
    try {
      const execute = new AsyncFunction(
        'moveForward', 'turnLeft', 'turnRight', 'notDone', 'isPathForward', 'isPathLeft', 'isPathRight',
        code
      );
      
      await execute(
        api.moveForward, api.turnLeft, api.turnRight, api.notDone, 
        api.isPathForward, api.isPathLeft, api.isPathRight
      );
      
      if (isPlayingRef.current) {
        // Finished execution, check if at goal
        const { x, y } = playerPos.current;
        if (levelData.grid[y][x] === 3) {
          setGameResult('won');
        } else {
          setGameResult('lost');
        }
      }
    } catch (e) {
      console.error("Execution error", e);
      setGameResult('lost');
    }
    
    setIsPlaying(false);
    isPlayingRef.current = false;
  };

  const renderGrid = () => {
    return (
      <div className={styles.gridContainer}>
        {levelData.grid.map((row, y) => (
          <div key={y} className={styles.row}>
            {row.map((cell, x) => {
              const isPlayerHere = playerPos.current.x === x && playerPos.current.y === y;
              let cellClass = styles.cell;
              
              if (cell === 1) cellClass += ` ${styles.wall}`;
              else cellClass += ` ${styles.path}`;
              
              if (cell === 3) cellClass += ` ${styles.goal}`;

              return (
                <div key={`${x}-${y}`} className={cellClass}>
                  {isPlayerHere && (
                    <div className={`${styles.player} ${styles[playerDir.current]}`}>
                      📍
                    </div>
                  )}
                  {cell === 3 && !isPlayerHere && (
                    <div className={styles.marker}>🎯</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.gameContainer}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          PLAYER: <span className={styles.highlight}>{user.name}</span> | YR: {user.year} | USN/CSN: {user.usn}
        </div>
        <div className={styles.levelSelector}>
          LEVEL {levelData.id} / 10
        </div>
      </header>
      
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <div className={styles.mazeWrapper}>
            {renderGrid()}
          </div>
          <div className={styles.controls}>
            <button 
              className={styles.runBtn} 
              onClick={handleRunProgram}
              disabled={isPlaying}
            >
              ▶ Run Program
            </button>
            <div className={styles.blocksCount}>
              You have used {blocksUsed} out of {levelData.maxBlocks} blocks.
            </div>
          </div>
          
          {gameResult && (
            <div className={`${styles.resultBanner} ${styles[gameResult]}`}>
              {gameResult === 'won' ? (
                <>
                  <h3>Level Completed!</h3>
                  {levelIndex < levels.length - 1 && (
                    <button 
                      onClick={() => {
                        setLevelIndex(levelIndex + 1);
                        setXml('');
                      }} 
                      className={styles.nextBtn}
                    >
                      Next Level
                    </button>
                  )}
                </>
              ) : (
                <h3>You didn't reach the goal. Try again!</h3>
              )}
            </div>
          )}
        </div>
        
        <div className={styles.rightPanel}>
          <BlocklyWorkspace
            key={levelIndex}
            toolboxConfiguration={levelData.toolbox}
            initialXml={xml}
            className={styles.workspace}
            workspaceConfiguration={{
              maxBlocks: levelData.maxBlocks,
              grid: {
                spacing: 20,
                length: 3,
                colour: '#ccc',
                snap: true
              },
            }}
            onWorkspaceChange={onWorkspaceChange}
            onXmlChange={setXml}
          />
        </div>
      </div>
    </div>
  );
}
