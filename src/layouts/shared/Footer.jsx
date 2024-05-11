import SiteLogo from "@/components/SiteLogo";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-6">
      <Link to="/">
        <SiteLogo />
      </Link>
      <div className="p-4 text-center">Copy</div>
    </footer>
  );
};

export default Footer;
