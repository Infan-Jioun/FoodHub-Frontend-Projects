import facebook from '../../assets/facebook-1-svgrepo-com.svg';

const Footer = () => {
  return (
    <footer className="bg-[#ff0000d8] text-white p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Branding & About */}
        <div>
          <h3 className="text-2xl font-bold mb-4">FOODHUB</h3>
          <p className="mb-4">
            Delivering delicious meals from your favorite local restaurants right to your door.
          </p>
          <p className="text-sm text-white">© 2025 Foodhub. All rights reserved.</p>
        </div>

        {/* Quick Links */}
        <nav>
          <h6 className=" mb-4 font-semibold">Quick Links</h6>
          <ul className="space-y-2 text-white">
            <li><a href="/restaurants" className="">Restaurants</a></li>
            <li><a href="/about" className="">About Us</a></li>
            <li><a href="/contact" className="">Contact</a></li>
           
          </ul>
        </nav>

        {/* Customer Service */}
        <nav>
          <h6 className=" mb-4 font-semibold">Customer Service</h6>
          <ul className="space-y-2 text-white">
            <li><a href="/terms" className="">Terms of Use</a></li>
            <li><a href="/privacy" className="">Privacy Policy</a></li>
            <li><a href="/support" className="">Support</a></li>
          </ul>
        </nav>

        {/* Social & Contact */}
        <div>
          <h6 className=" mb-4 font-semibold">Connect with Us</h6>
          <div className="flex space-x-4 mb-4">
            {/* Facebook icon from imported SVG */}
            <a href="https://facebook.com/foodhub" target="_blank" rel="noreferrer" aria-label="Facebook">
              <img src={facebook} alt="Facebook" className="w-6 h-6 hover:opacity-80" />
            </a>

            {/* Twitter icon */}
            <a href="https://twitter.com/foodhub" target="_blank" rel="noreferrer" aria-label="Twitter" className="">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>

            {/* Instagram icon */}
            <a href="https://instagram.com/foodhub" target="_blank" rel="noreferrer" aria-label="Instagram" className="">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5a5.75 5.75 0 015.75 5.75v8.5a5.75 5.75 0 01-5.75 5.75h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 2A3.75 3.75 0 004 7.75v8.5A3.75 3.75 0 007.75 20h8.5a3.75 3.75 0 003.75-3.75v-8.5A3.75 3.75 0 0016.25 4h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm4.5-.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z"/>
              </svg>
            </a>
          </div>
          <p className="text-white text-sm">
            Phone: <a href="tel:+1234567890" className="">+1 (234) 567-890</a><br />
            Email: <a href="mailto:support@foodhub.com" className="">support@foodhub.com</a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
