"use client";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import React from "react";
import { instance } from "@viz-js/viz";
const DFAorNFA = ({ transitionFunction, fa }) => {
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState();
  const grapRef = React.useRef();
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

  function transitionsToDotScript(transitions, start, end) {
    let dotScript = "digraph { rankdir=LR;\n";
    // Create nodes
    dotScript += `    start [shape = "point", label="start"]\n`;
    for (const node in transitions) {
      if (end.indexOf(node) != -1) {
        dotScript += `    ${node} [shape = doublecircle, label="${node}"]\n`;
      } else {
        dotScript += `    ${node} [label="${node}"]\n`;
      }
    }

    dotScript += `    start -> ${start}\n`;
    // Create edges
    for (const node in transitions) {
      const transitionsObj = transitions[node];

      for (const transitionLabel in transitionsObj) {
        const targetNodes = transitionsObj[transitionLabel];

        targetNodes.forEach((targetNode) => {
          dotScript += `    ${node} -> ${targetNode} [label="${transitionLabel}"]\n`;
        });
      }
    }

    dotScript += "}";
    console.log(dotScript);
    return dotScript;
  }

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
          setType(checkDFAorNFA(transitionFunction));
          const transitionsDot = transitionsToDotScript(
            transitionFunction,
            fa.start_state,
            fa.end_states
          );
          instance().then((viz) => {
            grapRef.current?.appendChild(viz.renderSVGElement(transitionsDot));
          });
          setOpen(true);
        }}
      >
        TEST
      </button>
      <Dialog
        open={open}
        handler={() => {
          setOpen(!open);
        }}
        className="p-3"
        size="lg"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>This is {type}</DialogHeader>
        <DialogBody divider className="h-[40rem] overflow-scroll">
          <div className="">
            <div>{`States: { ${fa?.state} }`}</div>
            <div>{`Symbols: { ${fa?.symbols} }`}</div>
            <div>{`Finale State: { ${fa?.end_states} }`}</div>
            <div
              ref={grapRef}
              className="my-10"
              style={{ display: "flex", justifyContent: "center" }}
            ></div>
            <div className="border border-slate-300 w-full overflow-auto">
              <table className="w-full table-fixed border border-collaps">
                <thead>
                  <tr className="text-center">
                    <th className="border border-slate-300 md:w-44 w-36 p-2 text-black">
                      Transitions
                    </th>
                    {fa?.symbols?.map((symbol, index) => {
                      return (
                        <td
                          key={index}
                          className=" w-44 border border-slate-300 text-black"
                        >
                          {symbol}
                        </td>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {fa?.state?.map((state, index) => {
                    return (
                      <tr
                        key={index}
                        className="border border-slate-300 w-full text-center"
                      >
                        <td className="border border-slate-300 w-44 p-3 text-black">
                          {state}
                        </td>
                        {fa?.symbols.map((symbol, index) => {
                          return (
                            <td
                              key={index}
                              className="border border-slate-300 w-44 p-3"
                            >
                              {fa?.transitions?.[state]?.[symbol].join(",")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="outlined"
            color="red"
            onClick={() => {
              setOpen(false);
            }}
          >
            close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default DFAorNFA;
