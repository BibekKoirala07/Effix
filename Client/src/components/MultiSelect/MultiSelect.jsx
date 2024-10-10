const SelectMenu = ({ value, list, handleInput, removeCategory }) => {
  return (
    <div className="w-full rounded flex flex-col items-center h-64 mx-auto" >
      <div className="w-full px-4">
        <div className="flex flex-col items-center relative" style={{ height: "250px", overflowY: 'scroll' }}>
          <div className="w-full  svelte-1l8159u">
            <div className="my-2 p-1 flex border border-gray-200 bg-white rounded svelte-1l8159u">
              <div className="flex flex-auto flex-wrap">
                {value?.map((data, index) => {
                  return list?.find((id) => id._id === data)?.title ? (
                    <div className="flex  justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-teal-700 bg-teal-100 border border-teal-300 ">
                      <div className="text-xs font-normal leading-none max-w-full flex-initial">
                        {list?.find((id) => id._id === data)?.title}
                      </div>
                      <div
                        className="flex flex-auto flex-row-reverse"
                        onClick={() => removeCategory(index)}
                      >
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  );
                })}{" "}
                {value.length <= 0 ? "Select Service Categories " : ""}
              </div>
            </div>
          </div>
          <div className=" shadow static top-100 bg-white z-40 w-full lef-0 rounded max-h-select overflow-y-auto svelte-5uyqqj">
            <div className="flex flex-col w-full">
              {list
                ?.filter((dat) => !value.includes(dat._id))
                .map((val) => (
                  <div
                    onClick={(e) => handleInput(val._id, "categories")}
                    className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-teal-100"
                  >
                    <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                      <div className="w-full items-center flex">
                        <div className="mx-2 leading-6  ">{val.title} </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectMenu;
