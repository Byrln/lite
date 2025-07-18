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
  Popper,
  Paper,
  ClickAwayListener,
  Grow,
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
  paddingLeft: isMinimized ? theme.spacing(2) : isSubMenu ? theme.spacing(3) : theme.spacing(5),
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
  width: 22,
  height: 22,
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

  return (
    <Link href={path || '#'} passHref>
      <ListItemStyle
        component="a"
        sx={{
          ...(isActiveSub && activeSubStyle),
          cursor: path ? 'pointer' : 'default',
          textDecoration: 'none',
          pl: isSubMenu ? 4 : 3,
          '&:hover': {
            textDecoration: 'none',
            bgcolor: isSubMenu
              ? alpha('#ff4d76', 0.08)
              : alpha(theme.palette.primary.main, 0.08),
          },
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
  const theme = useTheme();
  const isActiveRoot = active(item.path || '');
  const { title, titleEn, path, icon, info, children } = item;
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [openSubList, setOpenSubList] = useState(false);
  const anchorRef = useRef(null);
  const [hoverPopupOpen, setHoverPopupOpen] = useState(false);

  const handleOpen = () => {
    if (onToggle) {
      onToggle();
    }
  };

  const handleSubMenuOpen = () => {
    setOpenSubMenu(true);
  };

  const handleSubMenuClose = () => {
    setOpenSubMenu(false);
  };

  const handleSubListClick = () => {
    setOpenSubList(!openSubList);
  };

  const handlePopoverToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isMinimized) {
      // Close any other open popovers before opening this one
      const navItems = document.querySelectorAll('.nav-item');
      navItems.forEach((item) => {
        if (item !== event.currentTarget && item.classList.contains('open')) {
          item.classList.remove('open');
        }
      });
      setHoverPopupOpen(!hoverPopupOpen);
    }
  };

  const handlePopoverClose = () => {
    setHoverPopupOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setOpenSubMenu(false);
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
    // Check if any child has subchildren
    const hasSubMenu = children.some(child => child.children);

    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
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
            cursor: 'pointer',
          }}
          isMinimized={isMinimized}
          ref={anchorRef}
          hasSubMenu={hasSubMenu}
          onClick={(e) => {
            handlePopoverToggle(e);
            handleOpen();
          }}
        >
          <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
          {!isMinimized && (
            <ListItemText
              disableTypography
              primary={locale == "en" ? titleEn : title}
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

        {isMinimized && hoverPopupOpen && (
          <ClickAwayListener onClickAway={handlePopoverClose}>
            <Popper
              open={hoverPopupOpen}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="right"
              transition
              disablePortal
              style={{ zIndex: 1300 }}
              modifiers={[{
                name: 'offset',
                options: {
                  offset: [0, 0],
                },
              }]}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              {({ TransitionProps }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: 'left bottom' }}
                >
                  <Paper
                    elevation={8}
                    sx={{
                      width: 220,
                      overflow: 'hidden',
                      borderRadius: '8px',
                      bgcolor: '#ffffff',
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          p: 2,
                          fontWeight: 'bold',
                          color: '#000000',
                          borderBottom: '1px solid #f0f0f0',
                        }}
                      >
                        {locale == "en" ? titleEn : title}
                      </Box>
                      <List component="div" disablePadding>
                        {children.map((item) => {
                          const { title, titleEn, path } = item;
                          const isActiveSub = active(path || '');
                          return (
                            <Link key={title} href={path || '#'} passHref>
                              <ListItemStyle
                                component="a"
                                sx={{
                                  ...(isActiveSub && {
                                    color: '#ff4d76',
                                    fontWeight: 'fontWeightMedium',
                                    bgcolor: alpha('#ff4d76', 0.08),
                                  }),
                                  color: '#000000',
                                  pl: 2,
                                  '&:hover': {
                                    bgcolor: alpha('#ff4d76', 0.08),
                                    color: '#ff4d76',
                                  },
                                }}
                              >
                                <ListItemText
                                  disableTypography
                                  primary={locale == "en" ? titleEn : title}
                                />
                                {item.children && (
                                  <Box
                                    component={Icon}
                                    icon={arrowIosForwardFill}
                                    sx={{ width: 16, height: 16, color: '#000000' }}
                                  />
                                )}
                              </ListItemStyle>
                            </Link>
                          );
                        })}
                      </List>
                    </Box>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </ClickAwayListener>
        )}

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
                // This is a menu item with sub-dropdown
                return (
                  <div key={itemKey}>
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
                        openSubList ? <Box
                          component={Icon}
                          icon={arrowIosDownwardFill}
                          sx={{ width: 16, height: 16, ml: 1 }}
                        /> : <Box
                          component={Icon}
                          icon={arrowIosForwardFill}
                          sx={{ width: 16, height: 16, ml: 1 }}
                        />
                      )}
                    </ListItemButton>

                    <Collapse in={openSubList} timeout="auto" unmountOnExit>
                      <List
                        component="div"
                        disablePadding
                        sx={{
                          pl: 4,
                          maxHeight: '300px',
                          overflowY: 'auto',
                          bgcolor: '#232845',
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
                        }}
                      >
                        {subChildren.map((subItem) => (
                          <SubMenuItem
                            key={subItem.title}
                            item={subItem}
                            active={active}
                            isMinimized={false}
                            isSubMenu={true}
                          />
                        ))}
                      </List>
                    </Collapse>
                  </div>
                );
              }

              // Regular menu items without sub-dropdown
              return item.path === "/conf/hotel-setting" ? (
                localStorage.getItem("hotelId") === "1" && (
                  <Link key={title} href={path || '#'} passHref>
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
                  </Link>
                )
              ) : (
                <Link key={title} href={path || '#'} passHref>
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
                </Link>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <>
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
        onClick={(e) => handlePopoverToggle(e)}
      >
        <Link href={path || '#'} passHref>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
            {!isMinimized && (
              <ListItemText disableTypography primary={locale == "en" ? titleEn : title} />
            )}
            {info && !isMinimized && info}
          </Box>
        </Link>
      </ListItemStyle>

      {isMinimized && hoverPopupOpen && (
        <ClickAwayListener onClickAway={handlePopoverClose}>
          <Popper
            open={hoverPopupOpen}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="right"
            transition
            disablePortal
            style={{ zIndex: 1300 }}
            modifiers={[{
              name: 'offset',
              options: {
                offset: [0, 0],
              },
            }]}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: 'left bottom' }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    width: 220,
                    overflow: 'hidden',
                    borderRadius: '8px',
                    bgcolor: '#ffffff',
                  }}
                >
                  <Box>
                  <Link href={path || '#'} passHref>
                    <ListItemStyle
                      component="a"
                      sx={{
                        p: 2,
                        color: '#000000',
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: alpha('#ff4d76', 0.08),
                          color: '#ff4d76',
                        },
                      }}
                    >
                      <ListItemText disableTypography primary={locale == "en" ? titleEn : title} />
                    </ListItemStyle>
                  </Link>
                </Box>
                </Paper>
              </Grow>
            )}
          </Popper>
        </ClickAwayListener>
      )}
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
