export const clamp = (value: number|null|undefined, min: number, max: number, def?: number) => {
  if(value == null || Number.isNaN(value)) return def??min;
  return Math.max(min, Math.min(value, max));
}

export const randomId = (size?: number) => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  const amount = size ?? 40;
  for (let i = 0; i < amount; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset.charAt(randomIndex);
  }
  return randomString;
}

export const  getElapsedTime = (date: Date) => {
  const diffMs = Date.now() - date.getTime();

  const totalSeconds = Math.floor(diffMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let displayText = '';
  if(hours > 0) displayText += hours+'h ';
  if(minutes > 0) displayText += minutes+'min ';
  displayText += seconds+'s';

  return displayText;
}

export const removeAccents = (value: string): string => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export const compareTextForSearch = (text: string, search: string, options?: {searchMatchAccent?: boolean, searchMatchCase?: boolean, searchdMatchWholeWord: boolean}): boolean=> {
  let newSearch = search.trim();
  let newText = text.trim();
  if(options) {
    if(!options.searchMatchAccent){
      newSearch = removeAccents(newSearch);
      newText = removeAccents(newText);
    }
    if(!options.searchMatchCase){
      newSearch = newSearch.toLowerCase();
      newText = newText.toLowerCase();
    }
  
    if(options.searchdMatchWholeWord){
      const v = (newText === newSearch);
      return v;
    }
    else{
      const v = newText.includes(newSearch);
      return v;
    }
  }
  else{
    let newSearch = search.trim();
    let newText = text.trim();
    newSearch = removeAccents(newSearch);
    newText = removeAccents(newText);
    newSearch = newSearch.toLowerCase();
    newText = newText.toLowerCase();

    return newText.includes(newSearch);
  }
}