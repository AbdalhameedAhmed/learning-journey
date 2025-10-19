import contentImage from "@/assets/contentImage.png";
import examImage from "@/assets/examImage.png";
import goalsImage from "@/assets/goalsImage.png";
import infoImage from "@/assets/infoImage.png";
import HomeCard from "@/components/HomeCard";

const HomePage = () => {
  return (
    <div className="mx-25 my-auto flex h-full items-center justify-center">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
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
    to: "/instructions",
  },
  {
    image: goalsImage,
    title: "الأهداف",
    to: "/goals",
  },
  {
    image: contentImage,
    title: "خريطة المحتوى",
    to: "/content-map",
  },
  {
    image: examImage,
    title: "الامتحان القبلي",
    to: "/pre-exam?courseId=1",
  },
];
