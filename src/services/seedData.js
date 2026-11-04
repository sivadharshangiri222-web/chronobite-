export const INITIAL_USERS = [
  {
    id: "usr_cust_1",
    email: "customer@chronobite.com",
    full_name: "Aarav Sharma",
    role: "user",
    data: {
      app_role: "customer",
      phone: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    }
  },
  {
    id: "usr_rest_1",
    email: "spicegarden@chronobite.com",
    full_name: "Priya Nair",
    role: "user",
    data: {
      app_role: "restaurant",
      restaurant_id: "rest_1",
      phone: "+91 98220 12345",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
    }
  },
  {
    id: "usr_deliv_1",
    email: "vikram@chronobite.com",
    full_name: "Vikram Singh",
    role: "user",
    data: {
      app_role: "delivery_partner",
      restaurant_id: "rest_1",
      phone: "+91 91234 56789",
      vehicle: "Honda Activa 6G (KA 03 EN 4492)",
      rating: 4.9,
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80"
    }
  },
  {
    id: "usr_admin_1",
    email: "admin@chronobite.com",
    full_name: "Dev Platform Admin",
    role: "admin",
    data: {
      app_role: "admin",
      phone: "+91 99999 00000",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    }
  }
];

export const INITIAL_RESTAURANTS = [
  {
    id: "rest_1",
    name: "The Royal Biryani & Kebab Co.",
    cuisine: "Hyderabadi, Mughlai, Kebabs, Biryani",
    description: "Authentic dum biryanis cooked on slow charcoal flame with aromatic aged Basmati rice.",
    rating: 4.8,
    reviews_count: "2.4K+",
    delivery_time: "25-30 mins",
    distance: "2.4 km",
    discount: "60% OFF up to ₹120",
    cover_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80",
    image_url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=300&q=80",
    address: "100ft Road, Near Sony World Signal, Koramangala 4th Block, Bangalore",
    phone: "+91 80 4123 9081",
    price_level: "$$",
    cost_for_two: "₹450 for two",
    enabled: true,
    owner_id: "usr_rest_1",
    latitude: 12.9345,
    longitude: 77.6265,
    tags: ["Bestseller", "Pure Basmati", "Koramangala Favorite"]
  },
  {
    id: "rest_2",
    name: "Bella Roma Wood-Fired Pizzeria",
    cuisine: "Italian, Neapolitan Pizzas, Pasta, Desserts",
    description: "Handcrafted 48-hour fermented sourdough crust baked in a 450°C Italian wood-fired oven.",
    rating: 4.7,
    reviews_count: "1.8K+",
    delivery_time: "20-25 mins",
    distance: "1.8 km",
    discount: "Flat ₹100 OFF above ₹499",
    cover_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80",
    image_url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80",
    address: "12th Main Road, HAL 2nd Stage, Indiranagar, Bangalore",
    phone: "+91 80 2521 8844",
    price_level: "$$$",
    cost_for_two: "₹750 for two",
    enabled: true,
    owner_id: "usr_rest_2",
    latitude: 12.9719,
    longitude: 77.6412,
    tags: ["Gourmet", "Wood-fired", "Italian Cheese"]
  },
  {
    id: "rest_3",
    name: "Dragon Wok & Dimsum Club",
    cuisine: "Pan-Asian, Chinese, Dimsums, Ramen",
    description: "Sizzling wok bowls, handmade crystal dimsums, and aromatic spicy chili garlic noodles.",
    rating: 4.5,
    reviews_count: "950+",
    delivery_time: "30-35 mins",
    distance: "3.1 km",
    discount: "Free Delivery Above ₹299",
    cover_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80",
    image_url: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=300&q=80",
    address: "5th Block, CMH Road, Indiranagar, Bangalore",
    phone: "+91 80 4390 1122",
    price_level: "$$",
    cost_for_two: "₹500 for two",
    enabled: true,
    owner_id: "usr_rest_3",
    latitude: 12.9784,
    longitude: 77.6408,
    tags: ["Authentic Asian", "Dim Sum Special"]
  },
  {
    id: "rest_4",
    name: "Burger Crave & Loaded Fries",
    cuisine: "American, Gourmet Burgers, Thick Shakes, Wings",
    description: "Smash burgers with crispy lace edges, brioche buns, melted cheddar, and secret house dip.",
    rating: 4.6,
    reviews_count: "3.1K+",
    delivery_time: "15-20 mins",
    distance: "1.2 km",
    discount: "BUY 1 GET 1 FREE on Big Burgers",
    cover_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80",
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80",
    address: "Double Road, Shanti Nagar, Bangalore",
    phone: "+91 80 2233 4455",
    price_level: "$",
    cost_for_two: "₹350 for two",
    enabled: true,
    owner_id: "usr_rest_4",
    latitude: 12.9550,
    longitude: 77.5980,
    tags: ["Superfast", "Brioche Buns", "Crispy Fries"]
  },
  {
    id: "rest_5",
    name: "Sweet Indulgence Bakery & Patisserie",
    cuisine: "Desserts, Pastries, Cheesecakes, Artisan Breads",
    description: "Belgian chocolate truffle cakes, New York style baked cheesecakes, and flaky croissants.",
    rating: 4.9,
    reviews_count: "1.2K+",
    delivery_time: "20-25 mins",
    distance: "2.0 km",
    discount: "40% OFF up to ₹80",
    cover_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80",
    image_url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=300&q=80",
    address: "Lavelle Road, Shanthala Nagar, Bangalore",
    phone: "+91 80 4099 2200",
    price_level: "$$",
    cost_for_two: "₹400 for two",
    enabled: true,
    owner_id: "usr_rest_5",
    latitude: 12.9698,
    longitude: 77.5995,
    tags: ["Pure Belgian Chocolate", "Fresh Bakes"]
  },
  {
    id: "rest_6",
    name: "Green Leaf Pure Veg Heritage",
    cuisine: "South Indian, North Indian, Thalis, Pure Veg",
    description: "Pure vegetarian delicacies prepared with ghee, fresh paneer, and authentic regional recipes.",
    rating: 4.5,
    reviews_count: "4.2K+",
    delivery_time: "25-30 mins",
    distance: "2.8 km",
    discount: "20% OFF on Family Meals",
    cover_url: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=1000&q=80",
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80",
    address: "Gandhi Bazaar Main Rd, Basavanagudi, Bangalore",
    phone: "+91 80 2661 7733",
    price_level: "$",
    cost_for_two: "₹300 for two",
    enabled: true,
    owner_id: "usr_rest_6",
    latitude: 12.9430,
    longitude: 77.5730,
    tags: ["100% Pure Veg", "Desi Ghee", "Iconic Thali"]
  }
];

