import create from "zustand";

const defaultColor = [255,255,255]

const useStore = create((set) => ({
  
	backgroundColor: defaultColor,
  backgroundImage: null,
  isHoveringMenuItem: false,
  isRouting:false,
  showMenu:true,
  isTransitioning:false,
  isExiting:false,
  showMobileMenu:false,

	setBackgroundColor: (color) =>
		set((state) => ({
			backgroundColor: color,
		})
  ),
  setBackgroundImage: (image) =>  
    set((state) => ({
      backgroundImage: !state.isRouting ? image : state.backgroundImage,
      backgroundColor: (image || state.backgroundImage)?.customData?.color?.split(',') || defaultColor,
    })
  ),
  setIsHoveringMenuItem: (hovering) =>  
    set((state) => ({
      isHoveringMenuItem: hovering
    })
  ),
  setIsRouting: (isRouting) =>  
    set((state) => ({
      isRouting,
      backgroundImage: state.isRouting && !isRouting ? undefined : state.backgroundImage
    })
  ),
  setShowMenu: (showMenu) =>  
    set((state) => ({
      showMenu
    })
  ),
  setShowMobileMenu: (showMobileMenu) =>  
    set((state) => ({
      showMobileMenu
    })
  ),
  setIsTransitioning: (isTransitioning) =>  
    set((state) => ({
      isTransitioning
    })
  ),
  setIsExiting: (isExiting) =>  
    set((state) => ({
      isExiting
    })
  ),
}));

export default useStore;
