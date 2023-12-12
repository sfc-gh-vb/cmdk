let idCounter = 0;
const useId = () => 'cmdk'+(idCounter++).toString(32);

export { useId };
