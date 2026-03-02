import { Layout } from "antd";
import { useState, useEffect } from "react";
import Logo from "../../assets/svg/Digitefaa.svg";

const BigData = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const WORDCLOUD_URL = import.meta.env.VITE_WORDCLOUD_URL;

  useEffect(() => {
    // Fetch gambar WordCloud dari API
    fetch(WORDCLOUD_URL)
      .then((response) => response.blob()) // Mengambil gambar sebagai blob
      .then((imageBlob) => {
        // Membuat URL gambar untuk ditampilkan
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setImageSrc(imageObjectURL);
        console.log(imageBlob)
      })
      .catch((error) => console.error("Error fetching the image:", error));
  }, []);

  return (
    <Layout className="bg-white px-2 md:px-12 pb-24">
      <div className="text-center mb-12">
        <h2 className="text-2xl text-[24px] md:text-[48px] font-medium">
          Big Data
          <span className="inline-block mx-2">
            <img
              src={Logo}
              alt="Digitefa Logo"
              className="inline w-[96px] md:w-auto md:h-auto md:ml-2"
            />
          </span>
        </h2>
      </div>
      <div className="flex justify-center items-center mx-4 md:mx-1">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="WordCloud"
            style={{ width: "100%", maxWidth: "800px" }}
          />
        ) : (
          <p>Loading WordCloud...</p>
        )}
      </div>
    </Layout>
  );
};

export default BigData;
