import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center p-4 shadow-md">
      <div>Calendar-Auntie</div>
      <div className="flex space-x-4">
        <div
          className="cursor-pointer"
          onClick={() => navigate("/admin/customers")}
        >
          Customers
        </div>
        <div
          className="cursor-pointer"
          onClick={() => navigate("/admin/orders")}
        >
          Orders
        </div>
        <div
          className="cursor-pointer"
          onClick={() => navigate("/admin/products")}
        >
          Products
        </div>
        <div
          className="cursor-pointer"
          onClick={() => navigate("/admin/config")}
        >
          Config
        </div>
      </div>
    </div>
  );
};

export default Header;
