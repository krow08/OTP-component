export const mockFetchRandomNumber = async (): Promise<number[]> => {
    // Simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  
    // Return a random number between 1000 and 9999
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return [randomNumber];
  };
  