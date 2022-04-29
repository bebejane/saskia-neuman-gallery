import create from "zustand";

const defaultColor = [255,255,255]

const useStore = create((set) => ({
	backgroundColor: defaultColor,
  backgroundImage: null,
  isHoveringMenuItem: false,
	setBackgroundColor: (color) =>
		set((state) => ({
			backgroundColor: color,
		})
  ),
  setBackgroundImage: (image) =>  
    set((state) => ({
      backgroundImage: image,
      backgroundColor: (image || state.backgroundImage)?.customData?.color?.split(',') || defaultColor,
    })
  ),
  setIsHoveringMenuItem: (hovering) =>  
    set((state) => ({
      isHoveringMenuItem: hovering
    })
  ),
}));

export default useStore;
