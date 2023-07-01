import React from "react";
import Link from "next/link";
import "./../../firebaseConfig";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";

export default async function Page() {
  const firestore = getFirestore();
  const q = query(collection(firestore, "automata"));
  const fas = await getDocs(q);
  return (
    <div className="max-w-6xl mx-auto my-7 px-4">
      <div className="flex justify-between">
        <span className="text-xl sm:text-2xl">Finite Automata</span>
        <Link
          className="px-3 py-1 border rounded-lg hover:bg-[#435f8c] bg-[#182c4c] text-white"
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
                <span>{fa.data().name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
