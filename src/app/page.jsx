import React from "react";
import Link from "next/link";
import "./../../firebaseConfig";
export default function Page() {
  return (
    <div className="max-w-6xl mx-auto my-7 px-4">
      <div className="flex justify-between">
        <span className="text-xl sm:text-2xl">Finite Automata</span>
        <span className="px-3 py-1 border rounded-lg hover:bg-[#435f8c] bg-[#182c4c]">
          <Link className="text-white" href="/new">
            + ADD
          </Link>
        </span>
      </div>

      <div className="border border-gray-300 my-3" />
    </div>
  );
}
