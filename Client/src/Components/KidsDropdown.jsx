import React, { useContext, useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { RoomContext } from "../Context/RoomContext";
const lis = [
  { name: "0 kids", value: 0 },
  { name: "1 kids", value: 1 },
  { name: "2 kids", value: 2 },
  { name: "3 kids", value: 3 },
  { name: "4 kids", value: 4 },
];
const KidsDropdown = ({ maxPerson = 0 }) => {
  const [newlist, setNewlist] = useState(lis);
  const { kids, setKids, adults } = useContext(RoomContext);
  useEffect(() => {
    if (maxPerson === 0) {
      return;
    } else {
      setNewlist(lis.filter((item) => item.value <= maxPerson - adults));
    }
  }, [adults, maxPerson]);

  return (
    <Menu as="div" className="h-full w-full bg-white relative">
      <MenuButton className="w-full h-full flex items-center justify-between px-8">
        {`${kids} kids`}
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
                setKids(li.value);
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

export default KidsDropdown;
