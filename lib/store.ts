import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { persist, createJSONStorage } from 'zustand/middleware';

const defaultBackgroundColor = undefined;

export interface StoreState {
	backgroundColor: number[] | null;
	backgroundImage: FileField | null;
	isHoveringMenuItem: boolean;
	isRouting: boolean;
	showMenu: boolean;
	isTransitioning: boolean;
	isExiting: boolean;
	showMobileMenu: boolean;
	transition: 'enter' | 'exit' | null;
	theme: {
		current: 'dark' | 'light';
		original: 'dark' | 'light';
	};
	setTransition: (transition: 'enter' | 'exit' | null) => void;
	setBackgroundColor: (color: number[]) => void;
	setBackgroundImage: (image: FileField | null) => void;
	setIsHoveringMenuItem: (hovering: boolean) => void;
	setIsRouting: (isRouting: boolean) => void;
	setShowMenu: (showMenu: boolean) => void;
	setShowMobileMenu: (showMobileMenu: boolean) => void;
	setIsTransitioning: (isTransitioning: boolean) => void;
	setIsExiting: (isExiting: boolean) => void;
	setTheme: (theme: Partial<{ current: 'dark' | 'light'; original: 'dark' | 'light' }>) => void;
}

const useStore = create<StoreState>((set) => ({
	backgroundColor: null,
	backgroundImage: null,
	isHoveringMenuItem: false,
	isRouting: false,
	showMenu: true,
	isTransitioning: false,
	isExiting: false,
	showMobileMenu: false,
	transition: null,
	theme: { current: 'light', original: 'light' },
	setTransition: (transition) => set((state) => ({ transition })),
	setBackgroundColor: (color: number[]) =>
		set((state) => ({
			backgroundColor: color,
		})),
	setBackgroundImage: (image: FileField | null) =>
		set((state) => ({
			backgroundImage: !state.isRouting ? image : state.backgroundImage,
			backgroundColor: (image || state.backgroundImage)?.customData?.color?.split(',') || defaultBackgroundColor,
		})),
	setIsHoveringMenuItem: (hovering: boolean) =>
		set((state) => ({
			isHoveringMenuItem: hovering,
		})),
	setIsRouting: (isRouting: boolean) =>
		set((state) => ({
			isRouting,
			backgroundImage: state.isRouting && !isRouting ? undefined : state.backgroundImage,
		})),
	setShowMenu: (showMenu: boolean) =>
		set((state) => ({
			showMenu,
		})),
	setShowMobileMenu: (showMobileMenu: boolean) =>
		set((state) => ({
			showMobileMenu,
		})),
	setIsTransitioning: (isTransitioning: boolean) =>
		set((state) => ({
			isTransitioning,
		})),
	setIsExiting: (isExiting: boolean) =>
		set((state) => ({
			isExiting,
		})),
	setTheme(theme) {
		set((state) => ({
			theme: { ...state.theme, ...theme },
		}));
	},
}));

export { useShallow, useStore };
