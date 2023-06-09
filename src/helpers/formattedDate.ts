import { Post } from "../store/postSlice";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based, so add 1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formattedDate = `${day}-${month}-${year}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  return `${formattedDate} at ${formattedTime}`;
};

export const dateSorter = (array: Array<Post>) => {
  return [...array].sort((a, b) => {
    const dateA: any = new Date(a.createdAt);
    const dateB: any = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
};
