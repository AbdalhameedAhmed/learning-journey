import contentMedium from "@/assets/content/content-medium.jpg";

const ContentPage = () => {
  return (
    <div className="h-[calc(100vh-4rem)] w-screen overflow-hidden bg-white p-2">
      <img
        src={contentMedium}
        alt="الأهداف"
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export default ContentPage;
