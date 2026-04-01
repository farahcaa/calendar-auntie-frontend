import { ProductDTO } from "@/gen";

type ProductPopUpProps = {
  product: ProductDTO;
  removeSelectedProduct: () => void;
  addToCart: (productId: string) => void;
};

const ProductPopUp = ({
  product,
  removeSelectedProduct,
  addToCart,
}: ProductPopUpProps) => {
  const thumbnail =
    (product as any)?.thumbnail ?? (product as any)?.data?.thumbnail;
  const title = (product as any)?.title ?? (product as any)?.data?.title;
  const description =
    (product as any)?.description ?? (product as any)?.data?.description;
  const price = (product as any)?.price ?? (product as any)?.data?.price;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={removeSelectedProduct}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={removeSelectedProduct}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl font-semibold shadow hover:bg-gray-100"
          aria-label="Close"
        >
          ×
        </button>

        <div className="grid md:grid-cols-2">
          <div className="bg-gray-100 flex items-center justify-center">
            <img
              src={`${import.meta.env.VITE_MEDIA_BASE_URL}/${thumbnail}`}
              alt={title ?? "Product image"}
              className=" w-full object-cover  max-h-[500px] "
            />
          </div>

          <div className="flex flex-col justify-between p-8 md:p-10">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {title}
              </h2>

              <p className="mt-4 text-2xl font-medium">${price}</p>

              <div className="mt-8">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="mt-3 whitespace-pre-line text-base leading-7 text-gray-700">
                  {description}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <button
                className="w-full rounded-md bg-black px-6 py-4 text-base font-medium text-white transition hover:opacity-90"
                onClick={() => {
                  addToCart(product.id);
                  removeSelectedProduct();
                }}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPopUp;
