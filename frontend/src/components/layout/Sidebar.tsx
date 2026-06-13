import { NavLink } from "react-router-dom";
import { navigation } from "../../constants/navigation";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white h-screen">
      <div className="p-5 text-xl font-bold">
        Mini ERP
      </div>

      <nav className="px-3">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              <Icon size={18} />
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}