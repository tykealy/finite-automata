// Function: Check if array includes an element
function array_includes(array: any, element: any) {
    for (const item of array) {
      if (item === element) {
        return true;
      }
  
      return false;
    }
  }

// Function: Remove duplicate elements from array
function removeDuplicateElements(array: any) {
    let uniqueArray = [];
    for (let i = 0; i < array.length; i++) {
      if (!uniqueArray.includes(array[i])) {
        uniqueArray.push(array[i]);
      }
    }
    return uniqueArray;
  }

// Function: Find equivalent transitions (Take preprocessedDfa, statePairs, newState as parameters)
function findEquivalentTransition(preprocessedDfa: any, statePair: any, newState: any, oldToNewStates: any) {
    let newTransitions = {};
  
    // Get transitions from preprocessedDfa
    const preprocessedTransitions = preprocessedDfa.transitions;
  
    // Get new transitions
    for (const symbol of preprocessedDfa.symbols) {
      const oldState = statePair[0];
      const oldNextState = preprocessedTransitions[oldState][symbol];
      const newNextState = oldToNewStates[oldNextState];
      newTransitions[symbol] = newNextState;
    }
  
    return newTransitions;
  }

/**
 * 
 * @param dfa 
 * @description This function will return the unreachable states of the given dfa
 * @returns 
 */
function checkUnreachableStates(dfa: any): string[] {
    // Array to hold the record of visited states
    let visited = [];
  
    // Depth First Search (DFS) function
    function DFS(state: any) {
        visited.push(state);
        for (const symbol of dfa.symbols) {
          const nextStates = dfa.transitions[state][symbol];
          for (const nextState of nextStates) {
            if (!visited.includes(nextState)) {
              DFS(nextState);
            }
          }
        }
      }
      
  
    // Start DFS from start state
    DFS(dfa.start_state);

    // Add start state to visited, if it is not in visited
    if(!visited.includes(dfa.start_state)) {
        visited.push(dfa.start_state);
    }

    console.log(visited);
  
    // Get unreachable states
    const unreachableStates = dfa['states'].filter(state => !visited.includes(state));
  
    return unreachableStates;
}

/**
 * 
 * @param dfa 
 * @param states 
 * @description This function will remove the given states from the given dfa
 * @returns 
 */
function removeStates(dfa: any, states: string[]) {

    const newDfa = JSON.parse(JSON.stringify(dfa));

    // Remove states from dfa
    for (const state of states) {
        delete newDfa.transitions[state];
        newDfa.states.splice(newDfa.states.indexOf(state), 1);
    }

    return newDfa;
}

/**
 * 
 * @param dfa 
 * @param stateMatrix 
 * @description This function will print the state matrix
 */
function matrixRepresentation(dfa: any, stateMatrix: any) {
    let colString = '';
    colString += '   ';
  
    for (const col of dfa.states) {
      colString += col + '   ';
    }
  
    console.log(colString);
  
    for (const row of dfa.states) {
      let rowString = '';
      for (const col of dfa.states) {
        rowString += stateMatrix[row][col] ? stateMatrix[row][col] : ' ';
        rowString += '    ';
      }
      console.log(row, rowString);
    }
  }

/**
 * 
 * @param dfa 
 * @param stateMatrix 
 * @description This function will mark all final states as 1, each cell cannot be both final states, ignoring null cells
 * @returns 
 */
function firstIteration(dfa: any, stateMatrix: any) {
    // Mark all final states as 1, ignoring null cells
    for (const row of dfa.states) {
      for (const col of dfa.states) {
        // If null cells, continue
        if (!stateMatrix[row][col]) {
          continue;
        }
  
        // XOR condition, one of the states is final state, but not both of them
        if (dfa.end_states.includes(row) && !dfa.end_states.includes(col)) {
          stateMatrix[row][col] = '1';
        } else if (!dfa.end_states.includes(row) && dfa.end_states.includes(col)) {
          stateMatrix[row][col] = '1';
        }
      }
    }
  
    return stateMatrix;
  }

