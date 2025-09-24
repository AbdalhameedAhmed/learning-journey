import React from "react";

const GoalsPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">الأهداف</h1>
      <div className="border border-gray-400 rounded-lg w-96 h-64 flex items-center justify-center">
        <p className="text-lg">تعرض الأهداف هنا</p>
      </div>
    </div>
  );
};

export default GoalsPage;

