import React from 'react';
import styles from './Spinner.module.css';

export const Spinner = () =>
{
    return (
        <div className={styles.root}>
            <div className={styles.ldsroller}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    );
};