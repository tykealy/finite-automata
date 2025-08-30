"use client";
import { appCheckReadyPromise } from "./../../../firebaseConfig";
import Link from "next/link";
import React from "react";
import checkDFAorNFA from "@/utils/CheckDFAorNFA";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import MultipleSelection from "@/components/MultipleSelection";
import SingleSelection from "@/components/SingleSelection";
import Features from "@/components/Features";
import cleanTransitions from "@/utils/CleanTransitions";
import Swal from "sweetalert2";

export async function createFA(
  name,
  states,
  symbols,
  start_state,
  end_states,
  transitions,
  type
) {
  await appCheckReadyPromise;
  const firestore = getFirestore();
  const c = collection(firestore, "automata");
  const doc1 = {
    name: name,
    state: states,
    symbols: symbols,
    start_state: start_state,
    end_states: end_states,
    transitions: transitions,
    type: type,
  };
  try {
    const res = await addDoc(c, doc1);
    return res.id;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }
}

const Page = () => {
  const router = useRouter();
  const [faName, setFaName] = React.useState("");
  const [states, setStates] = React.useState([]);
  const [symbols, setSymbols] = React.useState([]);
  const [startState, setStartState] = React.useState("");
  const [endStates, setEndStates] = React.useState([]);
  const [transitions, setTransitions] = React.useState({});

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

    states.forEach((state) => {
      if (!t.hasOwnProperty(state)) {
        t[state] = {};
        alphabets.forEach((a) => {
          t[state][a] = [];
        });
      }
    });

    setTransitions(t);
  };

  React.useEffect(() => {
    transition(states, symbols);
  }, [states, symbols]);

  //FA saving Function
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
      alert("Please fill all the fields");
      return;
    }

    const type = checkDFAorNFA(transitions);
    createFA(
      faName,
      states,
      symbols,
      startState,
      endStates,
      transitions,
      type
    ).then((res) => {
      router.push("/view/" + res);
      Swal.fire({
        icon: "success",
        title: "Your FA has been saved",
        timer: 2000,
        confirmButtonText: "Cool",
        confirmButtonColor: "#182c4c",
      });
    });
  };

  return (
    <div className="max-w-7xl mx-auto my-7 px-4">
      <form
        onSubmit={(e) => {
          handleSave(e);
        }}
      >
        <div className="flex items-center">
          <Link
            className="inline-flex items-center border rounded-lg bg-[#182c4c] mr-3 hover:bg-[#435f8c]"
            href="/"
            as="/"
          >
            <ChevronLeftIcon className="h-8 w-6 sm:w-8 text-white" />
            <span className="mr-2 text-white text-sm sm:text-md">Back</span>
          </Link>
          <input
            required
            value={faName}
            name="fa-name"
            type="text"
            className="md:ml-1 flex-1 text-lg sm:text-2xl border border-transparent focus:outline-none focus:ring-0 text-black bg-white"
            placeholder="Input your FA Name"
            onChange={(event) => {
              setFaName(event.target.value);
            }}
          ></input>
          <button
            type="submit"
            className="bg-[#182c4c] px-2 text-sm sm:text-md sm:px-3 py-1.5 border rounded-lg hover:bg-[#435f8c] text-white"
            onClick={(e) => {
              const fa = {
                name: faName,
                states: states,
                symbols: symbols,
                start_state: startState,
                end_states: endStates,
                transitions: transitions,
              };
              if (process.env.NODE_ENV === "development") {
                console.log(JSON.stringify(fa));
              }
            }}
          >
            SAVE
          </button>
        </div>
        <div className="border border-gray-300 my-2" />
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
                value={Array.isArray(states) ? states.join(",") : states || ""}
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
                value={Array.isArray(symbols) ? symbols.join(",") : symbols || ""}
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
                />
              </div>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-2 p-3">
            <div className="border border-slate-300 w-full overflow-auto">
              <table className="w-full table-fixed border border-collaps">
                <thead>
                  <tr>
                    <th className="border border-slate-300 md:w-44 w-28 p-1 md:p-2 text-black">
                      Transitions
                    </th>
                    {symbols.map((symbol, index) => {
                      return (
                        <th
                          key={index}
                          className=" w-36 md:w-44 border border-slate-300 text-black"
                        >
                          {symbol}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {states.map((state, index) => {
                    return (
                      <tr
                        key={index}
                        className="border border-slate-300 w-full text-center"
                      >
                        <td className="border border-slate-300 p-3 text-black">
                          {state}
                        </td>
                        {symbols.map((symbol, index) => {
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
        symbols={symbols}
        start_state={startState}
        end_states={endStates}
        states={states}
      />
    </div>
  );
};

export default Page;
