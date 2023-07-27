// delcare dfa prefix
const dfa_prefix = "q_prime_";
// delcare epsilon close symbol
const epsilon = "ε";

function arrayExistsAsObjectValue(targetObject: any, arrayParam: any) {
    const sortedArrayParam = JSON.stringify(arrayParam.sort());

    for (const key in targetObject) {
        const value = targetObject[key];
        if (Array.isArray(value)) {
            value.sort();
            if (JSON.stringify(value) === sortedArrayParam) {
                return key;
            }
        }
    }

    return null;
}

/**
 * @param array e.g. [1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10]
 * @description This function will return an array without duplicates
 * @returns e.g. [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 */
function removeDuplicates(array: any): any {
    let tmpArray = [];
    array.forEach((element: any) => {
        if (!tmpArray.includes(element)) {
            tmpArray.push(element);
        }
    });
    return tmpArray;
}

/**
 * @param fa e.g. {"type":"","transitions":{"q2":{"a":["q1"],"ε":[],"b":["q0"]},"q1":{"b":[],"ε":["q2"],"a":["q1"]},"q0":{"b":["q0"],"ε":["q1"],"a":[]}},"symbols":["a","b","ε"],"start_state":"q0","name":"q0q1q2 Valid ","end_states":["q2"],"state":["q0","q1","q2"]}
 * @param state e.g. q0
 * @description This function will return the epsilon closure of a state, if there is no epsilon transition, it will return the original state
 * @returns e.g. [ 'q0', 'q1', 'q2' ]
 */
function epsilon_closure(fa: any, state: any): any {
    let epsilonClosure = [];

    // Search for epsilon transitions from the state
    for (const symbol in fa.transitions[state]) {
        if (symbol === epsilon) {
            // Add the destination state to the closure
            epsilonClosure.push(...fa.transitions[state][symbol]);
        }
    }

    // Add the original state to the closure
    epsilonClosure.push(state);

    if(epsilonClosure.length > 0) {
        // Remove duplicates
        epsilonClosure = removeDuplicates(epsilonClosure);
        return epsilonClosure;
    } else {
        // return the original state, if there is no epsilon transition
        return [state];
    }
}

/**
 * @param fa e.g. {"type":"","transitions":{"q2":{"a":["q1"],"ε":[],"b":["q0"]},"q1":{"b":[],"ε":["q2"],"a":["q1"]},"q0":{"b":["q0"],"ε":["q1"],"a":[]}},"symbols":["a","b","ε"],"start_state":"q0","name":"q0q1q2 Valid ","end_states":["q2"],"state":["q0","q1","q2"]}
 * @param state e.g. 'q0'
 * @param symbol e.g. 'a'
 * @returns e.g. ['q1', 'q2']
 */
function transition_function(fa: any, state: any, symbol: any): any {
    let transitions = [];

    const destinationStates = fa.transitions[state][symbol];

    // Loop through the destination states
    for (const destinationState of destinationStates) {
        // Get the epsilon closure of the destination state
        const epsilonClosure = epsilon_closure(fa, destinationState);
        // Add the epsilon closure to the transitions
        transitions.push(...epsilonClosure);
    }

    // Remove duplicates
    transitions = removeDuplicates(transitions);

    return transitions;
}

/**
 * 
 * @param fa e.g. {"type":"","transitions":{"q2":{"a":["q1"],"ε":[],"b":["q0"]},"q1":{"b":[],"ε":["q2"],"a":["q1"]},"q0":{"b":["q0"],"ε":["q1"],"a":[]}},"symbols":["a","b","ε"],"start_state":"q0","name":"q0q1q2 Valid ","end_states":["q2"],"state":["q0","q1","q2"]}
 * @returns e.g. {"name":"q0q1q2 Valid ","type":"dfa","transitions":{"q_prime_0":{"a":["q_prime_1"],"b":["q_prime_0"]},"q_prime_1":{"a":["q_prime_1"],"b":["q_prime_0"]},"q_prime_2":{"a":["q_prime_1"],"b":["q_prime_0"]}},"symbols":["a","b"],"state":["q_prime_0","q_prime_1","q_prime_2"],"end_states":["q_prime_2"],"start_state":"q_prime_0"}
 */
