import React, { createContext, useEffect, useReducer } from "react";

export const ThemeContext = createContext();
const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  sideBarStyle : { value: "full", label: "Full"},
  sidebarposition : { value: "fixed", label: "Fixed"},  
  sidebarLayout : { value: "vertical", label: "Vertical"},
  primaryColor : "color_1",
  containerPositionSize: {value: "wide-boxed", label: "Wide Boxed"},
  iconHover: false,
  menuToggle: false,
  windowWidth: 0,
  windowHeight: 0,
};

const ThemeContextProvider = (props) => {
const [state, dispatch] = useReducer(reducer, initialState);	
const { 
    sideBarStyle, 
    sidebarposition,    
    sidebarLayout,   
    primaryColor ,     
    containerPositionSize,        
    iconHover,
    menuToggle,
    windowWidth,
    windowHeight,
} = state;
	
  const body = document.querySelector("body");
  const openMenuToggle = () => {    
    sideBarStyle.value === "overly"  
      ? dispatch({menuToggle : true})
      : dispatch({menuToggle: false})
  };

  const changeBackground = (name) => {
    body.setAttribute("data-theme-version", name.value);
    dispatch({background: name});
  };
  
  useEffect(() => {
	const body = document.querySelector("body"); 
		let resizeWindow = () => {			
      dispatch({windowWidth : window.innerWidth});
      dispatch({windowHeight : window.innerHeight});
			window.innerWidth >= 768 && window.innerWidth < 1024
			? body.setAttribute("data-sidebar-style", "mini")
			: window.innerWidth <= 768
			? body.setAttribute("data-sidebar-style", "overlay")
			: body.setAttribute("data-sidebar-style", "full");
		};
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        body,      
        sidebarposition,       
	    	primaryColor,       
		    windowWidth,
		    windowHeight,      
        sideBarStyle,  
        sidebarLayout,     
        iconHover,
        menuToggle,
        openMenuToggle,
        changeBackground,
       
        containerPositionSize,
	}}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;


