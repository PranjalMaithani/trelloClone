let loginToken = null;

export function getToken() {
  return loginToken;
}

export function setToken(value) {
  loginToken = value;
  localStorage.setItem("TrulloToken", value);
}

export function getTokenFromStorage() {
  loginToken = localStorage.getItem("TrulloToken") || "";
  return loginToken;
}

export function setTokenToNull() {
  localStorage.setItem("TrulloToken", "");
}
