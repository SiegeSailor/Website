import styles from "./index.module.scss";

export default function () {
  return (
    <div className={styles.container}>
      {Array.from({ length: 3 }, (_, index) => {
        return <span key={index} className={styles.dot}></span>;
      })}
    </div>
  );
}
