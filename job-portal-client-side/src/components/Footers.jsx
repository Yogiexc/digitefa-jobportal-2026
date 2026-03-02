import { Link } from "react-router-dom";
import { Layout } from "antd";
import { InstagramLogo, LinkedinLogo, YoutubeLogo } from "phosphor-react";
import Logo from "../assets/svg/DigitefaWhite.svg";

const { Footer } = Layout;

const Footers = () => {
  return (
    <Footer className="bg-[#06A73B] text-white py-8 px-16  md:h-[319px] flex flex-col justify-between">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center h-full space-y-8 md:space-y-0 md:space-x-8">
        <div className="flex flex-col justify-center mb-4 md:mb-0 w-full md:w-1/4">
          <img src={Logo} alt="Digitefa" className="w-[132px] h-[42] mb-2" />
        </div>

        <div className="flex flex-col justify-center mb-4 md:mb-0 w-full md:w-1/4 text-left md:text-left">
          <p className="text-xl font-normal mb-3">Yogyakarta</p>
          <p className="text-xs leading-relaxed">
            Jl. Waras, Panggung Sari, Sardonoharjo, Kec. Ngaglik, Kabupaten
            Sleman, Daerah Istimewa Yogyakarta 55581
          </p>
        </div>

        <div className="flex flex-col justify-center mb-4 md:mb-0 w-full md:w-1/4 text-left md:text-left">
          <p className="text-xl font-normal mb-3">Contact Us</p>
          <p className="text-xs mb-12">(+62)895-2903-5998</p>
          <p className="text-xl font-normal mb-3">Operational Hours</p>
          <p className="text-xs">Monday - Friday</p>
          <p className="text-xs">09:00 - 18:00</p>
        </div>

        <div className="flex flex-col justify-center mb-4 md:mb-0 w-full md:w-1/4 text-left md:text-left">
          <p className="text-xl font-normal mb-3">Quick Links</p>
          <Link
            to="/about-us"
            className="text-xs text-white hover:underline mb-1"
          >
            About Us
          </Link>
          <Link
            to="/event-news"
            className="text-xs text-white hover:underline mb-1"
          >
            Event / News
          </Link>
          <Link
            to="/find-jobs"
            className="text-xs text-white hover:underline mb-1"
          >
            Find Jobs
          </Link>
          <Link
            to="/privacy-policy"
            className="text-xs text-white hover:underline mb-3"
          >
            Privacy Policy
          </Link>
          <div className="flex justify-start md:justify-start space-x-2 md:space-x-2 mt-2">
            <a
              href="https://instagram.com"
              className="text-white text-2xl p-2 rounded-full border-[1px] border-[#15BF64]"
            >
              <InstagramLogo size={14} />
            </a>
            <a
              href="https://linkedin.com"
              className="text-white text-2xl p-2 rounded-full border-[1px] border-[#15BF64]"
            >
              <LinkedinLogo size={14} />
            </a>
            <a
              href="https://youtube.com"
              className="text-white text-2xl p-2 rounded-full border-[1px] border-[#15BF64]"
            >
              <YoutubeLogo size={14} />
            </a>
          </div>
        </div>
      </div>
      <div className="text-left md:text-center text-xs mt-8">
        <p> Digitefa © {new Date().getFullYear()} All Rights Reserved</p>
      </div>
    </Footer>
  );
};

export default Footers;
