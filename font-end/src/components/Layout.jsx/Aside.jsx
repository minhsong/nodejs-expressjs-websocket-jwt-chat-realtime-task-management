import clsx from "clsx";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Aside = ({ navs, title }) => {
  const location = useLocation();
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        {title}
      </div>
      <nav className="flex-1 p-4">
        <div>
          {navs.map((nav) => (
            <Link
              key={nav.to}
              to={nav.to}
              className={clsx(
                "p-2 hover:bg-gray-700 cursor-pointer block w-full",
                nav.to.indexOf(location.pathname) == 0 &&
                  location.pathname.length > 1 &&
                  "bg-gray-700",
                nav.to === location.pathname &&
                  location.pathname == "/" &&
                  "bg-gray-700"
              )}
            >
              {nav.title}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Aside;
