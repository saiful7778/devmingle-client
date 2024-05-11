import { FaUserAstronaut } from "react-icons/fa6";
import cn from "@/utility/cn";
import PropTypes from "prop-types";

const style = {
  base: "inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-gray-500",
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
  xl: "h-24 w-24",
  image: {
    sm: 40,
    md: 56,
    lg: 80,
    xl: 96,
  },
};

const Avatar = ({ className, img, size = "md", alt = "user image" }) => {
  return (
    <div
      className={cn(
        style.base,
        size === "sm" && style.sm,
        size === "md" && style.md,
        size === "lg" && style.lg,
        size === "xl" && style.xl,
        className
      )}
    >
      {img ? (
        <img
          className="object-cover object-center"
          src={img}
          width={style.image[size]}
          height={style.image[size]}
          alt={alt}
        />
      ) : (
        <FaUserAstronaut size={style.image[size] - 15} />
      )}
    </div>
  );
};

Avatar.propTypes = {
  className: PropTypes.string,
  img: PropTypes.string,
  size: PropTypes.string,
  alt: PropTypes.string,
};

export default Avatar;
