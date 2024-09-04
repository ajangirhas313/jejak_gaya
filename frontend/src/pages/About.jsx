import { useEffect } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

export default function About() {
  const token = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token && jwtDecode(token).role !== "customer") {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col font-playwrite">
      <Header />
      <div className="flex-grow max-w-5xl mx-auto py-10 px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-sky-800">Tentang Kami</h2>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed font-nerko">
            Selamat datang di toko sepatu kami! Kami berkomitmen untuk menyediakan sepatu terbaik untuk setiap kesempatan, dengan fokus pada kenyamanan, kualitas, dan gaya. Koleksi kami mencakup berbagai jenis sepatu yang cocok untuk segala kebutuhan Anda.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <img
            src="https://static.nike.com/a/images/f_auto/fdfe7f2c-60a3-427f-ba30-189de1a82764/image.jpg"
            alt="Toko Kami"
            className="rounded-lg shadow-lg w-full max-w-md"
          />
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-sky-800">Cerita Kami</h3>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed font-nerko">
            Berdiri dengan semangat untuk sepatu, kami memulai perjalanan ini dengan misi untuk menciptakan toko yang menawarkan beragam pilihan sepatu yang memenuhi kebutuhan semua pelanggan. Kami percaya bahwa sepatu yang tepat dapat mengubah hari Anda dan meningkatkan rasa percaya diri Anda.
          </p>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-sky-800">Komitmen Kami</h3>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed font-nerko">
            Kami berkomitmen untuk menyediakan sepatu berkualitas tinggi, nyaman, dan bergaya dengan harga terjangkau. Kami memilih produk kami dengan cermat untuk memastikan memenuhi standar tinggi kami, dan selalu memperbarui koleksi dengan tren terbaru.
          </p>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-sky-800">Mengapa Memilih Kami?</h3>
          <ul className="mt-4 text-lg text-gray-700 list-disc list-inside leading-relaxed font-nerko">
            <li>Beragam gaya untuk semua kesempatan</li>
            <li>Fokus pada kenyamanan dan kualitas</li>
            <li>Harga yang terjangkau</li>
            <li>Layanan pelanggan yang prima</li>
          </ul>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-sky-800">Kenali Tim Kami</h3>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed font-nerko">
            Tim kami sangat bersemangat untuk membantu Anda menemukan sepatu yang sempurna. Kami berkomitmen untuk memberikan pengalaman belanja yang personal dan selalu siap membantu Anda.
          </p>
          <div className="mt-6 flex justify-center">
            <img
              src="/foto.png"
              alt="Tim Kami"
              className="rounded-lg shadow-lg w-full max-w-md"
            />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-semibold text-sky-800">Tetap Terhubung</h3>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed font-nerko">
            Ikuti kami di media sosial untuk mendapatkan informasi terbaru tentang koleksi, penawaran, dan acara kami. Kami senang menjadi bagian dari perjalanan sepatu Anda!
          </p>
        </div>
      </div>
    </div>
  );
}