/**
 * 
 * @param dfa 
 * @param stateMatrix 
 * @description This function will mark all cells that are not marked as 1, but can be reached from a cell marked as 1, until no cells can be marked as 1
 * @returns 
 */
function consecutiveIteration(dfa: any, stateMatrix: any) {
    // Mark all cells that are not marked as 1, but can be reached from a cell marked as 1
    let isChanged = false;
    for (const row of dfa.states) {
      for (const col of dfa.states) {
        // If null cells, continue
        if (!stateMatrix[row][col]) {
          continue;
        }
  
        // If cell is not marked as 1, but can be reached from a cell marked as 1
        if (stateMatrix[row][col] !== '1') {
          for (const symbol of dfa.symbols) {
            const rowNextState = dfa.transitions[row][symbol];
            const colNextState = dfa.transitions[col][symbol];
              if (stateMatrix[rowNextState][colNextState] === '1') {
                stateMatrix[row][col] = '1';
                isChanged = true;
                break;
              }
          }
        }
      }
    }
  
    return { stateMatrix, isChanged };
  }

/**
 * 
 * @param preprocessedDfa 
 * @param newStatePairs 
 * @param newStates 
 * @description This function will return the minimized transition function
 * @returns 
 */
function getMinimizedTransitionFunction(dfa: any, newStatePairs: any, newStates: any) {
    let newTransitions = {};
  
    // Copy transitions from preprocessedDfa
    const preprocessedTransitions = dfa.transitions;
  
    // Mapping old states to new states
    let oldToNewStates = {};
    const oldStates = dfa.states;
    for (const oldState of oldStates) {
      for (const newState in newStates) {
        const currentNewState = newStates[newState];
        if (newStatePairs[currentNewState].includes(oldState)) {
          oldToNewStates[oldState] = currentNewState;
          break;
        }
      }
    }
  
    // Get new transitions
    for (const newState of newStates) {
      newTransitions[newState] = findEquivalentTransition(dfa, newStatePairs[newState], newState, oldToNewStates);
    }
  
    return newTransitions;
  }

/**
 * 
 * @param dfa 
 * @param stateMatrix 
 * @param minimizedDfaStatePrefix 
 * @description This function will group unmarked states as a new state, Q_PRIME_, states which was marked as 1 will be assign to it corresponding Q_PRIME_ state
 * @returns 
 */
function getMinimizedDfaState(dfa: any, stateMatrix: any, minimizedDfaStatePrefix: any) {
    let newStates = {};
    let counter = 0;
    // Get unmarked pairs
    let unmarkedPairs = [];
    for (const row of dfa.states) {
      for (const col of dfa.states) {
        if (stateMatrix[row][col] === '0') {
          unmarkedPairs.push([row, col].sort());
        }
      }
    }
  
    // Remove duplicate states
    unmarkedPairs = removeDuplicateElements(unmarkedPairs);
  
    // Get assigned states from unmarked pairs as array of states
    let assignedStates = [];
    for (const pair of unmarkedPairs) {
      for (const state of pair) {
        assignedStates.push(state);
      }
    }
  
    // Get unassigned states
    const unassignedStates = dfa.states.filter(state => !assignedStates.includes(state));
  
    // New State Pairs
    const newStatePairs = [];
    for (const unmarkedPair of unmarkedPairs) {
      newStatePairs.push(unmarkedPair);
    }
  
    // Add unassigned states to new states
    for (const state of unassignedStates) {
      newStatePairs.push([state]);
    }
  
    newStatePairs.sort();
    
    // New States
    counter = 0;
    for (const pair of newStatePairs) {
      const newState = minimizedDfaStatePrefix + counter;
      newStates[newState] = pair;
      counter++;
    }
  
    return newStates;
  }

