import contentImage from "@/assets/contentImage.png";
import examImage from "@/assets/examImage.png";
import goalsImage from "@/assets/goalsImage.png";
import infoImage from "@/assets/infoImage.png";
import HomeCard from "@/components/HomeCard";

const HomePage = () => {
  return (
    <div className="flex h-screen items-center justify-center px-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {homeCardItems.map((item, index) => (
          <HomeCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;

const homeCardItems = [
  {
    image: infoImage,
    title: "التعليمات",
    to: "/info",
  },
  {
    image: goalsImage,
    title: "الأهداف",
    to: "/goals",
  },
  {
    image: contentImage,
    title: "المحتوى",
    to: "/content",
  },
  {
    image: examImage,
    title: "الإمتحان القبلي",
    to: "/exam",
  },
];
