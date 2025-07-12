import React, { useState, useRef, useEffect } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
  Typography,
  Divider
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  AutoAwesome as AutoAwesomeIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import useThemeStore from '../store/themeStore';

const ThemeToggle = ({ variant = 'icon', size = 'medium', className = '' }) => {
  const { theme, effectiveTheme, setTheme, cycleTheme } = useThemeStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (variant === 'dropdown') {
      setAnchorEl(event.currentTarget);
    } else {
      cycleTheme();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    handleClose();
  };

  const getThemeIcon = (themeType) => {
    switch (themeType) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      case 'system':
        return <AutoAwesomeIcon />;
      default:
        return <LightModeIcon />;
    }
  };

  const getThemeLabel = (themeType) => {
    switch (themeType) {
      case 'light':
        return 'Hell';
      case 'dark':
        return 'Dunkel';
      case 'system':
        return 'System';
      default:
        return 'Theme';
    }
  };

  const getThemeDescription = (themeType) => {
    switch (themeType) {
      case 'light':
        return 'Helles Design';
      case 'dark':
        return 'Dunkles Design';
      case 'system':
        return 'System-Einstellung';
      default:
        return 'Theme auswählen';
    }
  };

  // Icon-only variant (default)
  if (variant === 'icon') {
    return (
      <Tooltip title={`Theme wechseln (aktuell: ${getThemeLabel(theme)})`}>
        <IconButton
          onClick={handleClick}
          size={size}
          className={className}
          sx={{
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          {getThemeIcon(theme)}
        </IconButton>
      </Tooltip>
    );
  }

  // Dropdown variant
  return (
    <>
      <Tooltip title={`Theme auswählen (aktuell: ${getThemeLabel(theme)})`}>
        <IconButton
          onClick={handleClick}
          size={size}
          className={className}
          sx={{
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          {getThemeIcon(theme)}
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            minWidth: 200,
            mt: 1,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Theme auswählen
          </Typography>
        </Box>
        
        <Divider />
        
        {[
          { value: 'light', label: 'Hell', icon: <LightModeIcon />, description: 'Helles Design' },
          { value: 'dark', label: 'Dunkel', icon: <DarkModeIcon />, description: 'Dunkles Design' },
          { value: 'system', label: 'System', icon: <AutoAwesomeIcon />, description: 'System-Einstellung' }
        ].map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleThemeSelect(option.value)}
            selected={theme === option.value}
            sx={{
              py: 1.5,
              px: 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {option.icon}
            </ListItemIcon>
            <ListItemText
              primary={option.label}
              secondary={option.description}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
              secondaryTypographyProps={{
                fontSize: '0.75rem',
                color: theme === option.value ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
              }}
            />
            {theme === option.value && (
              <CheckIcon sx={{ fontSize: 18, color: 'inherit' }} />
            )}
          </MenuItem>
        ))}
        
        <Divider />
        
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Aktuell: {getThemeLabel(effectiveTheme)}
            {effectiveTheme !== theme && ` (${getThemeLabel(theme)}-Modus)`}
          </Typography>
        </Box>
      </Menu>
    </>
  );
};

export default ThemeToggle; 