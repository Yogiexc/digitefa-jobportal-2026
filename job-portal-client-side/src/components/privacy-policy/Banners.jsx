import PrivacyPolicyIcon from "../../assets/svg/PrivacyPolicy.svg";
import Background from "../../assets/images/Background.jpg";

const Banners = () => {
  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col items-center justify-center relative shadow"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="text-center mb-8 max-w-3xl px-4">
        <div className="flex items-center justify-center">
          <img
            src={PrivacyPolicyIcon}
            alt="Privacy Policy"
            className="h-[60px] md:h-[60px] inline-block"
          />
        </div>
        <p className="text-[#232323] text-[18px] mt-8">
        At DIGITEFA, your privacy is our priority. We ensure your personal information is collected, used, and protected with the highest standards of security and transparency. Trust us to safeguard your data responsibly.
        </p>
      </div>
    </div>
  );
};

export default Banners;
