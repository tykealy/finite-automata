"use client";
import "./../../../firebaseConfig";
import Link from "next/link";
import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { getFirestore, updateDoc, doc } from "firebase/firestore";

export async function update() {
  const firestore = getFirestore();
  const testing = doc(firestore, "FA/1");
  const doc1 = {
    title: "NFA",
  };
  updateDoc(testing, doc1);
  alert("Change saved to firebase");
}
const Page = () => {
  return (
    <div>
      <div className="max-w-6xl mx-auto my-7 px-4">
        <div className="flex items-center">
          <Link
            className="inline-flex items-center border rounded-lg bg-[#182c4c] mr-3 hover:bg-[#435f8c]"
            href="/"
          >
            <ChevronLeftIcon className="h-8 w-8 text-white" />
            <span className="mr-2 text-white">Back</span>
          </Link>
          <span className="flex-1 text-xl sm:text-2xl">
            Design a Finite Automata
          </span>
          <span
            onClick={update}
            className="text-white bg-[#182c4c] px-3 py-1 border rounded-lg hover:bg-[#435f8c]"
          >
            SAVE
          </span>
        </div>
        <div className="border border-gray-300 my-3" />
      </div>
    </div>
  );
};

export default Page;
