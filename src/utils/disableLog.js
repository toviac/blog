const disableLog = () => {
  if (process.env.NODE_ENV === 'product') {
    console.log = () => {};
  }
};

disableLog();
