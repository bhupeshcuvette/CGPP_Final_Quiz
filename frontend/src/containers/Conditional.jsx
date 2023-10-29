const Conditional = ({ children, if: shouldRender }) => {
  if (shouldRender) return children;
  return <></>;
};

export default Conditional;
