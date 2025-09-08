import { createContext, useContext, useState } from "react";

const TabBarContext = createContext({
  hidden: false,
  setHidden: (_: boolean) => {},
});

export const TabBarProvider = ({ children }: { children: React.ReactNode }) => {
  const [hidden, setHidden] = useState(false);
  return (
    <TabBarContext.Provider value={{ hidden, setHidden }}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBar = () => useContext(TabBarContext);
