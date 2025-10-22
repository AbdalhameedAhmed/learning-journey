import instructionsMedium from "@/assets/instructions/instructions-medium.jpg";

const InstructionsPage = () => {
  return (
    <div className="h-[calc(100vh-4rem)] w-screen overflow-hidden bg-white p-2">
      <img
        src={instructionsMedium}
        alt="التعليمات"
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export default InstructionsPage;
