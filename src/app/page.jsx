import React from "react";
import Link from "next/link";
import "./../../firebaseConfig";
import { TrashIcon } from "@heroicons/react/20/solid";

import { collection, getDocs, getFirestore, query } from "firebase/firestore";

export default async function Page() {
  const firestore = getFirestore();
  const q = query(collection(firestore, "automata"));
  const fas = await getDocs(q);
  return (
    <div className="max-w-6xl mx-auto my-7 px-4 bg-white">
      <div className="flex justify-between">
        <span className="text-xl sm:text-2xl text-black ">Finite Automata</span>
        <Link
          className="px-3 py-1 border rounded-lg hover:bg-[#435f8c] bg-[#182c4c] text-white "
          href="/new"
          as="/new"
        >
          + ADD
        </Link>
      </div>

      <div className="border border-gray-300 my-3" />
      <div>
        {(fas == undefined || fas.docs.length == 0) && (
          <span>No Finite Automata</span>
        )}
        <ul>
          {fas.docs.map((fa, index) => {
            return (
              <li key={index}>
                <div className="w-full border shadow-black-400 shadow-lg my-3 flex p-5 rounded-md">
                  <Link
                    className="flex-1"
                    href={`/view/${fa.id}`}
                    as={`/view/${fa.id}`}
                  >
                    <span>
                      <div className="font-semibold text-black">
                        {fa.data().name}
                      </div>
                      <div className="my-2 text-sm text-black">{`States: {${
                        fa.data().state
                      }} - Symbols: {${fa.data().symbols}}`}</div>
                      <div className="flex mt-5">
                        <span className="px-3 py-1 bg-gray-200 text-sm rounded-xl mr-2 text-black">
                          {fa.data().type}
                        </span>
                        <span className="px-3 py-1 bg-gray-200 text-sm rounded-xl mr-2 text-black">
                          {`Start state: ${fa.data().start_state}`}
                        </span>
                        <span className="px-3 py-1 bg-gray-200 text-sm rounded-xl mr-2 text-black">
                          {`Start state: {${fa.data().end_states}}`}
                        </span>
                      </div>
                    </span>
                  </Link>
                  <div>
                    <TrashIcon className="w-5 text-red-500 hover:text-red-900" />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export const revalidate = 0;
