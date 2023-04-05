export const waitFor = async (timeout: number, condition: () => boolean): Promise<boolean> => {
    while (!condition() && timeout > 0) {
        timeout -= 100;
        await delay(100);
    }
  
    return timeout > 0 ? true : false;
  };
  
  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }