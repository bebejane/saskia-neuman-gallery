import s from './HeaderBar.module.scss';
import cn from 'classnames';

export function HeaderBar({ children, mobileHide }) {
	return <header className={cn(s.bar, mobileHide && s.mobileHide)}>{children}</header>;
}
