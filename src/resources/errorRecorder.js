let error = { message: null, data: {} };

export function getError() {
  return error;
}

export function setError(value) {
  error.message = value.message;
  error.data = value.data;
}

export function resetError() {
  error.message = null;
}
