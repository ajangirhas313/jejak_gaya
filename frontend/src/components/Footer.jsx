import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-sky-400 to-sky-500 py-8 text-white">
      <div className="container mx-auto px-6 lg:px-8 flex flex-col items-center space-y-4">
        {/* Footer Information */}
        <div className="text-center">
          <p className="text-sm font-semibold">
            © 2024 Jejak-Gaya. All rights reserved.
          </p>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-6">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-200 transition-colors duration-300"
            aria-label="Facebook"
          >
            <Facebook size={28} />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-200 transition-colors duration-300"
            aria-label="Twitter"
          >
            <Twitter size={28} />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-200 transition-colors duration-300"
            aria-label="Instagram"
          >
            <Instagram size={28} />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-200 transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin size={28} />
          </a>
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <p className="text-sm">
            Contact us:{" "}
            <a
              href="mailto:info@jejakgaya.gmail.com"
              className="underline hover:text-sky-200 transition-colors duration-300"
            >
              info@jejakgaya@gmailx``.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
