"use client";
import "./../../../firebaseConfig";
import Link from "next/link";
import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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

  const handleFormSubmit = (event) => {
    event.preventDefault();
    createFA(faName);
    setFaName("");
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
      </div>
    </form>
  );
};

export default Page;
