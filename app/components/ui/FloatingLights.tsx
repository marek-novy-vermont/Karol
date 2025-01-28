import { memo } from 'react';
import styles from './FloatingLights.module.scss';

export const FloatingLights = memo(() => {
  return (
    <div className={styles.lightsContainer}>
      {[...Array(9)].map((_, i) => (
        <div key={i} className={`${styles.light} ${styles[`x${i + 1}`]}`} />
      ))}
    </div>
  );
});
