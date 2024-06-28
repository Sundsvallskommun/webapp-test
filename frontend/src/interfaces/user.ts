export interface Permissions {
  canView: boolean;
}
export interface User {
  name: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  userSettings: {
    readNotificationsClearedDate: string;
  };
}