"use client";
import React from "react";
import Button from "@/components/Button";
export default function Home() {
  return (
    <div className="max-w-6xl mx-auto my-7 px-4">
      <div className="flex justify-between">
        <span className="text-2xl">Finite Automata</span>
        <span
          style={{ backgroundColor: "#182c4c" }}
          className="px-3 py-1 border rounded-lg"
        >
          <Button
            onClick={() => {
              alert("sdfj");
            }}
            title="+ ADD"
          ></Button>
        </span>
      </div>

      <div className="border border-gray-300 my-3" />
    </div>
  );
}
