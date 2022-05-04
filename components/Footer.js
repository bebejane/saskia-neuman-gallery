import styles from './Footer.module.scss'
import useStore from '/store';
import Link from '/components/Link';
import { HeaderBar } from 'components/HeaderBar';
import { imageColor } from '/utils'
import cn from 'classnames'

export default function Footer(props) {

  const { show, event, artist } = props
  const setBackgroundImage = useStore((state) => state.setBackgroundImage);
  const type = show ? 'show' : event ? 'event' : artist ? 'artist' : null

  if (!type) return null

  let nextIndex = 0; // Get the next index
  props[type + 's'].forEach(({ slug }, idx) => (slug === props[type].slug) && (nextIndex = idx + 1 === props[type + 's'].length ? 0 : idx + 1))

  const next = props[type + 's'][nextIndex]
  const label = next.title || next.name
  const slug = `/${type}s/${next.slug}`

  return (
    <footer className={styles.footer}>
      <div className={styles.wrapper}>
        <div className={styles.next}>
          <HeaderBar>
            <h3>Next {type} </h3>
          </HeaderBar>
        </div>
        <div className={styles.label}>
          <HeaderBar>
            <b>
              <Link href={slug} scroll={false} color={imageColor(next.image)}>
                <span onMouseEnter={() => setBackgroundImage(next.image)} onMouseLeave={() => setBackgroundImage(null)}>
                  {label}
                </span>
              </Link>
            </b>
          </HeaderBar>
        </div>
      </div>
    </footer >
  )
}