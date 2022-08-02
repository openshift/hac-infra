type ListViewLoadError = {
  message: string;
  status: number;
};

type HttpError = {
  message: string;
  status: number;
  response?: {
    status: number;
  };
};

export { ListViewLoadError, HttpError };
