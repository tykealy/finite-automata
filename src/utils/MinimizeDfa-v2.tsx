const unMiniDfa = {
    states: ["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7"],
    symbols: ["a", "b"],
    start_state: "q0",
    end_states: ["q2"],
    transitions: {
        q0: {
            a: "q5",
            b: "q1",
        },
        q1: {
            a: "q2",
            b: "q6",
        },
        q2: {
            a: "q2",
            b: "q0",
        },
        q3: {
            a: "q6",
            b: "q2",
        },
        q4: {
            a: "q5",
            b: "q7",
        },
        q5: {
            a: "q6",
            b: "q2",
        },
        q6: {
            a: "q4",
            b: "q6",
        },
        q7: {
            a: "q2",
            b: "q6",
        },
    },
}

const unMiniDfa2 = {
    states: ["q0", "q1", "q2", "q3"],
    symbols: ["a", "b"],
    start_state: "q0",
    end_states: ["q2"],
    transitions: {
        q0: {
            a: "q1",
            b: "q3",
        },
        q1: {
            a: "q2",
            b: "q0",
        },
        q2: {
            a: "q2",
            b: "q0",
        },
        q3: {
            a: "q2",
            b: "q3",
        },
    },
}

// remove unreachable states using typescript
const removeUnreachableStates = (dfa) => {
    const reachableStates = [dfa.start_state];
    const queue = [dfa.start_state];

    while (queue.length > 0) {
        const current_state = queue.shift();
        const transitions = dfa.transitions[current_state];

        for (const symbol in transitions) {
            const next_state = transitions[symbol];

            if (!reachableStates.includes(next_state)) {
                reachableStates.push(next_state);
                queue.push(next_state);
            }
        }
    }

    const newStates = dfa.states.filter((state) => reachableStates.includes(state));
    const newTransitions = {};

    for (const state in dfa.transitions) {
        if (reachableStates.includes(state)) {
            newTransitions[state] = dfa.transitions[state];
        }
    }

    return {
        ...dfa,
        states: newStates,
        transitions: newTransitions,
    };
}

//divide final and non-final dfa along with start, end states, transitions and return with 2 object of final and non-final dfa with typescript
const divideFinalAndNonFinalStates = (dfa) => {
    const finalStates = [];
    const nonFinalStates = [];

    for (const state of dfa.states) {
        if (dfa.end_states.includes(state)) {
            finalStates.push(state);
        } else {
            nonFinalStates.push(state);
        }
    }

    const finalDfa = {
        states: finalStates,
        symbols: dfa.symbols,
        start_state: dfa.start_state,
        end_states: dfa.end_states,
        transitions: {},
    };

    const nonFinalDfa = {
        states: nonFinalStates,
        symbols: dfa.symbols,
        start_state: dfa.start_state,
        end_states: dfa.end_states,
        transitions: {},
    };

    for (const state in dfa.transitions) {
        if (finalStates.includes(state)) {
            finalDfa.transitions[state] = dfa.transitions[state];
        } else {
            nonFinalDfa.transitions[state] = dfa.transitions[state];
        }
    }

    return {
        finalDfa,
        nonFinalDfa,
    };
}

//take only 1 state if there are same transition states and return with 1 object of dfa with typescript
function removeSameTransitionStates(dfa) {
    let replaceState = false;
    let hasSameState = false;

    let { states, transitions } = dfa;

    let newStates = [];
    let newTransitions = {};

    // Union-Find data structure to group states with equivalent transitions
    const parent = {};
    const find = (state) => {
        if (parent[state] === undefined) {
            parent[state] = state;
        }
        if (parent[state] !== state) {
            parent[state] = find(parent[state]);
        }
        return parent[state];
    };
    const union = (stateA, stateB) => {
        parent[find(stateB)] = find(stateA); // Fix: Update parent of stateB to point to stateA
    };

    if (states.length > 1) {
        do {
            replaceState = false;

            for (let i = 0; i < states.length; i++) {
                let stateA = states[i];
                for (let j = i + 1; j < states.length; j++) {
                    let stateB = states[j];

                    if (find(stateA) === find(stateB)) continue;

                    const transitionsA = JSON.stringify(transitions[stateA]);
                    const transitionsB = JSON.stringify(transitions[stateB]);

                    // console.log(i, j, stateA, stateB);
                    // console.log(transitionsA, transitionsB);
                    // console.log(transitionsA === transitionsB);

                    if (transitionsA === transitionsB) {
                        union(stateA, stateB);

                        // delete transitions[states[j]];
                        // delete states[j];

                        states = states.flat()

                        // console.log(states);

                        hasSameState = true;
                    }
                }
            }

            if (hasSameState) {
                // Gather the representative states (one state from each group)
                const representativeStates = new Set();

                for (const state of states) {
                    representativeStates.add(find(state));
                }

                newStates = Array.from(representativeStates);
                newTransitions = {};

                for (const state of newStates) {
                    newTransitions[state] = {};

                    for (const input in transitions[state]) {
                        const destination = transitions[state][input];

                        transitions[state][input] = find(destination);
                        newTransitions[state][input] = find(destination);
                    }
                }

                replaceState = true;
            }

            hasSameState = false;
        } while (replaceState);
    } else {
        newStates = states;
        newTransitions = transitions;
    }

    return {
        ...dfa,
        states: newStates,
        transitions: newTransitions,
    };
}



//combine final and non-final dfa and return with 1 object of dfa with typescript
function combineFinalAndNonFinalStates(finalDfa, nonFinalDfa) {
    const newStates = [...finalDfa.states, ...nonFinalDfa.states];
    const newTransitions = {
        ...finalDfa.transitions,
        ...nonFinalDfa.transitions,
    };

    return {
        states: newStates,
        transitions: newTransitions,
        end_states: finalDfa.states,
        start_state: nonFinalDfa.start_state,
        symbols: nonFinalDfa.symbols,
    };
}

function minimizeDfa(dfa) {
    const {finalDfa, nonFinalDfa} = divideFinalAndNonFinalStates(removeUnreachableStates(dfa));


    console.log("before remove")
    console.log(finalDfa);
    console.log(nonFinalDfa);

    console.log("after remove")
    console.log(removeSameTransitionStates(finalDfa));
    console.log(removeSameTransitionStates(nonFinalDfa));

    return combineFinalAndNonFinalStates(removeSameTransitionStates(finalDfa), removeSameTransitionStates(nonFinalDfa));
}


function showDfa(dfa) {
    return minimizeDfa(dfa);
}

export default showDfa(unMiniDfa2);
