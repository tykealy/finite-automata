function stringTest(symbols: string, transition: object, start_state: string, end_states: any): object {
  let currentState: string = start_state;
  let isAccepted: boolean = false;
  let visitedStates: string[] = [currentState];
  let stringTransitions: { symbol: string, from: string, to: string }[] = [];
  let lastState:string;

  for (let i = 0; i < symbols.length; i++) {
    if (transition[currentState][symbols[i]] !== undefined && transition[currentState][symbols[i]].length > 0) {
      const nextState = transition[currentState][symbols[i]][0];
      stringTransitions.push({ symbol: symbols[i], from: currentState, to: nextState });
      currentState = nextState;
      visitedStates.push(currentState);
      isAccepted = end_states.includes(currentState);
    } else {
      isAccepted = false;
      break;
    }
    lastState = currentState;
  }
  const dotScript = transitionsToDotScript(transition,start_state,end_states,visitedStates,isAccepted,lastState,stringTransitions);
  return { isAccepted, stringTransitions,dotScript };
}

export default stringTest;


function transitionsToDotScript(transitions:any, start:any, end:any,visitedStates:any,isAccepted:boolean,lastState:string,stringTransitions:any) {
  let dotScript = "digraph { rankdir=LR;\n";
  let isAcceptedColor  = "#9DC08B";
  let isNotAcceptedColor = "#E76161";
  // Create nodes
  dotScript += `    start [shape = "point", label="start",style="filled", fillcolor="#D7BBF5"]\n`;
  for (const node in transitions) {
    if (end.indexOf(node) != -1) {
      if(visitedStates.includes(node)){
        dotScript += `  ${node} [shape = doublecircle, label=<<font color="white">${node}</font>>, style="filled", fillcolor="${node==lastState?(isAccepted? isAcceptedColor:""):("#35A29F")}"]\n`;
      }
    } else {
      if(visitedStates.includes(node)){
      dotScript += `    ${node} [label=<<font color="white">${node}</font>>style="filled", fillcolor="${node==lastState?(isAccepted?"":isNotAcceptedColor):("#35A29F")}"]\n`;
    }
    }
  }

  dotScript += `    start -> ${start} [ color="#D7BBF5" ]\n`;
  // Create edges
  for (const node in transitions) {
    //node = q0;
    const transitionsObj = transitions[node]; // transitionsObj = {a:[q0,q1],b:[]}
    for (const transitionLabel in transitionsObj) {
      //transitionLabel = a
      const targetNodes = transitionsObj[transitionLabel];// targetNodes = [q0,q1]

      targetNodes.forEach((targetNode:any) => {
        let transitionsObj = {symbol:transitionLabel, from:node, to:targetNode};
        if(stringTransitions.some((obj: any) => JSON.stringify(obj) === JSON.stringify(transitionsObj))){
          if(JSON.stringify(transitionsObj)===JSON.stringify(stringTransitions.at(-1))){
            dotScript += `    ${node} -> ${targetNode} [label=<<font color="${isAccepted?isAcceptedColor:isNotAcceptedColor}">${transitionLabel}</font>>, color="${isAccepted?isAcceptedColor:isNotAcceptedColor}"]\n`;
          }
          else{
            dotScript += `    ${node} -> ${targetNode} [label=<<font color="#35A29F">${transitionLabel}</font>>, color="#35A29F"]\n`;
          }
        }else{
          dotScript += `    ${node} -> ${targetNode} [label="${transitionLabel}"]\n`;
        }
      });
    }
  }

  dotScript += "}";
  return dotScript;
}
