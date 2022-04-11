import styles from "./Menu.module.scss"
import Link from "next/link"
import { useRouter } from "next/router"

const menu = [
  {path:'/shows', label:'Shows'}, 
  {path:'/artists', label:'Artists'}, 
  {path:'/events', label:'Events'}, 
  {path:'/about', label:'About'}
]

export default function Menu(){
  const router = useRouter()
  
  return (
    <div id="menu" className={styles.container}>
      <div className={styles.logo}>
        <Link href="/">SASKIA NEUMAN GALLERY</Link>
      </div>
      <div className={styles.menu}>
        <ul>
          {menu.map(({path, label}) => 
            <li className={router.asPath === path && styles.selected}>
              <Link href={path}>{label}</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}