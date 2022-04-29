import styles from './PressLinks.module.scss'
import { format } from "date-fns"

export default function PressLinks({ press }) {
  return (
    <div className={styles.pressLinks}>
      {press.map(({ date, source, author, url }, idx) =>
        <div key={idx} className={styles.block}>
          <h3>{format(new Date(date), 'dd.MM.yyyy')}</h3>
          <a href={url}>
            <b>{source} →</b><br />
            {author}</a>
        </div>
      )}
    </div>
  )
}