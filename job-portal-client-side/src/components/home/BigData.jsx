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

  return null;
};

export default BigData;
