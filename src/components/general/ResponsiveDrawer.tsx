import { ListSubheader, SvgIcon } from '@mui/material';
import { Link } from 'gatsby';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ListItemButton } from 'gatsby-material-ui-components';
import { theme } from '../theme';

const drawerWidth = 240;

interface MenuItem {
  title: string;
  icon: typeof SvgIcon;
  url?: string;
}

interface MenuCategory {
  title?: React.ReactNode;
  children: MenuItem[];
}

interface MiniDrawerProps {
  children?: React.ReactNode;
  menu: MenuCategory[];
  title?: React.ReactNode;
}

interface Props {
  children?: React.ReactNode;
  pathname: string;
  menu: MenuCategory[];
  icon?: typeof SvgIcon;
  title?: React.ReactNode;
  brand?: React.ReactNode;
}

export function ResponsiveDrawer({ children, pathname, menu, icon: Icon, title, brand }: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        {brand}
      </Toolbar>
      <Divider />

      {menu.map(({ title: categoryTitle, children: categoryChildren }, i) => (
        <React.Fragment key={i}>
          {i !== 0 && (
            <Divider />
          )}
          <List>
            {categoryTitle && <ListSubheader>{categoryTitle}</ListSubheader>}
            {categoryChildren.map(({ title, icon: Icon, url }, j) => (
              <ListItem key={j} disablePadding sx={{ display: 'block' }}>
                <ListItemButton selected={url === pathname} to={url}> {/* TODO split `?` */}
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
        /* @ts-ignore */
        color="success"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          {Icon && (
            <Icon sx={{ mr: 2 }} />
          )}
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, height: '100vh', width: { sm: `calc(100% - ${drawerWidth}px)` }, p: 3, backgroundColor: '#f5f5f5' }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
