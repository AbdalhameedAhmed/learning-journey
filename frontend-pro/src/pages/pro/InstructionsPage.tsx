import React from "react";

const InstructionsPage: React.FC = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-6">
      <h1 className="mb-6 text-2xl font-bold">التعليمات </h1>
      <div className="flex h-64 w-96 items-center justify-center rounded-lg border border-gray-400">
        <p className="text-lg">تعرض التعليمات هنا</p>
      </div>
    </div>
  );
};

export default InstructionsPage;
