export const theme = {
  colors: {
    // Primary colors
    black: '#000',
    white: '#fff',
    
    // Gray scale
    gray: '#757575',
    lightGray: '#E0E0E0',
    darkGray: '#424242',
    
    // Brand colors
    primary: '#0a7ea4',
    primaryDark: '#1976D2',
    secondary: '#2196F3',
    accent: '#FFD636FF',
    
    // Semantic colors
    error: '#FF4757',
    success: '#2ED573',
    warning: '#FFA726',
    info: '#29B6F6',
    
    // Surface colors
    background: '#fff',
    surface: '#F5F5F5',
    surfaceVariant: '#E8F4FD',
    errorSurface: '#FFE8E8',
    
    // Border and divider
    border: '#757575',
    divider: '#E0E0E0',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.3)',
    
    // Text colors
    text: '#11181C',
    textSecondary: '#687076',
    textInverse: '#fff',
    
    // Legacy theme compatibility (from Colors.ts)
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4'
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xl: 16
  },
  spacing: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  fontSize: {
    xxs: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 32
  },
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 12,
    }
  }
};