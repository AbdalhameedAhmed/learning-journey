const Spinner = ({ size = "default" }: { size?: "default" | "small" }) => {
  if (size === "small") {
    return (
      <div className="flex items-center justify-center">
        <span className="loader !h-8 !w-8"></span>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <span className="loader"></span>
    </div>
  );
};

export default Spinner;
