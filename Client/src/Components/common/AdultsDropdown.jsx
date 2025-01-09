import React, { useContext, useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { RoomContext } from "../../Context/RoomContext";
const lis = [
  { name: "1 Adults", value: 1 },
  { name: "2 Adults", value: 2 },
  { name: "3 Adults", value: 3 },
  { name: "4 Adults", value: 4 },
  { name: "5 Adults", value: 5 },
];
const AdultsDropdown = ({ maxAdults = 0 }) => {
  const [newlist, setNewlist] = useState(lis);
  const { adults, setAdults } = useContext(RoomContext);
  useEffect(() => {
    if (maxAdults === 0) {
      return;
    } else {
      setNewlist(lis.filter((item) => item.value <= maxAdults));
    }
  }, [maxAdults]);
  return (
    <Menu as="div" className="h-full w-full bg-white relative">
      <MenuButton className="w-full h-full flex items-center justify-between px-8">
        {`${adults} adults`}
        <ChevronDown className="text-base text-accent-hover" />
      </MenuButton>
      <MenuItems
        as="ul"
        className="bg-white absolute w-full flex flex-col z-40"
      >
        {newlist.map((li, index) => {
          return (
            <MenuItem
              onClick={() => {
                setAdults(li.value);
              }}
              as="li"
              key={index}
              className="border-b last-of-type:border-b-0 h-12 hover:bg-accent hover:text-white w-full flex justify-center items-center cursor-pointer"
            >
              {li.name}
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
};

export default AdultsDropdown;
