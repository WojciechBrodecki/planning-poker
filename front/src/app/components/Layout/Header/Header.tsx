'use client'
import React from 'react';
import styles from "./Header.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: Readonly<HeaderProps>): JSX.Element {
  return (
    <header className={styles.navbar}>
      <h1 className={styles.gameName}>{title}</h1>
      <div>
        <button>Invite Players <FontAwesomeIcon icon={faUserPlus} /></button>
      </div>
    </header>
  );
};
