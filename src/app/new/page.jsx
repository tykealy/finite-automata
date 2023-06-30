import Link from "next/link";
import React from "react";
import Navigation from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
const New = () => {
  const navigation = Navigation;
  return (
    <div className="max-w-6xl mx-auto my-7 px-4">
      <div className="flex items-center">
        <Link
          className="inline-flex items-center border rounded-lg bg-[#182c4c] mr-3"
          href="/"
        >
          <ChevronLeftIcon className="h-8 w-8 text-white" />
          <span className="mr-2 text-white">Back</span>
        </Link>
        <span className="flex-1 text-2xl ">Design a Finite Automata</span>
        <span className="text-white bg-[#182c4c] px-3 py-1 border rounded-lg">
          SAVE
        </span>
      </div>
      <div className="border border-gray-300 my-3" />
    </div>
  );
};

export default New;
