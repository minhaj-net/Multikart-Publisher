# Multikart Electronics One - Standalone

Modern e-commerce platform for electronics products built with Next.js 15.

## Features
- Electronics-focused product catalog
- Shopping cart and checkout
- User authentication and account management
- Product search and filtering
- Responsive design
- Multi-language support (i18n)

## Tech Stack
- **Frontend:** Next.js 15, React 19
- **Styling:** Bootstrap 5, SCSS
- **State Management:** React Context API
- **API Client:** Axios
- **Form Handling:** Formik + Yup

## Getting Started

### Prerequisites
- Node.js 18+ 
- Backend API running on port 5000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app router
│   └── (mainBody)/        # Main layout routes
├── components/
│   ├── themes/
│   │   ├── electronics/   # Electronics One theme
│   │   └── widgets/       # Shared widgets
│   ├── auth/              # Authentication components
│   ├── cart/              # Cart components
│   ├── productDetails/    # Product detail components
│   └── ...
├── context/               # React Context providers
├── layout/                # Header, Footer, Sidebar
├── utils/                 # Utilities, hooks, API
└── data/                  # Static data, configurations

public/
└── assets/               # Images, fonts, SCSS
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_NAME=Electronics Store
NEXT_PUBLIC_DEFAULT_THEME=electronics_one
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

This frontend requires a backend API with these endpoints:

- `GET /api/home/electronics_one` - Home page data
- `GET /api/products` - Product listing
- `GET /api/products/:slug` - Product details
- `GET /api/categories` - Categories
- `GET /api/brands` - Brands
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `POST /api/checkout` - Checkout

## Customization

### Change Colors
Edit `public/assets/scss/utils/_variables.scss`

### Change Logo
Replace `public/assets/images/logo/logo.png`

### Change Home Page Layout
Edit `src/components/themes/electronics/electronicsOne/index.jsx`

## License

Private - All rights reserved