export const INITIAL_FOOD_ITEMS = [
  // Restaurant 1: The Royal Biryani & Kebab Co.
  {
    id: "food_1",
    restaurant_id: "rest_1",
    name: "Royal Murg Dum Biryani (Chef Special)",
    description: "Tender chicken marinated in roasted ground spices and yogurt, slow-cooked in sealed handi with fragrant aged basmati.",
    price: 349,
    category: "Biryani & Rice",
    is_veg: false,
    rating: 4.9,
    votes: 820,
    image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    bestseller: true,
    enabled: true
  },
  {
    id: "food_2",
    restaurant_id: "rest_1",
    name: "Shahi Paneer Dum Biryani",
    description: "Marinated cubes of fresh cottage cheese, golden fried onions, mint, and saffron milk layered with basmati rice.",
    price: 299,
    category: "Biryani & Rice",
    is_veg: true,
    rating: 4.7,
    votes: 450,
    image_url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80",
    bestseller: true,
    enabled: true
  },
  {
    id: "food_3",
    restaurant_id: "rest_1",
    name: "Galouti Mutton Kebabs (4 Pcs)",
    description: "Mouth-melting minced lamb kebabs with 32 secret Lucknowi spices, served with mint chutney and roomali roti.",
    price: 389,
    category: "Starters & Kebabs",
    is_veg: false,
    rating: 4.8,
    votes: 310,
    image_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80",
    bestseller: false,
    enabled: true
  },
  {
    id: "food_4",
    restaurant_id: "rest_1",
    name: "Dahi Ke Kebab (Crispy Golden)",
    description: "Silky spiced hung curd patties with roasted peppers and crushed coriander, fried to crisp perfection.",
    price: 249,
    category: "Starters & Kebabs",
    is_veg: true,
    rating: 4.6,
    votes: 190,
    image_url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80",
    bestseller: false,
    enabled: true
  },
  {
    id: "food_5",
    restaurant_id: "rest_1",
    name: "Gulab Jamun with Rabri Handi",
    description: "Warm golden fried mawa dumplings immersed in rose-cardamom sugar syrup, topped with chilled malai rabri.",
    price: 159,
    category: "Desserts & Sides",
    is_veg: true,
    rating: 4.9,
    votes: 560,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    bestseller: false,
    enabled: true
  },

  // Restaurant 2: Bella Roma Wood-Fired Pizzeria
  {
    id: "food_6",
    restaurant_id: "rest_2",
    name: "Classic Margherita DOP",
    description: "San Marzano tomato sauce, fresh buffalo mozzarella, fresh basil leaves, and extra virgin Italian olive oil.",
    price: 429,
    category: "Neapolitan Pizzas",
    is_veg: true,
    rating: 4.8,
    votes: 670,
    image_url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
    bestseller: true,
    enabled: true
  },
  {
    id: "food_7",
    restaurant_id: "rest_2",
    name: "Diavola Spicy Pepperoni",
    description: "Smoked spicy pork pepperoni slices, crushed red pepper flakes, fresh oregano, and creamy fior di latte mozzarella.",
    price: 549,
    category: "Neapolitan Pizzas",
    is_veg: false,
    rating: 4.9,
    votes: 910,
    image_url: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
    bestseller: true,
    enabled: true
  },
  {
    id: "food_8",
    restaurant_id: "rest_2",
    name: "Truffle Mushroom Fettuccine",
    description: "Al dente egg pasta tossed with wild porcini mushrooms, black truffle butter, and 24-month aged Parmigiano Reggiano.",
    price: 489,
    category: "Handmade Pastas",
    is_veg: true,
    rating: 4.7,
    votes: 280,
    image_url: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
    bestseller: false,
    enabled: true
  },
  {
    id: "food_9",
    restaurant_id: "rest_2",
    name: "Classic Italian Tiramisu",
    description: "Savoiardi ladyfingers soaked in dark espresso and marsala, layered with whipped mascarpone cream and Valrhona cocoa.",
    price: 269,
    category: "Desserts & Sides",
    is_veg: true,
    rating: 4.9,
    votes: 420,
    image_url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
    bestseller: true,
    enabled: true
  },

  // Restaurant 4: Burger Crave & Loaded Fries
  {
    id: "food_10",
    restaurant_id: "rest_4",
    name: "Double Bacon Smash Cheeseburger",
    description: "Two crispy smashed beef-style patties, double cheddar cheese, caramelized onions, dill pickles, and secret burger sauce.",
    price: 299,
    category: "Gourmet Burgers",
    is_veg: false,
    rating: 4.8,
    votes: 1100,
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    bestseller: true,
    enabled: true
  },
  {
    id: "food_11",
    restaurant_id: "rest_4",
    name: "Crispy Peri Peri Paneer Crunch",
    description: "Golden crumbed cottage cheese patty tossed in fiery peri-peri spices, lettuce, jalapeños, and smoked paprika mayo.",
    price: 229,
    category: "Gourmet Burgers",
    is_veg: true,
    rating: 4.6,
    votes: 740,
    image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
    bestseller: false,
    enabled: true
  },
  {
    id: "food_12",
    restaurant_id: "rest_4",
    name: "Animal Style Loaded Truffle Fries",
    description: "Skin-on crispy fries smothered with melted cheese, caramelized onions, chopped jalapeños, and smoky barbecue drizzle.",
    price: 189,
    category: "Sides & Shakes",
    is_veg: true,
    rating: 4.7,
    votes: 530,
    image_url: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80",
    bestseller: true,
    enabled: true
  }
];

