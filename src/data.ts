import type { Flight, Hotel } from "./types";

export const hotels: Hotel[] = [
  {
    id: "hotel-1",
    name: "Golden City Hotel",
    city: "Riyadh",
    country: "Saudi Arabia",
    description:
      "Luxury hotel in the heart of Riyadh with premium services and stunning views.",
    amenities: ["Free Wi-Fi", "Pool", "Restaurant", "Fitness Center"],
    pricePerNight: 420,
    rating: 4.7,
    reviewCount: 180,
    image:
      "https://assets.sharikatmubasher.com/news/21406948.png",
    rooms: [
      {
        id: "room-1",
        type: "Standard Room",
        capacity: 2,
        pricePerNight: 420,
        description: "Comfortable room with a large bed and Wi-Fi access.",
      },
      {
        id: "room-2",
        type: "Suite",
        capacity: 4,
        pricePerNight: 680,
        description: "Spacious suite with seating area and excellent views.",
      },
    ],
  },
  {
    id: "hotel-2",
    name: "Red Sea Resort",
    city: "Jeddah",
    country: "Saudi Arabia",
    description:
      "A peaceful resort on the Red Sea with private beach access and spa facilities.",
    amenities: ["Private Beach", "Spa", "Family Rooms", "Fine Dining"],
    pricePerNight: 550,
    rating: 4.8,
    reviewCount: 210,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    rooms: [
      {
        id: "room-3",
        type: "Sea View Suite",
        capacity: 3,
        pricePerNight: 910,
        description: "Full sea view with a private balcony.",
      },
      {
        id: "room-4",
        type: "Double Room",
        capacity: 2,
        pricePerNight: 550,
        description: "Elegant and comfortable room for travelers.",
      },
    ],
  },
  {
    id: "hotel-3",
    name: "Oasis Hotel",
    city: "Dammam",
    country: "Saudi Arabia",
    description:
      "A modern, comfortable hotel ideal for business travelers and airline guests.",
    amenities: [
      "High-speed Wi-Fi",
      "Parking",
      "Breakfast Buffet",
      "Meeting Rooms",
    ],
    pricePerNight: 330,
    rating: 4.4,
    reviewCount: 97,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
    rooms: [
      {
        id: "room-5",
        type: "Executive Room",
        capacity: 2,
        pricePerNight: 330,
        description: "A work-friendly room with a desk.",
      },
      {
        id: "room-6",
        type: "Junior Suite",
        capacity: 3,
        pricePerNight: 470,
        description: "Cozy suite with extra seating space.",
      },
    ],
  },
];

export const flights: Flight[] = [
  {
    id: "flight-1",
    airline: "Saudia",
    flightNumber: "SV 725",
    origin: "Riyadh",
    destination: "Dubai",
    departTime: "10:45",
    arriveTime: "12:30",
    duration: "1h 45m",
    price: 890,
    stops: 0,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "flight-2",
    airline: "Emirates",
    flightNumber: "EK 613",
    origin: "Jeddah",
    destination: "Cairo",
    departTime: "08:20",
    arriveTime: "11:40",
    duration: "4h 20m",
    price: 1250,
    stops: 1,
    image:
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "flight-3",
    airline: "flydubai",
    flightNumber: "FZ 167",
    origin: "Dubai",
    destination: "Riyadh",
    departTime: "16:10",
    arriveTime: "19:00",
    duration: "1h 50m",
    price: 760,
    stops: 0,
    image:
      "https://www.arabnews.com/sites/default/files/styles/n_670_395/public/2025/11/19/4659764-244290321.jpg?itok=VMVVQre8",
  },
  {
    id: "flight-4",
    airline: "Qatar Airways",
    flightNumber: "QR 101",
    origin: "Riyadh",
    destination: "Doha",
    departTime: "13:30",
    arriveTime: "14:40",
    duration: "1h 10m",
    price: 980,
    stops: 0,
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
  },
];
