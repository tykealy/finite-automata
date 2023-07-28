"use client";
import "../../../../firebaseConfig";
import Link from "next/link";
import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import MultipleSelection from "@/components/MultipleSelection";
import SingleSelection from "@/components/SingleSelection";
import { useRouter } from "next/navigation";
import Features from "@/components/Features";
import Swal from "sweetalert2";
import checkDFAorNFA from "@/utils/CheckDFAorNFA";
import cleanTransitions from "@/utils/CleanTransitions";
async function updateFA(
  name,
  states,
  symbols,
  start_state,
  end_states,
  transitions,
  type,
  id
) {
  const firestore = getFirestore();
  const data = {
    name: name,
    state: states,
    symbols: symbols,
    start_state: start_state,
    end_states: end_states,
    transitions: transitions,
    type: type,
  };
  const docRef = doc(firestore, "automata", id);
  try {
    await updateDoc(docRef, data);
  } catch (error) {
    console.log(error);
  }
}

const FA = ({ params }) => {
  const router = useRouter();
  const [fa, setFa] = React.useState({});
  const [faName, setFaName] = React.useState("");
  const [states, setStates] = React.useState([]);
  const [symbols, setSymbols] = React.useState([]);
  const [startState, setStartState] = React.useState("");
  const [endStates, setEndStates] = React.useState([]);
  const [transitions, setTransitions] = React.useState({});

  async function getFa(param) {
    const firestore = getFirestore();
    const docRef = doc(firestore, "automata", param);
    const fa = await getDoc(docRef);
    setFa(fa.data());
  }

  React.useEffect(() => {
    getFa(params.id);
  }, []);

  React.useEffect(() => {
    setFaName(fa.name);
    setStates(fa.state);
    setSymbols(fa.symbols);
    setStartState(fa.start_state);
    setEndStates(fa.end_states);
    setTransitions(fa.transitions);
  }, [fa]);

  React.useEffect(() => {
    transition(states, symbols);
  }, [states, symbols]);

  const setTransitionState = (state, symbol, selectedStates, transitions) => {
    const t = transitions;
    if (t[state] != null) t[state][symbol] = selectedStates;
    setTransitions(t);
  };
  const handleStartStateChange = (start_state) => {
    setStartState(start_state);
  };
  const handleEndStatesChange = (end_states) => {
    setEndStates(end_states);
  };
  const handleStateArray = (statesString) => {
    const statesArray = statesString.split(",");
    setStates(statesArray);
  };
  const handleAlphabetArray = (alphabets) => {
    const symbols = alphabets.split(",");
    if (symbols.includes("E")) symbols.splice(symbols.indexOf("E"), 1, "ε");
    setSymbols(symbols);
  };
  const transition = (states, alphabets) => {
    const t = transitions;

    states?.forEach((state) => {
      if (!t.hasOwnProperty(state)) {
        t[state] = {};
        alphabets.forEach((a) => {
          t[state][a] = [];
        });
      }
    });
    setTransitions(t);
  };
  const handleSave = (e) => {
    e.preventDefault();
    const t = cleanTransitions(transitions, states, symbols);
    setTransitions(t);
    if (
      states.length == 0 ||
      symbols.length == 0 ||
      startState == "" ||
      endStates.length == 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill all the fields",
      });
      return;
    }

    const type = checkDFAorNFA(transitions);
    updateFA(
      faName,
      states,
      symbols,
      startState,
      endStates,
      transitions,
      type,
      params.id
    )
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Automata updated successfully",
          confirmButtonText: "Cool",
          confirmButtonColor: "#3085d6",
        });
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <div className="max-w-7xl mx-auto my-7 px-4">
      <form onSubmit={handleSave}>
        <div className="flex items-center">
          <Link
            className="inline-flex items-center border rounded-lg bg-[#182c4c] mr-3 hover:bg-[#435f8c]"
            href="/"
            as="/"
          >
            <ChevronLeftIcon className="h-8 w-8 text-white" />
            <span className="mr-2 text-white">Back</span>
          </Link>
          <input
            required
            type="text"
            className="md:ml-1 flex-1 text-lg sm:text-2xl border border-transparent focus:outline-none focus:ring-0 text-black bg-white"
            placeholder="Input your FA Name"
            onChange={(event) => {
              setFaName(event.target.value);
            }}
            value={faName}
          />
          <button
            type="submit"
            className=" bg-[#182c4c] px-3 py-1 border rounded-lg hover:bg-[#435f8c] text-white"
          >
            SAVE
          </button>
        </div>
        <div className="border border-gray-300 my-3" />
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div>
            <div className="my-2">
              <label
                htmlFor="states"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                States
              </label>
              <input
                required
                value={states}
                onChange={(e) => {
                  e.preventDefault();
                  handleStateArray(e.target.value);
                }}
                placeholder="Please seperate values by comma  ' , '"
                type="text"
                name="states"
                className="px-3 bg-white block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="alphabets"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Symbols
              </label>
              <input
                required
                value={symbols}
                onChange={(e) => {
                  e.preventDefault();
                  handleAlphabetArray(e.target.value);
                }}
                type="text"
                placeholder="Please seperate values by comma  ' , '"
                name="alphabets"
                className="px-3 bg-white block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="flex my-2">
              <div className="w-40">
                <label
                  htmlFor="start_state"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Start State
                </label>
                <SingleSelection
                  initialState={startState}
                  options={states}
                  handleStartStateChange={handleStartStateChange}
                />
              </div>
              <div className="flex-1 ml-2">
                <label
                  htmlFor="end_states"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Final States
                </label>
                <MultipleSelection
                  options={states}
                  handleEndStatesChange={handleEndStatesChange}
                  initialSelect={endStates}
                />
              </div>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-2 p-3">
            <div className="border border-slate-300 w-full overflow-auto">
              <table className="w-full table-fixed border border-collaps">
                <thead>
                  <tr className="text-center">
                    <th className="border border-slate-300 md:w-44 w-28 p-1 md:p-2 text-black">
                      Transitions
                    </th>
                    {symbols?.map((symbol, index) => {
                      return (
                        <td
                          key={index}
                          className=" w-36 md:w-44 border border-slate-300 text-black"
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
                        <td className="border border-slate-300 p-3 text-black">
                          {state}
                        </td>
                        {symbols?.map((symbol, index) => {
                          return (
                            <td
                              key={index}
                              className="border border-slate-300 p-3"
                            >
                              <MultipleSelection
                                options={states}
                                state={state}
                                symbol={symbol}
                                transitions={transitions}
                                handleEndStatesChange={setTransitionState}
                                initialSelect={transitions?.[state]?.[symbol]}
                              ></MultipleSelection>
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
        </div>
      </form>
      <Features
        transitions={transitions}
        start_state={startState}
        end_states={endStates}
        symbols={symbols}
        states={states}
        fa={fa}
      />
    </div>
  );
};
export default FA;
