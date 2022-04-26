import styles from './Footer.module.scss'
import { Image } from "react-datocms"
import cn from "classnames"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeaderBar } from 'components/HeaderBar';

export default function Footer(props) {

  const { shows, events, artists, show, event, artist } = props
  const type = show ? 'show' : event ? 'event' : artist ? 'artist' : null
  if (!type) return null

  let nextIndex = 0; // Get the next index
  props[type + 's'].forEach(({ slug }, idx) => (slug === props[type].slug) && (nextIndex = idx + 1 === props[type + 's'].length ? 0 : idx + 1))

  const next = props[type + 's'][nextIndex]
  const label = next.title || next.name
  const slug = `/${type}s/${next.slug}`

  return (
    <footer className={styles.footer}>
      <div className={styles.next}>
        <HeaderBar>
          <h3>next {type} </h3>
        </HeaderBar>
      </div>
      <div className={styles.label}>
        <HeaderBar>
          <Link href={slug}>
            <a>{label}</a>
          </Link>
        </HeaderBar>
      </div>
    </footer>
  )
}