import { Link } from "react-router-dom";

interface HomeCardProps {
  image: string;
  title: string;
  to: string;
}

const HomeCard = ({ image, title, to }: HomeCardProps) => {
  return (
    <Link
      to={to}
      className="text-current transition-transform duration-200 hover:scale-105"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
        <div className="relative aspect-square w-full p-2">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="text-3xl font-semibold">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default HomeCard;
