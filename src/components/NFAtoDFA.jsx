"use client";
import nfaToDfa from "@/utils/NfaToDfa";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import { Fragment } from "react";
import checkDFAorNFA from "@/utils/CheckDFAorNFA";
import { instance } from "@viz-js/viz";
import React from "react";
import Swal from "sweetalert2";
const NFAtoDFA = ({
  transitions,
  start_state,
  end_states,
  symbols,
  states,
}) => {
  function transitionsToDotScript(transitions, start, end) {
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
  const grapRef = React.useRef();
  const [open, setOpen] = React.useState(false);
  const [convertedFA, setConvertedFA] = React.useState({});

  return (
    <Fragment>
      <div className="text-black w-full border rounded-lg shadow-lg shadow-black-400 px-5 pt-5">
        <div className=" text-md">NFA to DFA</div>
        <div className="text-sm text-gray-500 my-2">
          Construct an equivalent DFA from an NFA
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            const type = checkDFAorNFA(transitions);
            if (type == "DFA") {
              Swal.fire({
                icon: "error",
                title: "Oops... This isn't NFA!",
              });
              return;
            }
            const dfa = nfaToDfa({
              transitions,
              start_state,
              end_states,
              symbols,
              states,
            });
            setConvertedFA(dfa);
            const transitionsDot = transitionsToDotScript(
              dfa.transitions,
              dfa.start_state,
              dfa.end_states
            );
            instance().then((viz) => {
              grapRef.current?.appendChild(
                viz.renderSVGElement(transitionsDot)
              );
            });
            setOpen(true);
          }}
          className="font-semibold my-2 p-2 text-sm border border-gray-400 rounded-lg"
        >
          Convert
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
          <DialogHeader>Convert NFA to DFA</DialogHeader>
          <DialogBody
            divider
            className="h-[25rem] md:h-[30rem] lg:h-[33rem] xl:h-[37rem]  overflow-scroll"
          >
            <div className="">
              <div>{`States: { ${convertedFA.states}}`}</div>
              <div>{`Symbols: { ${convertedFA.symbols} }`}</div>
              <div>{`Finale State: { ${convertedFA.end_states} }`}</div>
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
                      {convertedFA?.symbols?.map((symbol, index) => {
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
                    {convertedFA?.states?.map((state, index) => {
                      return (
                        <tr
                          key={index}
                          className="border border-slate-300 w-full text-center"
                        >
                          <td className="border border-slate-300 w-44 p-3 text-black">
                            {state}
                          </td>
                          {convertedFA?.symbols?.map((symbol, index) => {
                            return (
                              <td
                                key={index}
                                className="border border-slate-300 w-44 p-3"
                              >
                                {convertedFA?.transitions?.[state]?.[
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
    </Fragment>
  );
};

export default NFAtoDFA;
