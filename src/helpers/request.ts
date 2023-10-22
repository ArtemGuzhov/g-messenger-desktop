import axios from "axios";

export enum GraphqType {
  QUERY = "QUERY",
  MUTATION = "MUTATION",
}

export const request = async <T>(
  schema: string,
  type: GraphqType,
  isPublic = false
): Promise<T> => {
  const body = JSON.stringify({
    query: `${type.toLowerCase()} { ${schema} }`,
    variables: {},
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:3005/graphql",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  };

  const {
    data: { data: response, errors },
  } = await axios<{
    data: T | null;
    errors?: {
      message: string;
    }[];
  }>(config).catch();

  if (response === null && errors) {
    throw errors[0].message;
  }

  if (response) {
    return response;
  }

  if (response === null && !errors) {
    throw "Unknow error";
  }

  return response;
};
