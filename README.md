# 🍽️ Food Delivery Web Application

A complete food delivery platform where users can search for food and restaurants by location, place orders, and pay securely. Admins and restaurant owners can manage menus, track orders, and monitor performance.

---

## 🌐 Live Demo

👉 [Live Site](https://foodhub-d3e1e.web.app/)

---

## 📸 Screenshots
 Home Page 

 ![Home](https://i.ibb.co/JRSSWMgz/image.png) 

---

## 🔥 Key Features

### ✅ User
- Register/Login with JWT
- Search food/restaurants with location filter (Division → District → Upazila)
- Add/remove items from cart
- Quantity update auto-saves
- Checkout with Stripe & SSLCOMMERZ
- View order history & profile

### ✅ Restaurant Owner
- Upload restaurant info (name, district, category, image)
- Add/update/delete menu items
- View and manage orders
- Owner-only dashboard

### ✅ Admin/Moderator
- Manage all users
- Assign roles (Admin, Moderator, Owner, User)
- Delete accounts
- Manage all restaurants and food items

---

## 🛠️ Tech Stack

### Frontend
- React.js (with Vite)
- Tailwind CSS + Material Tailwind
- React Router DOM
- Axios, React Query
- React Hook Form
- Framer Motion
- react-loading-skeleton
## Projects Structure 
├── .firebase
    └── hosting.ZGlzdA.cache
├── .firebaserc
├── .gitignore
├── README.md
├── eslint.config.js
├── firebase.json
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
    ├── District-Upzilas.json
    └── vite.svg
├── src
    ├── App.css
    ├── App.jsx
    ├── Components
    │   ├── About
    │   │   └── About
    │   │   │   └── About.jsx
    │   ├── Auth
    │   │   ├── Login
    │   │   │   └── Login.jsx
    │   │   ├── Register
    │   │   │   └── Register
    │   │   │   │   └── Register.jsx
    │   │   ├── ResetPassword
    │   │   │   └── ResetPassword.jsx
    │   │   └── RestaurantRegister
    │   │   │   └── RestaurantRegister.jsx
    │   ├── Darkmode
    │   │   └── Darkmode.jsx
    │   ├── Dashboard
    │   │   ├── AddDistrictCollection
    │   │   │   └── AddDistrictCollection.jsx
    │   │   ├── AddFoods
    │   │   │   └── AddFoods.jsx
    │   │   ├── AdminHome
    │   │   │   └── AdminHome.jsx
    │   │   ├── CheckoutForm
    │   │   │   ├── CheckoutForm.jsx
    │   │   │   ├── SSLCommerzPayment
    │   │   │   │   └── SSLCommerzPayment.jsx
    │   │   │   └── StripePayment
    │   │   │   │   └── StripePayment.jsx
    │   │   ├── Dashboard
    │   │   │   └── Dashboard.jsx
    │   │   ├── ManageMenu
    │   │   │   └── ManageMenu.jsx
    │   │   ├── ModeratorHome
    │   │   │   └── ModeratorHome.jsx
    │   │   ├── MyOrder
    │   │   │   └── MyOrder.jsx
    │   │   ├── Orders
    │   │   │   └── Orders.jsx
    │   │   ├── OwnerHome
    │   │   │   └── OwnerHome.jsx
    │   │   ├── PaymentHistory
    │   │   │   └── PaymentHistory.jsx
    │   │   ├── PaymentPage
    │   │   │   ├── PaymentPage.jsx
    │   │   │   └── StripeCheckOutForm.jsx
    │   │   ├── PaymentSuccess
    │   │   │   └── PaymentSuccess.jsx
    │   │   ├── Profle
    │   │   │   └── Profile.jsx
    │   │   ├── Revenue
    │   │   │   └── Revenue.jsx
    │   │   ├── RevenueDetails
    │   │   │   └── RevenueDetails.jsx
    │   │   ├── Review
    │   │   │   ├── FoodReviewModal.jsx
    │   │   │   └── RestaurantReviewModal.jsx
    │   │   ├── Reviews
    │   │   │   └── Reviews.jsx
    │   │   ├── RrestaurantProfile
    │   │   │   └── RrestaurantProfile.jsx
    │   │   ├── UpdateFood
    │   │   │   └── UpdateFood.jsx
    │   │   ├── UpdateFoodModal
    │   │   │   └── UpdateFoodModal.jsx
    │   │   ├── UploadInfo
    │   │   │   └── UploadInfo.jsx
    │   │   ├── UserHome
    │   │   │   └── UserHome.jsx
    │   │   └── Users
    │   │   │   └── Users.jsx
    │   ├── Footer
    │   │   └── Footer.jsx
    │   ├── Home
    │   │   ├── AvailableItem
    │   │   │   └── AvailableItem.jsx
    │   │   ├── Banner
    │   │   │   └── Banner.jsx
    │   │   ├── BannerTwo
    │   │   │   └── BannerTwo.jsx
    │   │   ├── Beef
    │   │   │   └── Beef.jsx
    │   │   ├── Biryani
    │   │   │   └── Biryani.jsx
    │   │   ├── Cake
    │   │   │   └── Cake.jsx
    │   │   ├── Chinese
    │   │   │   └── Chinese.jsx
    │   │   ├── Delivery
    │   │   │   └── Delivery.jsx
    │   │   ├── DistrictAvailable
    │   │   │   ├── DistrictAvailable
    │   │   │   │   └── DistrictAvailable.jsx
    │   │   │   └── DistrictRes
    │   │   │   │   └── DistrictRes.jsx
    │   │   ├── Food
    │   │   │   └── Food.jsx
    │   │   ├── Home
    │   │   │   ├── Burger
    │   │   │   │   └── Burger.jsx
    │   │   │   ├── Chicken
    │   │   │   │   └── Chicken.jsx
    │   │   │   ├── Coffee
    │   │   │   │   └── Coffee.jsx
    │   │   │   └── Home.jsx
    │   │   ├── Juice
    │   │   │   └── Juice.jsx
    │   │   ├── Pizza
    │   │   │   └── Pizza.jsx
    │   │   ├── RatingSlider
    │   │   │   └── RatingSlider.jsx
    │   │   ├── ServeFood
    │   │   │   └── ServeFood.jsx
    │   │   └── bannerFour
    │   │   │   └── BannerFour.jsx
    │   ├── Hooks
    │   │   ├── imageHooks.jsx
    │   │   ├── useAddFood.jsx
    │   │   ├── useAdmin.jsx
    │   │   ├── useAllUserHooks.jsx
    │   │   ├── useAuth.jsx
    │   │   ├── useAxiosPublic.jsx
    │   │   ├── useAxiosSecure.jsx
    │   │   ├── useModerator.jsx
    │   │   ├── useOwnerUser.jsx
    │   │   ├── useRestaurantData.jsx
    │   │   ├── useRestaurantOrders.jsx
    │   │   ├── useRestaurantOwner.jsx
    │   │   └── useUploadInfo.jsx
    │   ├── Main
    │   │   └── Main.jsx
    │   ├── MyProfile
    │   │   └── MyProfile
    │   │   │   ├── MyProfile.jsx
    │   │   │   └── ProgressBar.jsx
    │   ├── Navbar
    │   │   ├── Navbar.jsx
    │   │   └── Search
    │   │   │   └── Serach.jsx
    │   ├── Provider
    │   │   └── AuthProvider
    │   │   │   └── AuthProvider.jsx
    │   ├── Restaurants
    │   │   ├── DetailsRestaurants
    │   │   │   └── DeatilsRestaurants.jsx
    │   │   ├── RestaurantBanner
    │   │   │   └── RestaurantBanner.jsx
    │   │   ├── Restaurants
    │   │   │   └── Restaurants.jsx
    │   │   ├── RestaurantsCard
    │   │   │   └── RestaurantsCard.jsx
    │   │   └── RestaurentBannerTwo
    │   │   │   └── RestaurentBannerTwo.jsx
    │   └── Routes
    │   │   ├── AdminRoutes
    │   │       └── AdminRoutes.jsx
    │   │   ├── PrivateRoutes
    │   │       └── PrivateRoutes.jsx
    │   │   ├── RestaurantPage
    │   │       └── RestaurantPage.jsx
    │   │   └── Routes
    │   │       └── Routes.jsx
    ├── ErrorElement
    │   ├── ErrorElement.jsx
    │   └── FuzzyText.jsx
    ├── Firebase
    │   └── firebase.config.js
    ├── assets
    │   ├── HOME1.png
    │   ├── Infan_Resume (5).pdf
    │   ├── RestaurantBanner
    │   │   ├── RestaurantBanner2.png
    │   │   ├── RestaurantBanner3.png
    │   │   ├── RestaurantBanner4.png
    │   │   └── logo.png
    │   ├── facebook-1-svgrepo-com.svg
    │   ├── foodlogo.png
    │   ├── freepik__candid-image-photography-natural-textures-highly-r__84978-removebg-preview.png
    │   ├── home_4517933.png
    │   └── react.svg
    ├── index.css
    └── main.jsx
├── tailwind.config.js
└── vite.config.js
### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Stripe Payment API
- SSLCOMMERZ Payment Gateway

---


