import { Dropdown, SearchBar } from "keep-react";
import bannerBg from "../assets/img/banner-bg.jpg";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BiRightArrowAlt } from "react-icons/bi";
import { useState } from "react";

const books = [
  { id: 1, name: "To Kill a Mockingbird" },
  { id: 2, name: "Pride and Prejudice" },
  { id: 3, name: "1984" },
  { id: 4, name: "The Great Gatsby" },
  { id: 5, name: "Moby Dick" },
  { id: 6, name: "The Catcher in the Rye" },
  { id: 7, name: "Jane Eyre" },
  { id: 8, name: "The Lord of the Rings" },
  { id: 9, name: "To the Lighthouse" },
  { id: 10, name: "Brave New World" },
];

const Home = () => {
  const [data, setData] = useState([]);
  const handleOnChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const results = books.filter((book) =>
      book.name.toLowerCase().includes(searchTerm)
    );
    if (searchTerm === "") {
      setData([]);
    } else {
      setData(results);
    }
  };
  return (
    <>
      <header>
        <div
          className="w-full h-[80vh] rounded-md flex justify-center items-center p-2"
          style={{
            background: `linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.9)), url('${bannerBg}')`,
          }}
        >
          <div className="relative shadow-md">
            <SearchBar
              placeholder="Search Anything"
              addon={<FaMagnifyingGlass size={15} />}
              addonPosition="left"
              size="md"
              icon={<BiRightArrowAlt size={25} />}
              iconPosition="right"
              handleOnChange={handleOnChange}
            >
              <ul className="absolute top-full left-0 z-50 w-full bg-gray-200 rounded-md overflow-hidden mt-1">
                {data.map((book) => (
                  <Dropdown.Item key={book?.id}>
                    {book?.name}
                    <span className="ml-auto">
                      <BiRightArrowAlt size={25} />
                    </span>
                  </Dropdown.Item>
                ))}
              </ul>
            </SearchBar>
          </div>
        </div>
      </header>
    </>
  );
};

export default Home;
