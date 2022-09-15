import styles from './PrivacyPolicy.module.scss'
import Markdown from "/lib/dato/components/Markdown";

export default function PrivacyPolicy({ onClose, content }) {

  return (
    <div className={styles.privacy}>
      <h1>Privacy policy</h1>
      <Markdown className={styles.content}>
        
        {content}
      </Markdown>
      <div className={styles.close} onClick={onClose}>×</div>
    </div>
  )
}