export const INITIAL_ADDRESSES = [
  {
    id: "addr_1",
    customer_id: "usr_cust_1",
    label: "Home",
    full_address: "Flat 402, Skyline Heights, 12th Main Road, HAL 2nd Stage, Indiranagar",
    city: "Bangalore",
    landmark: "Behind Sony World & Toit Brewpub",
    phone: "+91 98765 43210",
    latitude: 12.9716,
    longitude: 77.6413,
    is_default: true
  },
  {
    id: "addr_2",
    customer_id: "usr_cust_1",
    label: "Work",
    full_address: "WeWork Galaxy, 43 Residency Rd, Shanthala Nagar, Ashok Nagar",
    city: "Bangalore",
    landmark: "Opposite Bangalore Club",
    phone: "+91 98765 43210",
    latitude: 12.9698,
    longitude: 77.5995,
    is_default: false
  }
];

export const INITIAL_DELIVERY_PARTNERS = [
  {
    id: "dp_1",
    user_id: "usr_deliv_1",
    restaurant_id: "rest_1",
    name: "Vikram Singh",
    email: "vikram@chronobite.com",
    phone: "+91 91234 56789",
    vehicle: "Honda Activa 6G (KA 03 EN 4492)",
    status: "active",
    current_order_id: null,
    rating: 4.9,
    total_deliveries: 342,
    latitude: 12.9520,
    longitude: 77.6320,
    location_updated_at: new Date().toISOString()
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ord_1001",
    customer_id: "usr_cust_1",
    restaurant_id: "rest_1",
    order_type: "delivery",
    delivery_partner_id: "dp_1",
    status: "out_for_delivery",
    total_amount: 547,
    address_id: "addr_1",
    notes: "Please do not ring the doorbell. Keep package at door.",
    restaurant_name: "The Royal Biryani & Kebab Co.",
    customer_name: "Aarav Sharma",
    customer_phone: "+91 98765 43210",
    delivery_address: "Flat 402, Skyline Heights, 12th Main Road, HAL 2nd Stage, Indiranagar, Bangalore",
    customer_lat: 12.9716,
    customer_lng: 77.6413,
    restaurant_lat: 12.9345,
    restaurant_lng: 77.6265,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status_updated_at: new Date().toISOString(),
    items: [
      {
        food_id: "food_1",
        name: "Royal Murg Dum Biryani (Chef Special)",
        price: 349,
        quantity: 1
      },
      {
        food_id: "food_5",
        name: "Gulab Jamun with Rabri Handi",
        price: 159,
        quantity: 1
      }
    ]
  },
  {
    id: "ord_1002",
    customer_id: "usr_cust_1",
    restaurant_id: "rest_2",
    order_type: "delivery",
    delivery_partner_id: null,
    status: "delivered",
    total_amount: 768,
    address_id: "addr_1",
    notes: "Leave with security.",
    restaurant_name: "Bella Roma Wood-Fired Pizzeria",
    customer_name: "Aarav Sharma",
    customer_phone: "+91 98765 43210",
    delivery_address: "Flat 402, Skyline Heights, 12th Main Road, HAL 2nd Stage, Indiranagar, Bangalore",
    customer_lat: 12.9716,
    customer_lng: 77.6413,
    restaurant_lat: 12.9719,
    restaurant_lng: 77.6412,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status_updated_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        food_id: "food_6",
        name: "Classic Margherita DOP",
        price: 429,
        quantity: 1
      },
      {
        food_id: "food_9",
        name: "Classic Italian Tiramisu",
        price: 269,
        quantity: 1
      }
    ]
  }
];
