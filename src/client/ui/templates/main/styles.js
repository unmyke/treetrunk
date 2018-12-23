export default {
  container: {
    display: 'grid',
    'min-height': '100vh',
    'max-height': '100vh',
    'grid-template-columns': 'auto 1fr',
    'grid-template-areas': `
      "header"
      .
      "footer";
     `,
  },
  header: {
    'grid-area': 'header',
    'z-index': 1,
  },
  footer: {
    'grid-area': 'footer',
  },
};
