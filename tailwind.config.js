// const withMT = require("@material-tailwind/react/utils/withMT");

// module.exports = withMT({
//  
// theme: {
// extend: {},
// },
// 
// });

const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: [
       "./index.html",
         "./src/**/*.{js,ts,jsx,tsx}",
         ],
         theme: {
          fontFamily: {
            Kanit : ["Kanit" , "sans-serif"],
            Caveat : ["Caveat" , "sans-serif"]
          }
        },
  plugins: [require("daisyui")],
});
