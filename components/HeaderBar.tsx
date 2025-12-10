import s from './HeaderBar.module.scss';
import cn from 'classnames';

export type HeaderBarProps = {
	children: React.ReactNode | React.ReactNode[];
	mobileHide?: boolean;
};

export function HeaderBar({ children, mobileHide }: HeaderBarProps) {
	return <header className={cn(s.bar, mobileHide && s.mobileHide)}>{children}</header>;
}
