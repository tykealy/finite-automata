const cleanTransitions = (transitions, states, symbols) => {
  const t = transitions;
  Object.keys(t).forEach((key) => {
    if (!states.includes(key)) {
      delete t[key];
    }
  });

  Object.keys(t).forEach((state) => {
    Object.keys(t[state]).forEach((key) => {
      if (!symbols.includes(key)) {
        delete t[state][key];
      }
    });
  });
  return t;
};

export default cleanTransitions;
