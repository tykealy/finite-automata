"use client";
import "./../../../firebaseConfig";
import Link from "next/link";
import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import MultipleSelection from "@/components/MultipleSelection";
export async function createFA(name) {
  const firestore = getFirestore();
  const c = collection(firestore, "automata");
  const doc1 = {
    name: name,
  };
  try {
    await addDoc(c, doc1);
    alert(`New FA is created`);
  } catch (error) {
    console.log(error);
  }
}

const Page = () => {
  const [faName, setFaName] = React.useState("");
  const [states, setStates] = React.useState([]);
  const [alphabetsArray, setAlphabets] = React.useState([]);
  const handleFormSubmit = (event) => {
    event.preventDefault();
    createFA(faName);
    setFaName("");
  };
  const handleStateArray = (e, statesString) => {
    const statesArray = statesString.split(",");
    setStates(statesArray);
  };
  const handleAlphabetArray = (e, alphabets) => {
    const alphabetsArray = alphabets.split(",");
    setAlphabets(alphabetsArray);
    console.log(alphabetsArray);
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <div className="max-w-6xl mx-auto my-7 px-4">
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
            name="fa-name"
            type="text"
            className="flex-1 text-xl sm:text-2xl border border-transparent focus:outline-none focus:ring-0"
            placeholder="Input your FA Name"
            onChange={(event) => {
              setFaName(event.target.value);
            }}
          ></input>
          <button
            type="submit"
            className="text-white bg-[#182c4c] px-3 py-1 border rounded-lg hover:bg-[#435f8c]"
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
                onChange={(e) => {
                  e.preventDefault();
                  handleStateArray(e, e.target.value);
                }}
                placeholder="Please seperate values by comma  ' , '"
                type="text"
                name="states"
                className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                onChange={(e) => {
                  e.preventDefault();
                  handleAlphabetArray(e, e.target.value);
                }}
                type="text"
                placeholder="Please seperate values by comma  ' , '"
                name="alphabets"
                className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                <select
                  name="start_state"
                  className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  {states.map((state, index) => {
                    return (
                      <option key={index} value="">
                        {state}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex-1 ml-2">
                <label
                  htmlFor="end_states"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  End States
                </label>
                <MultipleSelection options={states} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
