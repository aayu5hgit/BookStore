import React, { useMemo, useState, useEffect } from "react";
import Book from "../Components/Book";
import { Link } from "react-router-dom";
import styles from "./BookStore.module.css";
import { Search, Heart, Sun, Moon } from "lucide-react";
import Loading from "../Components/LoadingSpinner";
import bookStore from "../bookStore";

export default function Main() {
  const [book, setBook] = useState([]);
  const [search, setSearch] = useState("India");
  const [text, setText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Use localStorage to persist dark mode setting across sessions
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    setDarkMode(savedDarkMode === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Toggle dark mode on and off
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useMemo(() => {
    try {
      fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${search}&download=epub&key=AIzaSyD_d_29Zq6n63LUjWQMIJvVFY2QI7Rwb4E`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setBook(data);
        });
    } catch (error) {
      console.log(error);
    }
  }, [search]);

  function handleSearch(e) {
    e.preventDefault();
    text === "" ? setSearch(search) : setSearch(text);
    setText("");
  }

  return (
    <>
      <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.logo}>
              BookStore
              <span className={styles.tagIcon}>🔖</span>
            </h1>
          </div>
          <div>
            <button className={styles.darkModeButton} onClick={toggleDarkMode}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {/* {darkMode ? "Light Mode" : "Dark Mode"} */}
            </button>
          </div>
        </header>
        <main className={styles.main}>
          <form className={styles.searchContainer} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for books..."
              className={styles.searchInput}
              onChange={(e) => setText(e.target.value)}
            />
            <button className={styles.searchButton}>
              <Search size={18} />
              Search
            </button>
          </form>
          <Link
            to="/favorite"
            style={{ textDecoration: "none" }}
            className={styles.favoriteButton}
          >
            <Heart size={18} />
            Favorites
          </Link>
        </main>
        <div className="main">
          {Object.keys(book).length === 0 ? (
            <Loading />
          ) : (
            book.items &&
            book.items.map((ele) => (
              <Book
                title={ele.volumeInfo?.title}
                subTitle={ele.volumeInfo?.subtitle}
                author={ele.volumeInfo?.authors && ele.volumeInfo.authors[0]}
                date={ele.volumeInfo?.publishedDate}
                rating={ele.volumeInfo?.averageRating}
                link={ele.volumeInfo?.previewLink}
                key={ele.id}
                ele={ele}
                thumb={ele.volumeInfo.imageLinks.thumbnail}
              />
            ))
          )}
        </div>
        <div className="fav">
          <h1 className="txt-d"> Contributed Books </h1>
          <div className="main ">
            {bookStore.map((ele) => (
              <Book
                title={ele.title}
                subTitle={ele.subtitle}
                author={ele.authors && ele.authors[0]}
                date={ele.publishedDate}
                rating={ele.averageRating}
                link={ele.previewLink}
                key={ele.id}
                ele={ele}
                thumb={ele.thumnail}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

