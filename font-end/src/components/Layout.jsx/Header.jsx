import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import DropDownNavs from "../DropDownNavs";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300">
      <FontAwesomeIcon
        icon={["fas", "bars"]}
        className="text-xl cursor-pointer"
      />
      <nav className="flex space-x-4"></nav>
      <DropDownNavs />
    </header>
  );
};

export default Header;
