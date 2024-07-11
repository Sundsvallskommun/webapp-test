export  const toReadableTimestamp = (value: string) :string => {
    const date = new Date(value);
    return date.toLocaleDateString()  + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  };
