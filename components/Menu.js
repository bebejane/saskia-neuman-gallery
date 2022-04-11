import styles from "./Menu.module.scss"
import Link from "next/link"

export default function Menu(){
  return (
    <div id="menu" className={styles.container}>
      <div className={styles.logo}>
        <Link href="/">SASKIA NEUMAN GALLERY</Link>
      </div>
      <div className={styles.menu}>
        <ul>
          <li><Link href="/shows">Shows</Link></li>
          <li><Link href="/artists">Artists</Link></li>
          <li><Link href="/events">Events</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>
      </div>
    </div>
  )
}