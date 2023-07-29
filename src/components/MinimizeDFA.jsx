import showDfa from "@/utils/MinimizeDfa-v2";
import minimizeDfaV3 from "@/utils/MinimizeDfaV3";
import checkDFAorNFA from "@/utils/CheckDFAorNFA";
import { instance } from "@viz-js/viz";
import React from "react";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import Swal from "sweetalert2";
const MinimizeDFA = ({
  fa,
  transitions,
  start_state,
  end_states,
  symbols,
  states,
}) => {
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState("");
  const [minimizedDfa, setMinimizedDfa] = React.useState({});
  const grapRef = React.useRef();

  function transitionsToDotScript(transitions, start, end) {
    console.log("Transition:");
    console.log(transitions);
    let dotScript = "digraph { rankdir=LR;\n";
    // Create nodes
    dotScript += `    start [shape = "point", label="start"]\n`;
    for (const node in transitions) {
      if (end.indexOf(node) != -1) {
        dotScript += `    ${node} [shape = doublecircle, label="${node}"]\n`;
      } else {
        dotScript += `    ${node} [shape = circle, abel="${node}"]\n`;
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
    <div className="text-black w-full border rounded-lg shadow-lg shadow-black-400 px-5 pt-5">
      <div className=" text-md">Minimize DFA</div>
      <div className="text-sm text-gray-500 my-2">
        Reduce states from a given DFA
      </div>
      <button
        className="font-semibold my-2 p-2 text-sm border border-gray-400 rounded-lg"
        onClick={(e) => {
          e.preventDefault();
          const type = checkDFAorNFA(transitions);
          if (type == "NFA") {
            Swal.fire({
              icon: "error",
              title: "Oops... This isn't DFA!",
            });
          } else {
            console.log(showDfa);
          }
          try {
            if (type === "DFA") {
              console.log("minimized dfa: ");
              console.log(
                JSON.stringify({
                  transitions,
                  start_state,
                  end_states,
                  symbols,
                  states,
                })
              );

              const minimizedDfa = minimizeDfaV3({
                transitions,
                start_state,
                end_states,
                symbols,
                states,
              });

              setMinimizedDfa(minimizedDfa);

              const transitionsDot = transitionsToDotScript(
                minimizedDfa.transitions,
                minimizedDfa.start_state,
                minimizedDfa.end_states
              );
              instance().then((viz) => {
                grapRef.current?.appendChild(
                  viz.renderSVGElement(transitionsDot)
                );
              });
              setOpen(true);
            }
          } catch (err) {
            console.log(err);
            alert(
              "Make sure you have filled all the fields correctly! All States should have valid transitions!"
            );
          }
        }}
      >
        Minimize
      </button>
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
        <DialogHeader>Minimized DFA</DialogHeader>
        <DialogBody
          divider
          className="h-[25rem] md:h-[30rem] lg:h-[33rem] xl:h-[37rem]  overflow-scroll"
        >
          <div className="">
            <div>{`States: { ${minimizedDfa.states}}`}</div>
            <div>{`Symbols: { ${minimizedDfa.symbols} }`}</div>
            <div>{`Finale State: { ${minimizedDfa.end_states} }`}</div>
            <div>{`Equivalent states: { ${JSON.stringify(
              minimizedDfa.new_states_map_old_states
            )} }`}</div>
            <div>{`Unreachable states: { ${JSON.stringify(
              minimizedDfa.unreachableStates
            )} }`}</div>
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
                    {minimizedDfa?.symbols?.map((symbol, index) => {
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
                  {minimizedDfa?.states?.map((state, index) => {
                    return (
                      <tr
                        key={index}
                        className="border border-slate-300 w-full text-center"
                      >
                        <td className="border border-slate-300 w-44 p-3 text-black">
                          {state}
                        </td>
                        {minimizedDfa?.symbols?.map((symbol, index) => {
                          return (
                            <td
                              key={index}
                              className="border border-slate-300 w-44 p-3"
                            >
                              {minimizedDfa?.transitions?.[state]?.[
                                symbol
                              ]?.join(",")}
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

export default MinimizeDFA;
