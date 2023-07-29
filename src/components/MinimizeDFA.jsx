import showDfa from "@/utils/MinimizeDfa-v2";
import minimizeDfaV3 from "@/utils/MinimizeDfaV3";
import checkDFAorNFA from "@/utils/CheckDFAorNFA";
import Swal from "sweetalert2";
const MinimizeDFA = ({ 
  fa,
  transitions,
  start_state,
  end_states,
  symbols,
  states,
 }) => {
  return (
    <div className="text-black w-full border rounded-lg shadow-lg shadow-black-400 px-5 pt-5">
      <div className=" text-md">Minimize DFA</div>
      <div className="text-sm text-gray-500 my-2">
        Reduce states from a given DFA
      </div>
      <button
        className="font-semibold my-2 p-2 text-sm border border-gray-400 rounded-lg"
        onClick={(e) => {
          e.preventDefault();
          const type = checkDFAorNFA(transitions);
          if (type == "NFA") {
            Swal.fire({
              icon: "error",
              title: "Oops... This isn't DFA!",
            });
            } else {
              console.log(showDfa);
          }
          try{
            if(type === 'DFA'){
              console.log('minimized dfa: ');
              console.log(JSON.stringify(
                {
                  transitions,
                  start_state,
                  end_states,
                  symbols,
                  states,
                }
              ));
              console.log(minimizeDfaV3(
                {
                  transitions,
                  start_state,
                  end_states,
                  symbols,
                  states,
                }
              ));
            }
          } catch (err) {
            alert('Make sure you have filled all the fields correctly! All States should have valid transitions!');
          }
        }}
      >
        Minimize
      </button>
    </div>
  );
};

export default MinimizeDFA;
