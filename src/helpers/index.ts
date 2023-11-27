export const getOnlineTime = (onlineAt: string): string => {
  const onlineDate = new Date(onlineAt);
  const nowDate = new Date();

  const differenceInMilliseconds = nowDate.getTime() - onlineDate.getTime();

  const differenceInMillisecondsRounded = Math.floor(differenceInMilliseconds);

  const years = Math.floor(
    differenceInMillisecondsRounded / 1000 / 60 / 60 / 24 / 30 / 12
  );

  if (years) {
    return `${years} год`;
  }

  const months = Math.floor(
    differenceInMillisecondsRounded / 1000 / 60 / 60 / 24 / 30
  );

  if (months) {
    return `${months} месяц`;
  }

  const days = Math.floor(
    differenceInMillisecondsRounded / 1000 / 60 / 60 / 24
  );

  if (days) {
    if (days === 1) {
      return `вчера`;
    }

    return `${days} дня`;
  }

  const hours = Math.floor(differenceInMillisecondsRounded / 1000 / 60 / 60);

  if (hours) {
    if (hours === 1) {
      return `час`;
    }

    return `${hours} часа`;
  }

  const minutes = Math.floor(differenceInMillisecondsRounded / 1000 / 60);

  return `${minutes} минут`;
};

export const getMessageTime = (createdAt: string): string => {
  const date = new Date(createdAt);
  const minutes = date.getMinutes();
  return date.getHours() + ":" + (minutes < 10 ? `0${minutes}` : minutes);
};

export const getCommentsCountLabel = (count?: number): string => {
  const checkedStr = `${count}`;

  if (!count) {
    return "Комментарии";
  }

  if (checkedStr === "11") {
    return `${count} комментариев`;
  }

  if (checkedStr[0] === "1") {
    return `${count} комментарий`;
  }

  if (checkedStr[0] === "2" || checkedStr[0] === "3" || checkedStr[0] === "4") {
    return `${count} комментария`;
  }

  return `${count} комментариев`;
};

export const getDividerTime = (createdAt: string): string => {
  const nowAt = new Date().toLocaleDateString("ru");
  createdAt = new Date(createdAt).toLocaleDateString("ru");

  if (nowAt === createdAt) {
    return "Сегодня";
  }

  return createdAt;
};
