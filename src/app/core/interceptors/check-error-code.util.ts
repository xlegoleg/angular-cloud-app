const enum EStatusErrorMessages {
  unauthorized='Unable to do this action, you should be authorized',
  wrongCredentials='Unable to do it, user credentials are wrong, login correct',
}

export const checkErrorCode = (code: number) => {
  switch (code) {
    case 401:
      return EStatusErrorMessages.unauthorized;
    case 403:
      return EStatusErrorMessages.wrongCredentials;
    default:
      return '';
  }
}
