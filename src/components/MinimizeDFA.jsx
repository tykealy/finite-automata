import minimizeDfa from "@/utils/MinimizeDfa";

const MinimizeDFA = (fa) => {
  return (
    <div className="text-black w-full border rounded-lg shadow-lg shadow-black-400 px-5 pt-5">
      <div className=" text-md">Minimize DFA</div>
      <div className="text-sm text-gray-500 my-2">
        Reduce states from a given DFA
      </div>
      <button
        className="font-semibold my-2 p-2 text-sm border border-gray-400 rounded-lg"
        onClick={() => {
          const minimize = minimizeDfa(fa);
          console.log(minimize);
        }}
      >
        Minimize
      </button>
    </div>
  );
};

export default MinimizeDFA;
