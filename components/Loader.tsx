import s from './Loader.module.scss';
import cn from 'classnames';

export function Loader({ className }: { className?: string }) {
	return <div className={cn(s.loader, className)} />;
}
