import {Timestamp} from "firebase/firestore";

const options: {[k:string]: Intl.DateTimeFormatOptions} = {
  year: {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  },
  month: {
    day: '2-digit',
    month: 'short',
  },
  week: {
    weekday: 'short',
  },
  day: {
    hour: '2-digit',
    minute: '2-digit',
  },
}


export function formatDate(timestamp: Timestamp): string {
  const currentDate = new Date();
  const date = timestamp.toDate();

  if (date.getFullYear() < currentDate.getFullYear()) {
    return date.toLocaleDateString("ru", options.year);
  }

  if (currentDate.getDate() - date.getDate() >= 7) {
    return date.toLocaleDateString("ru", options.month);
  }

  if (date.getDate() < currentDate.getDate()) {
    return date.toLocaleDateString("ru", options.week);
  }

  return date.toLocaleTimeString("ru", options.day);
}


export function formatLastOnlineDate(timestamp: number) {
  const currentDate = new Date();
  const date = new Date(timestamp);
  const dateTime = date.toLocaleTimeString("ru", options.day);
  const result = ["был(а)"];

  if (date.getFullYear() < currentDate.getFullYear()) {
    result.push(date.toLocaleDateString("ru", options.year), "в", dateTime);
  }
  else if (currentDate.getDate() - date.getDate() > 1) {
    result.push(date.toLocaleDateString("ru", options.month), "в", dateTime);
  }
  else if (currentDate.getDate() - date.getDate() === 1) {
    result.push("вчера в", dateTime);
  }
  else {
    result.push("в", dateTime);
  }

  return result.join(" ");
}


export function formatMessageDate(timestamp: Timestamp): string {
  const date = timestamp.toDate();

  return date.toLocaleDateString("ru", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
