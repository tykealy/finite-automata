"use client";
import nfaToDfa from "@/utils/NfaToDfa";
const NFAtoDFA = (fa) => {
  return (
    <div className="text-black w-full border rounded-lg shadow-lg shadow-black-400 px-5 pt-5">
      <div className=" text-md">NFA to DFA</div>
      <div className="text-sm text-gray-500 my-2">
        Construct an equivalent DFA from an NFA
      </div>
      <button 
        onClick={
          () => {
            const dfa = nfaToDfa(fa.fa);
            console.log(dfa);
          }
        }
        className="font-semibold my-2 p-2 text-sm border border-gray-400 rounded-lg">
        Construct
      </button>
    </div>
  );
};

export default NFAtoDFA;
