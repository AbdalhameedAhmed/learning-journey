import contentImage from "@/assets/contentImage.png";
import examImage from "@/assets/examImage.png";
import goalsImage from "@/assets/goalsImage.png";
import infoImage from "@/assets/infoImage.png";
import HomeCard from "@/components/HomeCard";

const HomePage = () => {
  return (
    <>
      <div className="bg-primary dark:bg-dark-primary z-50 h-12 w-full"></div>
      <div className="relative mx-25 flex min-h-screen items-center justify-center dark:bg-black">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {homeCardItems.map((item, index) => (
            <HomeCard key={index} {...item} />
          ))}
        </div>
      </div>
    </>
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
    title: "الامتحان القبلي",
    to: "/exam",
  },
];
