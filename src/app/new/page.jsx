'use client';
import "./../../../firebaseConfig";
import Link from "next/link";
import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { getFirestore, collection, addDoc } from "firebase/firestore";

export async function update() {
  // get the id from the url
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  console.log(id);
  const firestore = getFirestore();
  const testing = doc(firestore, "FA/" + id);
  const doc1 = {
    title: "Fck u, Vaneath",
  };
  try {
    await addDoc(c, doc1);
    alert(`New FA is created`);
  } catch (error) {
    console.log(error);
  }
}

const Page = () => {
  return (
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
        <span className="flex-1 text-xl sm:text-2xl">
          Design a Finite Automata
        </span>
        <span
          onClick={update}
          className="text-white bg-[#182c4c] px-3 py-1 border rounded-lg hover:bg-[#435f8c] cursor-pointer"
        >
          SAVE
        </span>
      </div>
      <div className="border border-gray-300 my-3" />
    </div>
  );
};

export default Page;
