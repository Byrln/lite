import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import Link from "next/link";
import arrowIosForwardFill from "@iconify/icons-eva/arrow-ios-forward-fill";
import arrowIosDownwardFill from "@iconify/icons-eva/arrow-ios-downward-fill";
import { alpha, useTheme, styled } from "@mui/material/styles";
import {
  Box,
  List,
  Collapse,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Tooltip,
  Typography
} from "@mui/material";

interface ListItemStyleProps {
  theme: any;
  isMinimized?: boolean;
  hasSubMenu?: boolean;
  isSubMenu?: boolean;
}

const ListItemStyle = styled((props: {
  isMinimized?: boolean;
  hasSubMenu?: boolean;
  isSubMenu?: boolean;
  [key: string]: any;
}) => {
  const { isMinimized, hasSubMenu, isSubMenu, ...otherProps } = props;
  return <ListItemButton disableGutters {...otherProps} />;
})(({
  theme,
  isMinimized,
  hasSubMenu,
  isSubMenu
}: ListItemStyleProps) => ({
  ...theme.typography.body2,
  height: 48,
  position: "relative",
  textTransform: "capitalize",
  paddingLeft: isMinimized ? theme.spacing(2) : isSubMenu ? theme.spacing(4) : theme.spacing(5),
  paddingRight: isMinimized ? theme.spacing(1) : theme.spacing(2.5),
  color: "#ffffff",
  justifyContent: isMinimized ? 'center' : 'flex-start',
  "&:before": {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: "none",
    position: "absolute",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: isSubMenu ? "#ff4d76" : theme.palette.primary.main,
  },
  "&:hover": {
    backgroundColor: isSubMenu
      ? alpha("#ff4d76", 0.15)
      : alpha(theme.palette.primary.main, 0.15),
    color: isSubMenu ? "#ff4d76" : "#ffffff",
    "& .MuiListItemIcon-root": {
      color: isSubMenu ? "#ff4d76" : "#ffffff",
    },
  },
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 18,
  height: 18,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff"
});

interface SubMenuItemProps {
  item: {
    title: string;
    titleEn: string;
    path?: string;
    icon?: React.ReactNode;
    children?: Array<{
      title: string;
      titleEn: string;
      path?: string;
      icon?: React.ReactNode;
    }>;
  };
  active: (path: string) => boolean;
  isMinimized?: boolean;
  isSubMenu?: boolean;
}

function SubMenuItem({ item, active, isMinimized = false, isSubMenu = false }: SubMenuItemProps) {
  const { locale }: any = useRouter();
  const theme = useTheme();
  const isActiveSub = active(item.path || '');
  const { title, titleEn, path, icon, children } = item;

  const activeSubStyle = {
    color: isSubMenu ? "#ff4d76" : "#ffffff",
    fontWeight: "fontWeightMedium",
    bgcolor: isSubMenu
      ? alpha("#ff4d76", 0.15)
      : alpha(theme.palette.primary.main, 0.15),
    "&:before": { display: "block" },
    '& .MuiListItemIcon-root': {
      color: isSubMenu ? '#ff4d76' : '#ffffff',
    },
  };

  const displayTitle = locale === "en" ? titleEn : title;

  return (
    <Tooltip title={displayTitle} placement="right" arrow enterDelay={200} enterNextDelay={200}>
      <Link href={path || '#'} passHref legacyBehavior>
        <ListItemStyle
            component="a"
            sx={{
              ...(isActiveSub && activeSubStyle),
              cursor: path ? 'pointer' : 'default',
              textDecoration: 'none',
              pl: isMinimized ? theme.spacing(2) : isSubMenu ? 4 : 3,
              height: isSubMenu ? 40 : 48,
              justifyContent: isMinimized ? 'center' : 'flex-start',
              '&:hover': {
                textDecoration: 'none',
                bgcolor: isSubMenu
                  ? alpha('#ff4d76', 0.08)
                  : alpha(theme.palette.primary.main, 0.08),
              }
            }}
          isMinimized={isMinimized}
          isSubMenu={isSubMenu}
        >
          <ListItemIconStyle>
            {icon ? (
              icon
            ) : (
              <Box
                component="span"
                sx={{
                  width: 4,
                  height: 4,
                  display: "flex",
                  borderRadius: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(255, 255, 255, 0.5)",
                  transition: (theme) =>
                    theme.transitions.create("transform"),
                  ...(isActiveSub && {
                    transform: "scale(2)",
                    bgcolor: isSubMenu ? "#ff4d76" : "primary.main",
                  }),
                }}
              />
            )}
          </ListItemIconStyle>
          {!isMinimized && (
            <ListItemText
              disableTypography
              primary={locale === "en" ? titleEn : title}
            />
          )}
        </ListItemStyle>
      </Link>
    </Tooltip>
  );
}

interface NavItemProps {
  item: {
    title: string;
    titleEn: string;
    path?: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
    children?: Array<{
      title: string;
      titleEn: string;
      path?: string;
      icon?: React.ReactNode;
      children?: any[];
    }>;
  };
  active: (path: string) => boolean;
  isMinimized?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

function NavItem({ item, active, isMinimized = false, isOpen = false, onToggle }: NavItemProps) {
  const { locale }: any = useRouter();
  const router = useRouter();
  const theme = useTheme();
  const isActiveRoot = active(item.path || '');
  const { title, titleEn, path, icon, info, children } = item;
  const [openSubList, setOpenSubList] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const displayTitle = locale === "en" ? titleEn : title;

  const handleOpen = () => {
    if (onToggle) {
      onToggle();
    }
  };

  const handleSubListClick = () => {
    setOpenSubList(!openSubList);
  };

  useEffect(() => {
    if (!isOpen) {
      setOpenSubList(false);
    }
  }, [isOpen]);

  const activeRootStyle = {
    color: "#ffffff",
    fontWeight: "fontWeightMedium",
    bgcolor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity
    ),
    "&:before": { display: "block" },
  };

  const activeSubStyle = {
    color: "#ff4d76",
    fontWeight: "fontWeightMedium",
    bgcolor: alpha("#ff4d76", 0.15),
    '& .MuiListItemIcon-root': {
      color: '#ff4d76',
    },
  };

  if (children) {
    const hasSubMenu = children.some(child => child.children);

    return (
      <React.Fragment>
        <Tooltip title={displayTitle} placement="right" arrow enterDelay={200} enterNextDelay={200}>
          <ListItemStyle
            className={`nav-item ${isOpen ? 'open' : ''}`}
            sx={{
              ...(isActiveRoot && activeRootStyle),
              ...(isOpen && {
                bgcolor: '#804FE6',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              }),
              cursor: 'pointer'
            }}
            isMinimized={isMinimized}
            ref={anchorRef}
            hasSubMenu={hasSubMenu}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              handleOpen();
              if (isMinimized) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
            {!isMinimized && (
              <ListItemText
                disableTypography
                primary={displayTitle}
              />
            )}
            {info && !isMinimized && info}
            {!isMinimized && (
              <Box
                component={Icon}
                icon={isOpen ? arrowIosDownwardFill : arrowIosForwardFill}
                sx={{ width: 16, height: 16 }}
              />
            )}
          </ListItemStyle>
        </Tooltip>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            sx={{
              maxHeight: '300px',
              overflowY: 'auto',
              position: 'relative',
              zIndex: 999,
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#1a1f38',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#444',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}>

            {children.map((item) => {
              const { title, titleEn, path, children: subChildren } = item;
              const isActiveSub = active(path || '');
              const itemKey = locale === "mon" ? title : titleEn;

              if (subChildren) {
                return (
                  <div key={itemKey}>
                    <Tooltip title={locale === "en" ? titleEn : title} placement="right" arrow>
                      <ListItemButton
                        onClick={handleSubListClick}
                        sx={{
                          ...(isActiveSub && activeSubStyle),
                          cursor: 'pointer',
                          textDecoration: 'none',
                          paddingLeft: isMinimized ? theme.spacing(2) : theme.spacing(4),
                          paddingRight: isMinimized ? theme.spacing(1) : theme.spacing(2.5),
                          '&:hover': {
                            bgcolor: alpha('#ff4d76', 0.12),
                            color: '#ff4d76',
                          },
                          position: 'relative',
                          height: 40,
                          ...(openSubList && {
                            bgcolor: '#232845',
                            color: '#ff4d76',
                            '& .MuiListItemIcon-root': {
                              color: '#ff4d76',
                            },
                          }),
                        }}
                      >
                        <ListItemIconStyle>
                          {item.icon ? (
                            item.icon
                          ) : (
                            <Box
                              component="span"
                              sx={{
                                width: 4,
                                height: 4,
                                display: "flex",
                                borderRadius: "50%",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "rgba(255, 255, 255, 0.5)",
                                transition: (theme) =>
                                  theme.transitions.create("transform"),
                                ...(isActiveSub && {
                                  transform: "scale(2)",
                                  bgcolor: "secondary.main",
                                }),
                              }}
                            />
                          )}
                        </ListItemIconStyle>
                        {!isMinimized && (
                          <ListItemText
                            disableTypography
                            primary={locale === "en" ? titleEn : title}
                          />
                        )}
                        {!isMinimized && (
                          <Box
                            component={Icon}
                            icon={openSubList ? arrowIosDownwardFill : arrowIosForwardFill}
                            sx={{
                              width: 16,
                              height: 16,
                              ml: 1,
                              color: openSubList ? '#ff4d76' : 'inherit'
                            }}
                          />
                        )}
                      </ListItemButton>
                    </Tooltip>

                    <Collapse in={openSubList} timeout="auto" unmountOnExit>
                      <List
                        component="div"
                        disablePadding
                        sx={{
                          pl: isMinimized ? 1 : 4,
                          maxHeight: '300px',
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          bgcolor: '#232845',
                          position: 'relative',
                          zIndex: 999,
                          ...(isMinimized && {
                            width: '180px',
                            position: 'absolute',
                            left: '100%',
                            top: 0,
                            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                            borderRadius: '0 4px 4px 0',
                          }),
                          '&::-webkit-scrollbar': {
                            width: '4px',
                          },
                          '&::-webkit-scrollbar-track': {
                            background: '#1a1f38',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: '#444',
                            borderRadius: '4px',
                          },
                          '&::-webkit-scrollbar-thumb:hover': {
                            background: '#555',
                          },
                        }}
                      >
                        {subChildren.map((subItem) => (
                          <SubMenuItem
                            key={subItem.title}
                            item={subItem}
                            active={active}
                            isMinimized={isMinimized}
                            isSubMenu={true}
                          />
                        ))}
                      </List>
                    </Collapse>
                  </div>
                );
              }
              return item.path === "/conf/hotel-setting" ? (
                localStorage.getItem("hotelId") === "1" && (
                  <Link key={title} href={path || '#'} passHref legacyBehavior>
                    <Tooltip title={(locale === "en" ? titleEn : title)} placement="right" arrow enterDelay={200} enterNextDelay={200}>
                      <ListItemStyle
                        component="a"
                        sx={{
                          ...(isActiveSub && activeSubStyle),
                          cursor: 'pointer',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'none',
                          },
                        }}
                        isMinimized={isMinimized}
                      >
                        <ListItemIconStyle>
                          {item.icon ? (
                            item.icon
                          ) : (
                            <Box
                              component="span"
                              sx={{
                                width: 4,
                                height: 4,
                                display: "flex",
                                borderRadius: "50%",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "rgba(255, 255, 255, 0.5)",
                                transition: (theme) =>
                                  theme.transitions.create("transform"),
                                ...(isActiveSub && {
                                  transform: "scale(2)",
                                  bgcolor: "secondary.main",
                                }),
                              }}
                            />
                          )}
                        </ListItemIconStyle>
                        {!isMinimized && (
                          <ListItemText
                            disableTypography
                            primary={locale === "en" ? titleEn : title}
                          />
                        )}
                      </ListItemStyle>
                    </Tooltip>
                  </Link>
                )
              ) : (
                <Link key={title} href={path || '#'} passHref legacyBehavior>
                  <Tooltip title={(locale === "en" ? titleEn : title)} placement="right" arrow enterDelay={200} enterNextDelay={200}>
                    <ListItemStyle
                      component="a"
                      sx={{
                        ...(isActiveSub && activeSubStyle),
                        cursor: 'pointer',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'none',
                        },
                      }}
                      isMinimized={isMinimized}
                    >
                      <ListItemIconStyle>
                        <Box
                          component="span"
                          sx={{
                            width: 4,
                            height: 4,
                            display: "flex",
                            borderRadius: "50%",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "text.disabled",
                            transition: (theme) =>
                              theme.transitions.create("transform"),
                            ...(isActiveSub && {
                              transform: "scale(2)",
                              bgcolor: "secondary.main",
                            }),
                          }}
                        />
                      </ListItemIconStyle>
                      {!isMinimized && (
                        <ListItemText
                          disableTypography
                          primary={locale === "en" ? titleEn : title}
                        />
                      )}
                    </ListItemStyle>
                  </Tooltip>
                </Link>
              );
            })}
          </List>
        </Collapse>
      </React.Fragment>
    );
  }

  return (
    <>
      <Link href={path || '#'} passHref legacyBehavior>
        <Tooltip title={displayTitle} placement="right" arrow enterDelay={200} enterNextDelay={200}>
          <ListItemStyle
            component="a"
            sx={{
              ...(isActiveRoot && activeRootStyle),
              cursor: 'pointer',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'none',
              },
            }}
            isMinimized={isMinimized}
            ref={anchorRef}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
              {!isMinimized && (
                <ListItemText disableTypography primary={displayTitle} />
              )}
              {info && !isMinimized && info}
            </Box>
          </ListItemStyle>
        </Tooltip>
      </Link>
    </>
  );
}

