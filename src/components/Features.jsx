import DFAorNFA from "./DFAorNFA";
import MinimizeDFA from "./MinimizeDFA";
import NFAtoDFA from "./NFAtoDFA";
import StringInput from "./StringInput";

const Features = ({ fa, transitionFunction }) => {
  return (
    <div className="mt-7">
      <div className="text-black text-xl md:text-2xl lg:text-3xl font-bold">
        Features
      </div>
      <div className="p-2 my-2 grid md:grid-cols-2 gap-4">
        <div className="grid">
          <DFAorNFA transitionFunction={transitionFunction} fa={fa} />
        </div>
        <div className="grid">
          <StringInput />
        </div>
        <div className="grid">
          <NFAtoDFA fa={fa} />
        </div>
        <div className="grid">
          <MinimizeDFA />
        </div>
      </div>
    </div>
  );
};

export default Features;
