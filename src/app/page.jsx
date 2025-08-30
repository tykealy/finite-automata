"use client";
import React from "react";
import Link from "next/link";
import { appCheckReadyPromise } from "./../../firebaseConfig";
import { TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";

export default function Page() {
  const [docs, setDocs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    appCheckReadyPromise
      .catch(() => false)
      .then(() => {
        if (cancelled) return;
        const firestore = getFirestore();
        const q = query(collection(firestore, "automata"));
        return getDocs(q)
          .then((snapshot) => !cancelled && setDocs(snapshot.docs))
          .catch((err) => {
            if (process.env.NODE_ENV === "development") {
              console.error(err);
            }
          });
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

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
      <div className="text-black bg-white border-2 w-full flex p-4">
        <MagnifyingGlassIcon className="w-5 mx-3" />
        <input
          type="text"
          className="bg-white flex-1 border-none outline-none "
          placeholder="search by title"
        />
      </div>
      <div>
        {!loading && docs.length === 0 && <span>No Finite Automata</span>}
        <ul>
          {docs.map((fa, index) => {
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
                          {`Final states: {${fa.data().end_states}}`}
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
