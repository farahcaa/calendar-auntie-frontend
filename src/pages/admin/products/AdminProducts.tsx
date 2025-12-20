import { useGetAdminProducts, usePostAdminProducts } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { useNavigate } from "react-router";

const AdminProducts = () => {
  const navigate = useNavigate();
  const config = useAuthenticatedClientConfig();
  const { mutateAsync } = usePostAdminProducts(config);
  const { data } = useGetAdminProducts({ page: 0 }, config);

  const handleCreatePost = async () => {
    const data = await mutateAsync();
    console.log(data);
    navigate(`/admin/products/${data.data}`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div
        className="bg-blue-500 text-white py-2 px-4 w-40 rounded hover:bg-blue-600"
        onClick={handleCreatePost}
      >
        Create Product
      </div>
      <div className="flex flex-wrap gap-4">
        {data?.data.content.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ product }: { product: any }) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-48 h-64 border rounded-lg shadow-md p-4 flex flex-col"
      onClick={() => navigate(`/admin/products/${product.id}`)}
    >
      <div className="bg-gray-200 h-32 mb-4 rounded">
        <img
          src={import.meta.env.VITE_MEDIA_BASE_URL + product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="font-bold text-lg mb-2">{product.name}</div>
      <div className="text-gray-600 mb-4">${product.price}</div>
      <button className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Edit
      </button>
    </div>
  );
};

export default AdminProducts;
