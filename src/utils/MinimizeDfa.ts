// const dfa = {"name":"Kuycheu","type":"dfa","transitions":{"q_prime_0":{"a":["q_prime_0"],"b":["q_prime_1"]},"q_prime_1":{"a":["q_prime_2"],"b":["q_prime_3"]},"q_prime_2":{"a":["q_prime_0"],"b":["q_prime_1"]},"q_prime_3":{"a":["q_prime_4"],"b":["q_prime_3"]},"q_prime_4":{"a":["q_prime_0"],"b":["q_prime_3"]}},"symbols":["a","b"],"state":["q_prime_0","q_prime_1","q_prime_2","q_prime_3","q_prime_4"],"end_states":["q_prime_1","q_prime_3"],"start_state":"q_prime_0"};
const isDev = process.env.NODE_ENV === 'development';

const dfa = {
    "transitions": {
        "q3": {"a": ["q2"]}, 
        "q2": {"a": ["q2"]}, 
        "q0": {"a": ["q1"]}, 
        "q1": {"a": ["q2"],},
    },
    "start_state": "q0",
    "symbols": ["a"],
    "type": "DFA",
    "end_states": ["q2"],
    "name": "Unreachable q3",
    "state": ["q0", "q1", "q2", "q3"]
}
function matrixRepresentation(dfa: any, stateMatrix: any) {
    let colString = '';
    colString += '   ';

    for (const col of dfa.state) {
        colString += col + '   ';
    }

    if (isDev) console.log(colString);

    for (const row of dfa.state) {
        let rowString = '';
        for (const col of dfa.state) {
            rowString += stateMatrix[row][col] ? stateMatrix[row][col] : ' ';
            rowString += '    ';
        }
        if (isDev) console.log(row, rowString);
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

// Function: Get minimized dfa state (Group unmarked states as a new state, Q, states which was marked as 1 will be assign to it corresponding Q state)
function getMinimizedDfaState(dfa: any, stateMatrix: any, minimizedDfaStatePrefix: any) {
    let newStates = {};
    let counter = 0;
    // Get unmarked pairs
    let unmarkedPairs = [];
    for (const row of dfa.state) {
        for (const col of dfa.state) {
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
    const unassignedStates = dfa.state.filter(state => !assignedStates.includes(state));

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

// Function: Get minimized transition function (Take preprocessDfa, newStatePairs, newStates as parameters)
function getMinimizedTransitionFunction(preprocessedDfa: any, newStatePairs: any, newStates: any) {
    let newTransitions = {};

    // Copy transitions from preprocessedDfa
    const preprocessedTransitions = preprocessedDfa.transitions;

    // Mapping old states to new states
    let oldToNewStates = {};
    const oldStates = preprocessedDfa.state;
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
        newTransitions[newState] = findEquivalentTransition(preprocessedDfa, newStatePairs[newState], newState, oldToNewStates);
    }

    return newTransitions;
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

// Function: initial iteration  (Mark all final states as 1, each cell cannot be both final states, ignoring null cells)
function firstIteration(dfa: any, stateMatrix: any) {
    // Mark all final states as 1, ignoring null cells
    for (const row of dfa.state) {
        for (const col of dfa.state) {
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

// Function: consecutive iteration (Mark all cells that are not marked as 1, but can be reached from a cell marked as 1), until no cells can be marked as 1
function consecutiveIteration(dfa: any, stateMatrix: any) {
    // Mark all cells that are not marked as 1, but can be reached from a cell marked as 1
    let isChanged = false;
    for (const row of dfa.state) {
        for (const col of dfa.state) {
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

    return {stateMatrix, isChanged};
}

function checkUnreachableStates(dfa: any): string[] {
    // Array to hold the record of visited states
    let visited = [];

    // Depth First Search (DFS) function
    function DFS(state: string) {
      // Mark state as visited
      visited.push(state);
      
      // For each state that can be reached from current state
      // via any symbol's transition, if that state is not visited yet
      // recursively call DFS for it

      const currentStateTransitions = dfa.transitions[state];
      if (isDev) {
        console.log('currentStateTransitions: ');
        console.log(currentStateTransitions);
      }

      if(currentStateTransitions) {
        for (const symbol of dfa.symbols) {
          if (isDev) {
            console.log('Hello: ');
            console.log(dfa.transitions[state][symbol]);
          }
          const nextState = dfa.transitions[state][symbol];
            if (!visited.includes(nextState)) {
              DFS(nextState);
            }
        }
      }
    }

    // Start DFS from start state
    DFS(dfa.start_state);

    // Get unreachable states
    const unreachableStates = dfa['state'].filter(state => !visited.includes(state));

    return unreachableStates;
}

// Function: Check if array includes an element
function array_includes(array: any, element: any) {
  for (const item of array) {
    if (item === element) {
      return true;
    }

    return false;
  }
}

// Declare removeUnreachableStates function with unreachableStates and dfa parameters
function removeStates(dfa: any, states: string[]) {

    // Remove states from dfa
    for (const state of states) {
        delete dfa.transitions[state];
        dfa.state.splice(dfa.state.indexOf(state), 1);
    }

    return dfa;
}

// Preprocess dfa
function preprocessDfa(dfa: any) {

    let newDfa = (JSON.parse(JSON.stringify(dfa)));
    if (isDev) {
      console.log('Before Preprocess:');
      console.log(dfa.state);
      console.log(dfa);
      console.log(JSON.stringify(dfa));
    }

    // Sort dfa.state
    dfa.state.sort();

    // Convert all transition elements from array to string
    for (const state in dfa.transitions) {
        for (const symbol in dfa.transitions[state]) {
            newDfa.transitions[state][symbol] = dfa.transitions[state][symbol][0];
        }
    }

    // return newDfa;
    return newDfa;
}

// Function: processed dfa
function processedDfa(dfa: any) {
  let newDfa = (JSON.parse(JSON.stringify(dfa)));
  
  // Convert all transition elements from string to array
  for (const state in dfa.transitions) {
    for (const symbol in dfa.transitions[state]) {
      newDfa.transitions[state][symbol] = [dfa.transitions[state][symbol]];
    }
  }

  return newDfa;
}

// Minize Dfa Funtion
function minimizeDfa(dfa: any) {

    const preprocessedDfa = preprocessDfa(dfa);

    const minimizedDfaStatePrefix = 'Q';

    const unreachableStates = checkUnreachableStates(dfa);

    const removedUnreachableStates = removeStates(dfa, unreachableStates);

    // Delcare a new dfa
    let minimizedDfa = {
        name: preprocessedDfa.name,
        type: "dfa",
        transitions: null,
        symbols: preprocessedDfa.symbols,
        state: null,
        end_states: null,
        start_state: null,
        unreachableStates: unreachableStates
    };

    // minimizedDfa's properties
    let minimizedDfaTransitions = {};
    let minimizedDfaState = null;
    let minimizedDfaEndStates = [];
    let minimizedDfaStartState = null;

    // States two by two state matrix, each state pairs should have a null value
    let stateMatrix = {};
    for (const row of preprocessedDfa.state) {
        stateMatrix[row] = {};
        for (const col of preprocessedDfa.state) {
            stateMatrix[row][col] = null;
        }
    }

    for (let i = 0; i < preprocessedDfa.state.length; i++) {
        const row = preprocessedDfa.state[i];
        for (let j = i - 1; j >= 0; j--) {
            const col = preprocessedDfa.state[j];
            stateMatrix[row][col] = '0';
        }
    }

    // First Iteration
    stateMatrix = firstIteration(preprocessedDfa, stateMatrix);

    // Consecutive Iteration
    let isChanged = true;
    while (isChanged) {
        const result = consecutiveIteration(preprocessedDfa, stateMatrix);
        stateMatrix = result.stateMatrix;
        isChanged = result.isChanged;
    }

    // Show state matrix
    matrixRepresentation(preprocessedDfa, stateMatrix);

    // Group states
    const newStatePairs = getMinimizedDfaState(preprocessedDfa, stateMatrix, minimizedDfaStatePrefix);

    // Get minimized dfa states
    minimizedDfaState = Object.keys(newStatePairs);

    // Get minimized dfa transitions
    minimizedDfaTransitions = getMinimizedTransitionFunction(preprocessedDfa, newStatePairs, minimizedDfaState);

    minimizedDfa.transitions = minimizedDfaTransitions;
    minimizedDfa.state = minimizedDfaState;
    minimizedDfa.end_states = minimizedDfaEndStates;
    minimizedDfa.start_state = minimizedDfaStartState;
  // Get Start State
  for (const state in newStatePairs) {
    if (array_includes(newStatePairs[state], preprocessedDfa.start_state)) {
      minimizedDfaStartState = state;
      break;
    }
  }

  // Get End States
  for (const state in newStatePairs) {
    for (const oldEndState of preprocessedDfa.end_states) {
      if (newStatePairs[state].includes(oldEndState)) {
        minimizedDfaEndStates.push(state);
        break;
      }
    }
  }

  minimizedDfa.transitions = minimizedDfaTransitions;
  minimizedDfa.state = minimizedDfaState;
  minimizedDfa.end_states = minimizedDfaEndStates;
  minimizedDfa.start_state = minimizedDfaStartState;

  const processedMinimizedDfa = processedDfa(minimizedDfa);
    
  return processedMinimizedDfa;
}

export default minimizeDfa;
