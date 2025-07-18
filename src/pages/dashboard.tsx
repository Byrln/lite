import { useState } from "react";
import { Box } from "@mui/material";
import DashboardSidebar from "@/components/layouts/dashboard/dashboard-sidebar";
import sidebarConfig from "@/components/layouts/dashboard/sidebar-config";

export default function Page() {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => {
    // Initialize from localStorage if available, otherwise default to false
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarMinimized');
      return savedState === 'true';
    }
    return false;
  });

  const handleCloseSidebar = () => {
    setIsOpenSidebar(false);
  };

  const handleToggleMinimize = (minimized: boolean) => {
    setIsMinimized(minimized);
    // Update localStorage when minimized state changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarMinimized', minimized.toString());
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <DashboardSidebar
        isOpenSidebar={isOpenSidebar}
        onCloseSidebar={handleCloseSidebar}
        sideBarData={sidebarConfig}
        onToggleMinimize={handleToggleMinimize}
      />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          marginLeft: isMinimized ? '80px' : '280px',
          transition: 'margin-left 0.3s ease'
        }}
      >
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </Box>
    </Box>
  )
}
