const checkDFAorNFA = (transitionFunction) => {
  // Iterate over each state in the transition function
  for (const state in transitionFunction) {
    // Iterate over each input symbol for the current state
    for (const symbol in transitionFunction[state]) {
      const nextStates = transitionFunction[state][symbol];

      // Check if there are multiple possible next states
      if (nextStates.length > 1) {
        return "NFA";
      }

      // Check if there is a missing transition for any state and input symbol combination
      if (!nextStates.length) {
        return "NFA";
      }

      // Check if there are epsilon transitions (transitions without consuming an input symbol)
      if (symbol === "ε") {
        return "NFA";
      }
    }
  }

  return "DFA";
};

export default checkDFAorNFA;
