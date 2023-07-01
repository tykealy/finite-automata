'use client';
import React, { useEffect } from 'react';
import Router from 'next/router';
import "./../../firebaseConfig";
import { getFirestore, collection, addDoc } from "firebase/firestore";

export default function Page() {
  const addFA = async () => {
    const firestore = getFirestore();
    const collectionRef = collection(firestore, "FA");
    const docData = {
      title: "NFA",
    };
    const docRef = await addDoc(collectionRef, docData);
    console.log("Document written with ID: ", docRef.id);

    // create a new element to /new?id=docRef.id inside test-test div id
    const newElement = document.createElement("div");
    newElement.innerHTML = `<a href="/new?id=${docRef.id}">${docRef.id}</a>`;
    document.getElementById("test-test").appendChild(newElement);

    return docRef.id;
  }

  return (
    <div className="max-w-6xl mx-auto my-7 px-4">
      <div className="flex justify-between">
        <span className="text-xl sm:text-2xl">Finite Automata</span>
        <span
            onClick={addFA}
            className="text-white bg-[#182c4c] px-3 py-1 border rounded-lg hover:bg-[#435f8c] cursor-pointer"
          >
            + ADD
          </span>
      </div>

      <div
        id="test-test"
      ></div>

      <div className="border border-gray-300 my-3" />
    </div>
  );
}
