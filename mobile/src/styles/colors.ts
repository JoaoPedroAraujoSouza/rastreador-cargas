export const Colors = {
  primary: '#3699ff',
  success: '#1bc5bd',
  danger: '#f64e60',
  darkBg: '#1e1e2d',
  textWhite: '#ffffff',
  
  gradients: {
    purple: ['#8e44ad', '#6c3483'],
    green: ['#1bc5bd', '#0bb7af'],
    red: ['#f64e60', '#ee2d41'],
    blue: ['#3699ff', '#2d7dd2'],
  },
  
  lightGray: '#f8f9fa',
  mediumGray: '#6c757d',
  darkGray: '#343a40',
  transparent: 'transparent',
  
  overlay: 'rgba(0, 0, 0, 0.5)',
  cardBg: 'rgba(30, 30, 45, 0.9)',
  borderLight: 'rgba(255, 255, 255, 0.1)',
} as const;

export default Colors;
