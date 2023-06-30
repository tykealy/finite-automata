import React from "react";
import Link from "next/link";
export default function Home() {
  return (
    <div className="max-w-6xl mx-auto my-7 px-4">
      <div className="flex justify-between">
        <span className="text-2xl ">Finite Automata</span>
        <span
          style={{ backgroundColor: "#182c4c" }}
          className="px-3 py-1 border rounded-lg"
        >
          <Link className="text-white" href="/new">
            + ADD
          </Link>
        </span>
      </div>

      <div className="border border-gray-300 my-3" />
    </div>
  );
}
