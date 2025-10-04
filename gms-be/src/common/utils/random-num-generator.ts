export function generateRandomNumber(count: number){
  let result = '';

  for (let i = 0; i < count; i++) {
    const digit = Math.floor(Math.random() * 10); 
    result += digit.toString();
  }
  return parseInt(result, 10);
}