"use client";
import "./../../../firebaseConfig";
import Link from "next/link";
import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import MultipleSelection from "@/components/MultipleSelection";
import SingleSelection from "@/components/SingleSelection";
export async function createFA(
  name,
  states,
  symbols,
  start_state,
  end_states,
  transitions,
  type
) {
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
    console.log(error);
  }
}

const Page = () => {
  const router = useRouter();
  const [faName, setFaName] = React.useState("");
  const [states, setStates] = React.useState([]);
  const [alphabetsArray, setAlphabets] = React.useState([]);
  const [startState, setStartState] = React.useState();
  const [endStates, setEndStates] = React.useState();
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
    const alphabetsArray = alphabets.split(",");
    if (alphabetsArray.includes("E"))
      alphabetsArray.splice(alphabetsArray.indexOf("E"), 1, "ε");
    setAlphabets(alphabetsArray);
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
    transition(states, alphabetsArray);
  }, [states, alphabetsArray]);

  return (
    <form>
      <div className="max-w-7xl mx-auto my-7 px-4">
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
            onClick={(e) => {
              e.preventDefault();
              const t = transitions;
              Object.keys(t).forEach((key) => {
                if (!states.includes(key)) {
                  delete t[key];
                }
              });

              Object.keys(t).forEach((state) => {
                Object.keys(t[state]).forEach((key) => {
                  if (!alphabetsArray.includes(key)) {
                    delete t[state][key];
                  }
                });
              });

              setTransitions(t);
              createFA(
                faName,
                states,
                alphabetsArray,
                startState,
                endStates,
                transitions,
                ""
              ).then((res) => {
                router.push("/view/" + res);
                alert("FA Created");
              });
            }}
            className="bg-[#182c4c] px-3 py-1 border rounded-lg hover:bg-[#435f8c] text-white"
          >
            SAVE
          </button>
        </div>
        <div className="border border-gray-300 my-3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="my-2">
              <label
                htmlFor="states"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                States
              </label>
              <input
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
                Alphabets
              </label>
              <input
                value={alphabetsArray}
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
                  End States
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
                    <th className="border border-slate-300 w-44 p-2 text-black">
                      Transitions
                    </th>
                    {alphabetsArray.map((symbol, index) => {
                      return (
                        <th
                          key={index}
                          className=" w-44 border border-slate-300 text-black"
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
                        <td className="border border-slate-300 w-44 p-3 text-black">
                          {state}
                        </td>
                        {alphabetsArray.map((symbol, index) => {
                          return (
                            <td
                              key={index}
                              className="border border-slate-300 w-44 p-3"
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
      </div>
    </form>
  );
};

export default Page;