interface NavSectionProps {
  navConfig: Array<{
    title: string;
    titleEn: string;
    path?: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
    children?: Array<{
      title: string;
      titleEn: string;
      path?: string;
      icon?: React.ReactNode;
      children?: Array<{
        title: string;
        titleEn: string;
        path?: string;
        icon?: React.ReactNode;
      }>;
    }>;
  }>;
  isMinimized?: boolean;
  [key: string]: any; // For other props
}

export default function NavSection({ navConfig, isMinimized = false, ...other }: NavSectionProps) {
  const router = useRouter();
  const match = (path: string | undefined): boolean => (path ? path === router.pathname : false);
  const { locale }: any = useRouter();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Function to close all other menus when one is opened
  const handleToggleMenu = (menuKey: string) => {
    setOpenMenus(prev => {
      // Close all other menus and toggle the clicked one
      const newState: Record<string, boolean> = {};
      newState[menuKey] = !prev[menuKey];

      // Also close any open popovers
      const navItems = document.querySelectorAll('.nav-item');
      navItems.forEach((item) => {
        if (item.classList.contains('open')) {
          item.classList.remove('open');
        }
      });

      return newState;
    });
  };

  return (
    <Box {...other}>
      <List disablePadding>
        {navConfig.map((item) => {
          const itemKey = locale == "mon" ? item.title : item.titleEn;
          return (
            <NavItem
              key={itemKey}
              item={item}
              active={match}
              isMinimized={isMinimized}
              isOpen={openMenus[itemKey] || false}
              onToggle={() => handleToggleMenu(itemKey)}
            />
          );
        })}
      </List>
    </Box>
  );
}