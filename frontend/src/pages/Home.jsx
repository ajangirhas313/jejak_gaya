import { useEffect } from "react";
import MultipleItems from "../components/Slider";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  if (token && jwtDecode(Cookies.get("token")).role !== "customer")
    useEffect(() => {
      navigate("/admin");
    });
  else
    return (
      <div className="text-center">
        <Header className=".protest-guerrilla-regular" />

        <div
          className="relative bg-cover bg-center h-[500px] flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/25ae6e106148471.5f890a5067f12.jpg')",
          }}
        >
          <div className="bg-black bg-opacity-50 p-6 rounded-md text-white">
            <h1 className="text-5xl font-bold mb-4 font-protest">
              Discover the Latest Collection
            </h1>
            <p className="text-lg proquest-guerrilla-regular font-poppins">
              Step into comfort and style with our new arrivals.
            </p>
          </div>
        </div>

        {/* Slider / Carousel */}
        <div className="mt-10">
          <MultipleItems />
        </div>

        {/* Showcase Products */}
        <div className="mt-16 px-4">
          <h2 className="text-3xl font-bold mb-6 font-protest">Our Best Sellers</h2>
          <Link to={"/products"}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "https://static.nike.com/a/images/w_1536,c_limit/34a00680-c623-4bfd-ad5e-45d16b8a7efe/image.jpg",
                "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/49545dac-67b5-4c49-b82f-83dcd07b375a/AIR+ZOOM+PEGASUS+41+OLY.png",
                "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/ef86474c-deca-40f5-9d7b-4813f76a3554/WMNS+AIR+MAX+90.png",
                "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/f96acedf-ad07-44b8-a04e-e3b47a33b511/W+AIR+MAX+90.png",
                "https://c.static-nike.com/a/images/f_auto,cs_srgb/w_1536,c_limit/g1ljiszo4qhthfpluzbt/123-joyride-cdp-apla-xa-xp.jpg",
                "https://im.berrybenka.com/assets/upload/product/zoom/50891_nike-air-max-2015-womens-running-shoes-black_black_Q2MKZ.jpg",
              ].map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Best Seller ${index + 1}`}
                  className="w-full h-[500px] object-cover rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out"
                />
              ))}
            </div>
          </Link>
        </div>

        {/* Footer Promo Section */}
        <div className="mt-16 py-10 bg-gradient-to-r from-sky-300 to-sky-500 text-white font-protest">
          <h2 className="text-4xl font-bold mb-4">Exclusive Offer!</h2>
          <p className="text-lg">
            Sign up now and get 20% off your first purchase!
          </p>
          <Link to={"/products"}>
            <button className="mt-6 bg-white text-blue-500 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors duration-300">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    );
}
