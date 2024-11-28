// rooms images
import Room1Img from "./assets/img/rooms/1.png";
import Room1ImgLg from "./assets/img/rooms/1-lg.png";
import Room2Img from "./assets/img/rooms/2.png";
import Room2ImgLg from "./assets/img/rooms/2-lg.png";
import Room3Img from "./assets/img/rooms/3.png";
import Room3ImgLg from "./assets/img/rooms/3-lg.png";
import Room4Img from "./assets/img/rooms/4.png";
import Room4ImgLg from "./assets/img/rooms/4-lg.png";
import Room5Img from "./assets/img/rooms/5.png";
import Room5ImgLg from "./assets/img/rooms/5-lg.png";
import { FaSwimmingPool } from "react-icons/fa";
import {
  Bath,
  Coffee,
  Dumbbell,
  Martini,
  SquareParking,
  Utensils,
  Wifi,
} from "lucide-react";

export const roomData = [
  {
    id: 1,
    name: "Superior Room",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea placeat eos sed voluptas unde veniam eligendi a. Quaerat molestiae hic omnis temporibus quos consequuntur nam voluptatum ea accusamus, corrupti nostrum eum placeat quibusdam quis beatae quae labore earum architecto aliquid debitis.",
    facilities: [
      { name: "Wifi", icon: <Wifi /> },
      { name: "Coffee", icon: <Coffee /> },
      { name: "Bath", icon: <Bath /> },
      { name: "Parking Space", icon: <SquareParking /> },
      { name: "Swimming Pool", icon: <FaSwimmingPool /> },
      { name: "Breakfast", icon: <Utensils /> },
      { name: "GYM", icon: <Dumbbell /> },
      { name: "Drinks", icon: <Martini /> },
    ],
    maxAdults: 1,
    maxPerson: 3,
    price: 1000,
    image: Room1Img,
    imageLg: Room1ImgLg,
  },
  {
    id: 2,
    name: "Signature Room",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea placeat eos sed voluptas unde veniam eligendi a. Quaerat molestiae hic omnis temporibus quos consequuntur nam voluptatum ea accusamus, corrupti nostrum eum placeat quibusdam quis beatae quae labore earum architecto aliquid debitis.",
    facilities: [
      { name: "Wifi", icon: <Wifi /> },
      { name: "Coffee", icon: <Coffee /> },
      { name: "Bath", icon: <Bath /> },
      { name: "Parking Space", icon: <SquareParking /> },
      { name: "Swimming Pool", icon: <FaSwimmingPool /> },
      { name: "Breakfast", icon: <Utensils /> },
      { name: "GYM", icon: <Dumbbell /> },
      { name: "Drinks", icon: <Martini /> },
    ],
    maxAdults: 2,
    maxPerson: 4,
    price: 1500,
    image: Room2Img,
    imageLg: Room2ImgLg,
  },
  {
    id: 3,
    name: "Deluxe Room",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea placeat eos sed voluptas unde veniam eligendi a. Quaerat molestiae hic omnis temporibus quos consequuntur nam voluptatum ea accusamus, corrupti nostrum eum placeat quibusdam quis beatae quae labore earum architecto aliquid debitis.",
    facilities: [
      { name: "Wifi", icon: <Wifi /> },
      { name: "Coffee", icon: <Coffee /> },
      { name: "Bath", icon: <Bath /> },
      { name: "Parking Space", icon: <SquareParking /> },
      { name: "Swimming Pool", icon: <FaSwimmingPool /> },
      { name: "Breakfast", icon: <Utensils /> },
      { name: "GYM", icon: <Dumbbell /> },
      { name: "Drinks", icon: <Martini /> },
    ],
    maxAdults: 3,
    maxPerson: 5,
    price: 2500,
    image: Room3Img,
    imageLg: Room3ImgLg,
  },
  {
    id: 4,
    name: "Luxury Room",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea placeat eos sed voluptas unde veniam eligendi a. Quaerat molestiae hic omnis temporibus quos consequuntur nam voluptatum ea accusamus, corrupti nostrum eum placeat quibusdam quis beatae quae labore earum architecto aliquid debitis.",
    facilities: [
      { name: "Wifi", icon: <Wifi /> },
      { name: "Coffee", icon: <Coffee /> },
      { name: "Bath", icon: <Bath /> },
      { name: "Parking Space", icon: <SquareParking /> },
      { name: "Swimming Pool", icon: <FaSwimmingPool /> },
      { name: "Breakfast", icon: <Utensils /> },
      { name: "GYM", icon: <Dumbbell /> },
      { name: "Drinks", icon: <Martini /> },
    ],
    maxAdults: 4,
    maxPerson: 6,
    price: 3000,
    image: Room4Img,
    imageLg: Room4ImgLg,
  },
  {
    id: 5,
    name: "Luxury Suite Room",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea placeat eos sed voluptas unde veniam eligendi a. Quaerat molestiae hic omnis temporibus quos consequuntur nam voluptatum ea accusamus, corrupti nostrum eum placeat quibusdam quis beatae quae labore earum architecto aliquid debitis.",
    facilities: [
      { name: "Wifi", icon: <Wifi /> },
      { name: "Coffee", icon: <Coffee /> },
      { name: "Bath", icon: <Bath /> },
      { name: "Parking Space", icon: <SquareParking /> },
      { name: "Swimming Pool", icon: <FaSwimmingPool /> },
      { name: "Breakfast", icon: <Utensils /> },
      { name: "GYM", icon: <Dumbbell /> },
      { name: "Drinks", icon: <Martini /> },
    ],
    maxAdults: 5,
    maxPerson: 8,
    price: 4000,
    image: Room5Img,
    imageLg: Room5ImgLg,
  },
];
