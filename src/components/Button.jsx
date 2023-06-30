const Button = (props) => {
  return (
    <button
      className="text-white"
      style={props.sx}
      onClick={props.onClick}
    >{props.title}</button>
  );
};

export default Button;
