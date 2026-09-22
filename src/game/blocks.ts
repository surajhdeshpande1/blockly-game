import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';

export function defineMazeBlocks() {
  // Move Forward Block
  Blockly.Blocks['maze_moveForward'] = {
    init: function() {
      this.jsonInit({
        "message0": "move forward",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Moves the player forward one space.",
      });
    }
  };

  javascriptGenerator.forBlock['maze_moveForward'] = function(block: any) {
    return 'await moveForward();\n';
  };

  // Turn Block
  Blockly.Blocks['maze_turn'] = {
    init: function() {
      this.jsonInit({
        "message0": "turn %1",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "DIR",
            "options": [
              ["left ↺", "turnLeft"],
              ["right ↻", "turnRight"]
            ]
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Turns the player left or right.",
      });
    }
  };

  javascriptGenerator.forBlock['maze_turn'] = function(block: any) {
    const dir = block.getFieldValue('DIR');
    return 'await ' + dir + '();\n';
  };

  // Forever Block
  Blockly.Blocks['maze_forever'] = {
    init: function() {
      this.jsonInit({
        "message0": "repeat until %1 %2 do %3",
        "args0": [
          {
            "type": "field_image",
            "src": "https://blockly.games/maze/marker.png",
            "width": 15,
            "height": 15,
            "alt": "marker"
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "DO"
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Repeat the enclosed actions until finish point is reached.",
      });
    }
  };

  javascriptGenerator.forBlock['maze_forever'] = function(block: any) {
    let branch = javascriptGenerator.statementToCode(block, 'DO');
    branch = javascriptGenerator.addLoopTrap(branch, block) || branch;
    return 'while (await notDone()) {\n' + branch + '}\n';
  };

  // If Path Block
  Blockly.Blocks['maze_if'] = {
    init: function() {
      this.jsonInit({
        "message0": "if path %1 %2 do %3",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "DIR",
            "options": [
              ["ahead", "isPathForward"],
              ["to the left ↺", "isPathLeft"],
              ["to the right ↻", "isPathRight"]
            ]
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "DO"
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 210,
        "tooltip": "If there is a path in the specified direction, then do some actions.",
      });
    }
  };

  javascriptGenerator.forBlock['maze_if'] = function(block: any) {
    const argument = block.getFieldValue('DIR');
    const branch = javascriptGenerator.statementToCode(block, 'DO');
    return 'if (await ' + argument + '()) {\n' + branch + '}\n';
  };

  // If Else Path Block
  Blockly.Blocks['maze_ifElse'] = {
    init: function() {
      this.jsonInit({
        "message0": "if path %1 %2 do %3 else %4",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "DIR",
            "options": [
              ["ahead", "isPathForward"],
              ["to the left ↺", "isPathLeft"],
              ["to the right ↻", "isPathRight"]
            ]
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "DO"
          },
          {
            "type": "input_statement",
            "name": "ELSE"
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 210,
        "tooltip": "If there is a path in the specified direction, then do the first block of actions. Otherwise, do the second block of actions.",
      });
    }
  };

  javascriptGenerator.forBlock['maze_ifElse'] = function(block: any) {
    const argument = block.getFieldValue('DIR');
    const branch0 = javascriptGenerator.statementToCode(block, 'DO');
    const branch1 = javascriptGenerator.statementToCode(block, 'ELSE');
    return 'if (await ' + argument + '()) {\n' + branch0 + '} else {\n' + branch1 + '}\n';
  };
}
