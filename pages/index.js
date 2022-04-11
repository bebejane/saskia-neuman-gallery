import styles from './index.module.scss'
import { withGlobalProps } from "/lib/utils";
import { GetAllArtists, GetAbout } from '/graphql';

export default function Home(props){
	return (
		<div className={styles.container}>
			home
		</div>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAllArtists, GetAbout]}, async ({props, revalidate }) => {
	return {
		props,
		revalidate
	};
});