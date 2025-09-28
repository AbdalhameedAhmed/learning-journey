import clsx from "clsx";
import type React from "react";

interface HeaderButtonProps {
  onClick: () => void;
  title: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const HeaderButton = ({
  onClick,
  title,
  disabled = false,
  children,
}: HeaderButtonProps) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <p
      className={clsx(
        "flex w-full items-center justify-center gap-2 rounded-2xl p-2 text-center font-bold transition-opacity select-none",
        {
          "bg-primary cursor-pointer text-white hover:opacity-90": !disabled,
          "cursor-not-allowed bg-gray-400 text-gray-100": disabled,
        },
      )}
      onClick={handleClick}
    >
      <span>{title}</span>
      {children}
    </p>
  );
};

export default HeaderButton;
