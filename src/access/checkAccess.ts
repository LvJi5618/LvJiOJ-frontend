import ACCESS_ENUM from "./ACCESS_ENUM";
/**
 * 检查权限,判断当前登录用户是否具有某个权限
 * @param loginUser 当前登录用户
 * @param needAccess 需要有的权限
 * @returns boolean 有无权限
 */
const checkAccess = (loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
  //获取当前登录用户具有的权限
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  //无权限
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }
  //普通用户权限,需要登录
  if (needAccess === ACCESS_ENUM.USER) {
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false;
    }
  }
  //管理员权限
  if (needAccess === ACCESS_ENUM.ADMIN) {
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false;
    }
  }
  return true;
};
export default checkAccess;