function nfaToDfa(fa: any): any {

    let endOfDfa = false;

    let dfa_state_count = 0;
    
    const dfa = {
        name: fa.name,
        type: "dfa",
        transitions: null,
        symbols: null,
        state: null,
        end_states: null,
        start_state: null
    };

    let dfaNfaRelation = {}; // dfaNfaRelation is a dictionary that holds the relation between the dfa states and the nfa states
    let dfaTransitions = {};
    let dfaSymbols = fa.symbols;
    let dfaStates = [];
    let dfaEndStates = [];
    let visitedRelationStates = [];

    // Initialize the dfa with the start state
    const dfaStartState = dfa_prefix + dfa_state_count;

    dfaStates.push(dfaStartState);
    dfaNfaRelation[dfaStartState] = epsilon_closure(fa, fa.start_state);
        
    dfa_state_count++;

    let test = 0;

    // Loop through the dfa states
    do {
        // Declare temporary dfaNfaRelation to be a deep copy of the dfaNfaRelation
        const tmpDfaNfaRelation = JSON.parse(JSON.stringify(dfaNfaRelation));

        // Do transitions on the dfaNfaRelation
        for (const relation in tmpDfaNfaRelation) {
            // Check if the relation has been visited
            if (!visitedRelationStates.includes(relation)) {
                const relationStates = tmpDfaNfaRelation[relation];
                // Add the relation to the visited list
                visitedRelationStates.push(relation);
                // Loop through the symbols excluding epsilon
                const withoutEpsilon = dfaSymbols.filter((symbol: any) => symbol !== epsilon);
                // Loop through the relation states
                for (const symbol of withoutEpsilon) {

                    let result = [];

                    for (const relationState of relationStates) {
                        result.push(...transition_function(fa, relationState, symbol));
                    }

                    // Remove duplicates from the result
                    result = removeDuplicates(result);

                    // if value return from transition_function is already in dfaNfaRelation
                    const relationExists = arrayExistsAsObjectValue(dfaNfaRelation, result);
                    if (relationExists !== null) {
                        // Add a new transition to the dfaTransitions
                        if (dfaTransitions[relation] === undefined) {
                            dfaTransitions[relation] = {};
                        }
                        if (dfaTransitions[relation][symbol] === undefined) {
                            dfaTransitions[relation][symbol] = [];
                        }
                        dfaTransitions[relation][symbol].push(relationExists);
                        continue;
                    }

                    // Add a new relation to the dfaNfaRelation
                    const nextDfaState = dfa_prefix + dfa_state_count;
                    dfa_state_count++;
                    dfaNfaRelation[nextDfaState] = result;

                    // Add a new state to the dfaStates
                    dfaStates.push(nextDfaState);

                    // Add a new transition to the dfaTransitions
                    if (dfaTransitions[relation] === undefined) {
                        dfaTransitions[relation] = {};
                    }
                    if (dfaTransitions[relation][symbol] === undefined) {
                        dfaTransitions[relation][symbol] = [];
                    }
                    dfaTransitions[relation][symbol].push(nextDfaState);

                }
            }
        }

        // Check if the all dfaNfaRelation states have been visited
        if (visitedRelationStates.length === Object.keys(dfaNfaRelation).length) {
            endOfDfa = true;
        }

    } while (!endOfDfa);

    // Search for end states
    for (const relation in dfaNfaRelation) {
        const relationStates = dfaNfaRelation[relation];
        for (const relationState of relationStates) {
            if (fa.end_states.includes(relationState)) {
                dfaEndStates.push(relation);
                break;
            }
        }
    }

    dfa.state = dfaStates;
    dfa.symbols = dfaSymbols;
    dfa.transitions = dfaTransitions;
    dfa.end_states = dfaEndStates;
    dfa.start_state = dfaStartState;

    // dfa.nfa_relation = dfaNfaRelation;

    return dfa;
}

// export the function
export default nfaToDfa;