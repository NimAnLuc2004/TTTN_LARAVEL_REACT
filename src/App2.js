import Banner from "./componets/Banner";
import ProductCart from "./componets/ProductCart";

function App() {
  return (
    <>
      <header className="bg-white font-medium">
        <div>
          <div className="flex flex-row bg-black px-60 p-2 items-center text-lg">
            <div className="md:basis-1/12 text-neutral-50 hover:bg-orange-500 hover:rounded-md">
              <i className="fa-solid fa-user"></i> Tài Khoản
            </div>
            <div className="md:basis-1/12 text-neutral-50 hover:bg-orange-500 hover:rounded-md">
              <i className="fa-solid fa-award"></i> Phần thưởng
            </div>
            <div className="md:basis-1/12 text-neutral-50 hover:bg-orange-500 hover:rounded-md">
              <i className="fa-solid fa-shop"></i> Cửa hàng
            </div>
            <div className="md:basis-1/12 text-neutral-50 hover:bg-orange-500 hover:rounded-md">
              <i className="fa-solid fa-phone"></i> Liên hệ
            </div>
          </div>
          <div className="flex flex-row bg-white px-60 p-9 h-16 items-center">
            <div className="md:basis-2/12 border-r-2 border-black">
              <img
                src="https://vnggames.com/_next/image?url=%2Fassets%2Fimages%2Flogo.webp&w=1920&q=100"
                alt="Logo"
              />
            </div>
            <div className="md:basis-1/12 p-3 text-xl hover:bg-orange-500 hover:rounded-md">
              <i className="fa-solid fa-globe"></i> VN
            </div>
            <div className="md:basis-5/12 flex flex-row text-center items-center">
              <div className="md:basis-6/12"></div>
              <div className="md:basis-2/12 text-xl text-orange-600 font-bold">
                Trang Chủ
              </div>
              <div className="md:basis-2/12 text-center text-xl hover:text-orange-500">
                Trò chơi
              </div>
              <div className="md:basis-2/12 text-center text-xl hover:text-orange-500">
                Tin tức
              </div>
            </div>
            <div className="md:basis-2/12"></div>
            <div className="md:basis-2/12 h-14 flex items-center justify-center text-center bg-orange-600 text-neutral-50 rounded-lg font-bold border text-xl">
              Đăng nhập
            </div>
          </div>
        </div>
      </header>
      
      <Banner />

      <main class="font-medium">
        <div className="container mx-auto">
          <h1 className="text-start uppercase text-2xl text-black  pt-11 pb-11">
            MỚI PHÁT HÀNH & SẮP RA MẮT
          </h1>
          <div className="grid md:grid-cols-3 gap-8 grid-cols-1 ">
            <ProductCart />
            <ProductCart />
            <ProductCart />
          </div>
        </div>
        <div className="container text-center p-3 mx-auto">
          <h1 className="inline-block p-3  text-2xl text-white  rounded-md pt-1 pb-1 px-4 bg-orange-600 hover:bg-orange-500">
            Xem Thêm
          </h1>
        </div>
        <div class="flex container mx-auto items-center">
          <div class="flex space-x-2 overflow-x-auto p-10">
            <button class="flex items-center px-4 py-2 bg-gray-200 hover:bg-orange-500 hover:text-white text-black rounded-md focus:outline-none">
              TẤT CẢ{" "}
              <span class="ml-2 bg-white text-orange-500 rounded-full px-2 py-0.5">
                57
              </span>
            </button>
            <button class="flex items-center px-4 py-2 bg-gray-200 hover:bg-orange-500 hover:text-white text-blacktext-white rounded-md focus:outline-none">
              SIMULATION{" "}
              <span class="ml-2 bg-white text-orange-500 rounded-full px-2 py-0.5">
                5
              </span>
            </button>
            <button class="flex items-center px-4 py-2 bg-gray-200 hover:bg-orange-500 hover:text-white text-blacktext-white rounded-md focus:outline-none">
              ACTION{" "}
              <span class="ml-2 bg-white text-gray-700 rounded-full px-2 py-0.5">
                10
              </span>
            </button>
            <button class="flex items-center px-4 py-2 bg-gray-200 hover:bg-orange-500 hover:text-white text-blacktext-white rounded-md focus:outline-none">
              RPG{" "}
              <span class="ml-2 bg-white text-gray-700 rounded-full px-2 py-0.5">
                33
              </span>
            </button>
            <button class="flex items-center px-4 py-2 bg-gray-200 hover:bg-orange-500 hover:text-white text-blacktext-white rounded-md focus:outline-none">
              SHOOTING{" "}
              <span class="ml-2 bg-white text-gray-700 rounded-full px-2 py-0.5">
                4
              </span>
            </button>
            <button class="flex items-center px-4 py-2 bg-gray-200 hover:bg-orange-500 hover:text-white text-blacktext-white rounded-md focus:outline ">
              RACING{" "}
              <span class="ml-2 bg-white text-gray-700 rounded-full px-2 py-0.5">
                1
              </span>
            </button>
          </div>
        </div>
        <div>
          <div className="relative w-full p-3 max-w-md mx-96">
            <input
              type="text"
              placeholder="Tìm trò chơi"
              className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute top-0 right-0 w-6 h-6 mt-3 mr-4 text-gray-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0a7 7 0 1110.85 0A7 7 0 0116.65 16.65z"
              ></path>
            </svg>
          </div>
        </div>
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 grid-cols-1 p-6">
            <ProductCart />
            <ProductCart />
            <ProductCart />
            <ProductCart />
            <ProductCart />
            <ProductCart />
          </div>
        </div>
        <div className="container text-center p-3 mx-auto">
          <h1 className="inline-block p-3  text-2xl text-white  rounded-md pt-1 pb-1 px-4 bg-orange-600 hover:bg-orange-500">
            Xem Thêm
          </h1>
        </div>
      </main>
      <footer className="font-medium bg-black text-white p-4  ">
        <div className="container mx-auto">
          <div className="flex flex-row-2 items-center text-lg ">
            <div className="md:basis-3/12">
              <div>
                <img
                  src="https://vnggames.com/_next/image?url=%2Fassets%2Fimages%2Flogo.webp&w=1920&q=100"
                  alt="Logo"
                />
              </div>
              <i class="fa-brands fa-facebook text-4xl pr-6 pt-3"></i>
              <i class="fa-brands fa-youtube text-4xl pr-6 pt-3"></i>
              <i class="fa-brands fa-instagram text-4xl pr-6 pt-3"></i>
            </div>
            <div className="md:basis-4/12">
              <div> Đăng ký nhận bản tin </div>
              <div className="">
                <div className="relative w-full max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute top-0 right-0 w-6 h-6 mt-3 mr-4 text-gray-500 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35m0 0a7 7 0 1110.85 0A7 7 0 0116.65 16.65z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="md:basis-3/12 p-3">
              <div className="text-slate-700">Công Ty</div>
              <div>Về VNG</div>
              <div>Tuyển dụng</div>
              <div>Logo</div>
            </div>
            <div className="md:basis-2/12 p-3">
              <div className="text-slate-700">Đối tác</div>
              <div>Hợp tác</div>
            </div>
          </div>

          <div className="border-t-2  border-white">
            <p>
              &copy; Copyright &copy; 2021 VNG. All Rights Reserved. All
              trademarks referenced herein are the properties of their
              respective owners.
            </p>
            <div className="text-end">Chính sách bảo mật</div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