/**
 * 
 * @param dfa e.g. {"type":"dfa","transitions":{"Q0":{"0":["Q1"],"1":["Q2"]},"Q1":{"0":["Q3"],"1":["Q2"]},"Q2":{"0":["Q2"],"1":["Q2"]},"Q3":{"0":["Q2"],"1":["Q4"]},"Q4":{"0":["Q4"],"1":["Q4"]}},"symbols":["0","1"],"states":["Q0","Q1","Q2","Q3","Q4"],"end_states":["Q4"],"start_state":"Q0"}
 * @description This function will return the minimized dfa
 * @returns e.g. 
 */
function minimizeDfa(dfa: any){

    const minimizedDfaStatePrefix = 'Q_PRIME_';
    const unreachableStates = checkUnreachableStates(dfa);

    const removedUnreachableStates = removeStates(dfa, unreachableStates);

    const minimizedDfa = {
        name: removedUnreachableStates.name,
        type: "dfa",
        transitions: null,
        symbols: removedUnreachableStates.symbols,
        states: null,
        end_states: null,
        start_state: null,
        unreachableStates: unreachableStates,
        new_states_map_old_states: null
    };

    // minimizedDfa's properties
    let minimizedDfaTransitions = {};
    let minimizedDfaState = null;
    let minimizedDfaEndStates = [];
    let minimizedDfaStartState = null;

    // States two by two state matrix, each state pairs should have a null value
    let stateMatrix = {};
    for (const row of removedUnreachableStates.states) {
        stateMatrix[row] = {};
        for (const col of removedUnreachableStates.states) {
            stateMatrix[row][col] = null;
        }
    }

    for (let i = 0; i < removedUnreachableStates.states.length; i++) {
        const row = removedUnreachableStates.states[i];
        for (let j = i - 1; j >= 0; j--) {
          const col = removedUnreachableStates.states[j];
          stateMatrix[row][col] = '0';
        }
      }

    // First Iteration
    stateMatrix = firstIteration(removedUnreachableStates, stateMatrix);

    // Console log state matrix
    console.log('State matrix');
    console.log(stateMatrix);

    // Show state matrix
    matrixRepresentation(removedUnreachableStates, stateMatrix);

    // Consecutive Iteration
    let isChanged = true;
    while (isChanged) {
        const result = consecutiveIteration(removedUnreachableStates, stateMatrix);
        stateMatrix = result.stateMatrix;
        isChanged = result.isChanged;
    }

    // Show state matrix
    matrixRepresentation(removedUnreachableStates, stateMatrix);

    // Group states
    const newStatePairs = getMinimizedDfaState(removedUnreachableStates, stateMatrix, minimizedDfaStatePrefix);
    console.log(newStatePairs);

    // Get minimized dfa states
    minimizedDfaState = Object.keys(newStatePairs);

    // Get minimized dfa transitions
    minimizedDfaTransitions = getMinimizedTransitionFunction(removedUnreachableStates, newStatePairs, minimizedDfaState);

    // Get Start State
    for (const state in newStatePairs) {
        if (array_includes(newStatePairs[state], removedUnreachableStates.start_state)) {
        minimizedDfaStartState = state;
        break;
        }
    }

    // Get End States
    for (const state in newStatePairs) {
        for (const oldEndState of removedUnreachableStates.end_states) {
        if (newStatePairs[state].includes(oldEndState)) {
            minimizedDfaEndStates.push(state);
            break;
        }
        }
    }

    console.log(JSON.stringify(removedUnreachableStates));

    // Assign minimized dfa property values to minimizedDfa
    minimizedDfa.transitions = minimizedDfaTransitions;
    minimizedDfa.states = minimizedDfaState;
    minimizedDfa.end_states = minimizedDfaEndStates;
    minimizedDfa.start_state = minimizedDfaStartState;
    minimizedDfa.new_states_map_old_states = newStatePairs;

    return minimizedDfa;
}

// Export minimizeDfa function
export { minimizeDfa };