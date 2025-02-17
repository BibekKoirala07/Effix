import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { BASE_URL, URL_BACKEND } from "../../config/constant";
import { toogleLogin } from "../../redux/reducers/User";
import { getService } from "../../services/user.services";

const products = [
  {
    id: 1,
    name: "Basic Tee",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
];

export default function Items() {
  const [list, setList] = useState([]);
  const router = useHistory();
  const titleArray = ["Service Title", "Description"];
  const fields = ["title", "description"];
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const serviceList = async () => {
    const [response] = await getService();
    if (response) {
      setList(response.data);
    }
  };
  const handleLoginClose = (value) => {
    dispatch(toogleLogin(value));
  };
  useEffect(() => {
    serviceList();
  }, []);

  return (
    <div className="bg-white">
      <div className="max-w-2xl flex flex-col items-center mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl align-center font-extrabold tracking-tight text-gray-900">
          Our Services
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {list.map((product) => (
            <div key={product.id} className="group relative">
              <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <img
                  src={
                    product.image
                      ? `${URL_BACKEND}${product.image}`
                      : "/photos/services/placeholder.jpg"
                  }
                  onError={(e) =>
                    (e.target.src = "/photos/services/placeholder.jpg")
                  }
                  alt={product.imageAlt}
                  className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                />
              </div>
              <div
                className="mt-4 flex cursor-pointer flex-col justify-between"
                onClick={() =>
                  !user?.isLoggedIn
                    ? handleLoginClose(true)
                    : router.push(`/service/${product._id}`)
                }
              >
                {console.log(user)}
                <div>
                  <h3 className="text-lg text-gray-900">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.title}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 whitespace-nowrap text-ellipsis overflow-hidden">
                    {product.description}
                  </p>
                </div>
                <p className="text-sm bg-accent cursor-pointer w-max px-4 mt-2 text-white rounded py-2 font-medium text-gray-900">
                  Order Service
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
