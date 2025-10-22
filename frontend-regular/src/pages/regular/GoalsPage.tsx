import goalsMedium from "@/assets/goals/goals-medium.jpg";

const GoalsPage = () => {
  return (
    <div className="h-[calc(100vh-4rem)] w-screen overflow-hidden bg-white p-2">
      <img
        src={goalsMedium}
        alt="الاهداف"
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export default GoalsPage;
