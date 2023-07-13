import Swal from "sweetalert2";

const DFAorNFA = ({ transitionFunction }) => {
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
  return (
    <div className="text-black w-full border rounded-lg shadow-lg shadow-black-400 px-5 pt-5">
      <div className=" text-md">
        Test if this FA is deterministic or non-deternimistic
      </div>
      <div className="text-sm text-gray-500 my-2">dfa or nfa</div>
      <button
        className="font-semibold my-2 p-2 text-sm border border-gray-400 rounded-lg"
        onClick={(e) => {
          e.preventDefault();
          const type = checkDFAorNFA(transitionFunction);
          Swal.fire({
            title: type,
            text: "Finite Automata Type",
            icon: "success",
            confirmButtonText: "Cool",
              //button color
            confirmButtonColor: "#182c4c",
            });
        }}
      >
        TEST
      </button>
    </div>
  );
};

export default DFAorNFA;