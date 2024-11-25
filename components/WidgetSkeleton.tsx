import styles from './WidgetSkeleton.module.css';

export default function WidgetSkeleton() {
  return (
    <div className={styles.widget}>
      <div className={styles.title}></div>
      <div className={styles.content}></div>
      <div className={styles.footer}></div>
    </div>
  );
}
