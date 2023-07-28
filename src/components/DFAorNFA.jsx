"use client";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import React from "react";
import checkDFAorNFA from "@/utils/CheckDFAorNFA";
import cleanTransitions from "@/utils/CleanTransitions";
import { instance } from "@viz-js/viz";
const DFAorNFA = ({
  transitions,
  start_state,
  end_states,
  states,
  symbols,
}) => {
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState("");
  const [cleanedTransitions, setCleanedTransitions] = React.useState({});
  const grapRef = React.useRef();

  function transitionsToDotScript(transitions, start, end) {
    let dotScript = "digraph { rankdir=LR;\n";
    // Create nodes
    dotScript += `    start [shape = "point", label="start"]\n`;
    for (const node in transitions) {
      if (end.indexOf(node) != -1) {
        dotScript += `    ${node} [shape = doublecircle, label="${node}"]\n`;
      } else {
        dotScript += `    ${node} [shape = circle, label="${node}"]\n`;
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
    return dotScript;
  }

  return (
    <div>
      <div className="text-black w-full border rounded-lg shadow-lg shadow-black-400 px-5 pt-5">
        <div className=" text-md">
          Test if this FA is deterministic or non-deternimistic
        </div>
        <div className="text-sm text-gray-500 my-2">dfa or nfa</div>
        <button
          className="font-semibold my-2 p-2 text-sm border border-gray-400 rounded-lg"
          onClick={(e) => {
            e.preventDefault();
            const cleanedT = cleanTransitions(transitions, states, symbols);
            setCleanedTransitions(cleanedT);
            setType(checkDFAorNFA(cleanedT));
            const transitionsDot = transitionsToDotScript(
              cleanedT,
              start_state,
              end_states
            );
            instance().then((viz) => {
              grapRef.current?.appendChild(
                viz.renderSVGElement(transitionsDot)
              );
            });
            setOpen(true);
          }}
        >
          TEST
        </button>
      </div>
      <Dialog
        open={open}
        handler={() => {
          setOpen(!open);
        }}
        className="p-2"
        size="lg"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>This is {type}</DialogHeader>
        <DialogBody
          divider
          className="h-[25rem] md:h-[30rem] lg:h-[33rem] xl:h-[37rem]  overflow-scroll"
        >
          <div>
            <div>{`States: { ${states} }`}</div>
            <div>{`Symbols: { ${symbols} }`}</div>
            <div>{`Finale State: { ${end_states} }`}</div>
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
                    {symbols?.map((symbol, index) => {
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
                  {states?.map((state, index) => {
                    return (
                      <tr
                        key={index}
                        className="border border-slate-300 w-full text-center"
                      >
                        <td className="border border-slate-300 w-44 p-3 text-black">
                          {state}
                        </td>
                        {symbols?.map((symbol, index) => {
                          return (
                            <td
                              key={index}
                              className="border border-slate-300 w-44 p-3"
                            >
                              {cleanedTransitions?.[state]?.[symbol]?.join(",")}
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
      </Dialog>
    </div>
  );
};

export default DFAorNFA;
