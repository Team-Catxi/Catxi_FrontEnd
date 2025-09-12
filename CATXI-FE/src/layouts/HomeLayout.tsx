// HomeLayout.tsx
import { Outlet } from "react-router-dom";
import TabBar from "../components/Tab/TabBar";
import { ModalProvider } from "../contexts/ModalContext";
import { TabBarProvider, useTabBar } from "../contexts/TabBarContext";

const LayoutInner = () => {
  const { hidden } = useTabBar();
  return (
    <div className="w-full h-screen relative flex flex-col pb-[3.75rem]">
      <Outlet />
      {!hidden && <TabBar />}
    </div>
  );
};

const HomeLayout = () => {
  return (
    <ModalProvider>
      <TabBarProvider>
        <LayoutInner />
      </TabBarProvider>
    </ModalProvider>
  );
};

export default HomeLayout;
