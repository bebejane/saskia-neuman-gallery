'use client';

import s from './ExtendedBiography.module.scss';
import cn from 'classnames';
import { useState } from 'react';

type ExtendedBiographyProps = {
	artist: NonNullable<ArtistQuery['artist']>;
};

export default function ExtendedBiography({ artist }: ExtendedBiographyProps) {
	const [show, setShow] = useState(false);
	const { soloExhibitions, groupExhibitions, represented, education, performances, publications } = artist;

	return (
		<section className={cn(s.extendedBiography, show && s.show)}>
			<h3 onClick={() => setShow(!show)}>
				Extended Bio <span>›</span>
			</h3>
			{soloExhibitions.length > 0 && (
				<div>
					<h3>Solo Exhibitions</h3>
					<ul>
						{soloExhibitions?.map(({ year, text, additionalText, location }, idx) => (
							<li key={`ss-${idx}`}>
								{text}
								<br /> {additionalText && <span>{additionalText},</span>} {location && <span>{location},</span>}{' '}
								{year && <span>{year}</span>}{' '}
							</li>
						))}
					</ul>
				</div>
			)}
			{groupExhibitions?.length > 0 && (
				<div>
					<h3>Group Exhibitions</h3>
					<ul>
						{groupExhibitions?.map(({ year, text, additionalText, location }, idx) => (
							<li key={`gs-${idx}`}>
								{text}
								<br /> {additionalText && <span>{additionalText},</span>} {location && <span>{location},</span>}{' '}
								{year && <span>{year}</span>}
							</li>
						))}
					</ul>
				</div>
			)}
			{represented.length > 0 && (
				<div>
					<h3>Represented</h3>
					<ul>
						{represented.map(({ year, text, additionalText, location }, idx) => (
							<li key={`re-${idx}`}>
								{text}
								<br /> {additionalText && <span>{additionalText},</span>} {location && <span>{location},</span>}{' '}
								{year && <span>{year}</span>}
							</li>
						))}
					</ul>
				</div>
			)}
			{education.length > 0 && (
				<div>
					<h3>Education</h3>
					<ul>
						{education.map(({ year, text, additionalText, location }, idx) => (
							<li key={`ed-${idx}`}>
								{text}
								<br /> {additionalText && <span>{additionalText},</span>} {location && <span>{location},</span>}{' '}
								{year && <span>{year}</span>}
							</li>
						))}
					</ul>
				</div>
			)}
			{performances.length > 0 && (
				<div>
					<h3>Performances</h3>
					<ul>
						{performances.map(({ year, text, additionalText, location }, idx) => (
							<li key={`pub-${idx}`}>
								{text}
								<br /> {additionalText && <span>{additionalText},</span>} {location && <span>{location},</span>}{' '}
								{year && <span>{year}</span>}
							</li>
						))}
					</ul>
				</div>
			)}
			{publications.length > 0 && (
				<div>
					<h3>Publications</h3>
					<ul>
						{publications.map(({ year, text, additionalText, location }, idx) => (
							<li key={`pub-${idx}`}>
								{text}
								<br /> {additionalText && <span>{additionalText},</span>} {location && <span>{location},</span>}{' '}
								{year && <span>{year}</span>}
							</li>
						))}
					</ul>
				</div>
			)}
		</section>
	);
}
