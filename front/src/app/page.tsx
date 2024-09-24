'use client'
import React from "react";
import Header from "./components/Layout/Header/Header";
import Cards from "./components/Layout/Cards/Cards";
import styles from "./page.module.css"
import Main from "./components/Layout/Main/Main";

export default function MyApp() {
  return (
    <div className={styles.container}>
      <Header title="Game Name" />
      <Main />
      <Cards />
    </div>
  )
};
