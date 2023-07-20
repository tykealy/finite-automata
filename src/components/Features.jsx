import DFAorNFA from "./DFAorNFA";
import MinimizeDFA from "./MinimizeDFA";
import NFAtoDFA from "./NFAtoDFA";
import StringInput from "./StringInput";

const Features = ({
  fa,
  transitions,
  start_state,
  end_states,
  symbols,
  states,
}) => {
  return (
    <div className="mt-7">
      <div className="text-black text-xl md:text-2xl lg:text-3xl font-bold">
        Features
      </div>
      <div className="p-2 my-2 grid md:grid-cols-2 gap-4">
        <div className="grid">
          <DFAorNFA
            transitions={transitions}
            start_state={start_state}
            end_states={end_states}
            states={states}
            symbols={symbols}
          />
        </div>
        <div className="grid">
          <StringInput
            transitions={transitions}
            start_state={start_state}
            end_states={end_states}
            states={states}
            symbols={symbols}
          />
        </div>
        <div className="grid">
          <NFAtoDFA
            fa={fa}
            transitions={transitions}
            start_state={start_state}
            end_states={end_states}
            states={states}
            symbols={symbols}
          />
        </div>
        <div className="grid">
          <MinimizeDFA fa={fa} />
        </div>
      </div>
    </div>
  );
};

export default Features;
