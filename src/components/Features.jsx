import DFAorNFA from "./DFAorNFA";

const Features = ({ transitionFunction }) => {
  return (
    <div className="my-2">
      <div className="text-black text-xl md:text-2xl lg:text-3xl font-bold">
        Features
      </div>
      <div className="p-2 my-2">
        <DFAorNFA transitionFunction={transitionFunction} />
      </div>
    </div>
  );
};

export default Features;
