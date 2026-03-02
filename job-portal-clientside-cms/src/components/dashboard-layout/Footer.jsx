export default function Footer() {
  const aboutClientsideUrl = import.meta.env.VITE_CLIENTSIDE_URL_ABOUT;
  const privacypolicyClientsideUrl = import.meta.env.VITE_CLIENTSIDE_URL_PRIVACYPOLICY;

    return (      
      <div className="my-[30px]">
        <hr className="border-t border-[#E9E9E9] mx-[30px]" /> 
        <div className="flex flex-row justify-between px-[30px] mt-[20px] mb-[80px] text-[#9A9A9A]">          
          <div className="md:text-sm text-xs">
            {new Date().getFullYear()} © DIGITEFA Dashboard
          </div>
          <div className="flex-grow" />
          <div className="flex space-x-4 text-[#9A9A9A]">
            <a href={aboutClientsideUrl}>About</a>
            <a href={privacypolicyClientsideUrl}>Terms & Conditions</a>
            <a href={privacypolicyClientsideUrl}>Privacy Policy</a>
          </div>
        </div>
      </div>
    );
  }
  