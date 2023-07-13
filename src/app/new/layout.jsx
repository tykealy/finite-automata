import React from "react";
import Swal from "sweetalert2";
export const metadata = {
  title: "Design FA",
  description: "A powerful web app to design and test Finite Automata",
};

const NewLayout = ({ children }) => {
  return <div>{children}</div>;
};

export default NewLayout;