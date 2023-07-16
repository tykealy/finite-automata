"use client";
import React from "react";
import Swal from "sweetalert2";
const StringInput = () => {
  const [string, setString] = React.useState("");
  return (
    <div className="text-black w-full border rounded-lg shadow-lg shadow-black-400 px-5 pt-5">
      <div className=" text-md">Test if a string is accepted.</div>
      <input
        onChange={(e) => {
          e.preventDefault();
          setString(e.target.value);
        }}
        value={string}
        type="text"
        placeholder="Input a string"
        className="px-1.5 bg-white block w-full rounded-md border-0 py-1.5 my-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      <button
        onClick={(e) => {
          e.preventDefault();
            Swal.fire({
                title: string,
                text: "Test if a string is accepted.",
                icon: "success",
                confirmButtonText: "Cool",
                //button color
                confirmButtonColor: "#182c4c",
            });
        }}
        className="font-semibold my-2 p-2 text-sm border border-gray-400 rounded-lg"
      >
        TEST
      </button>
    </div>
  );
};

export default StringInput;