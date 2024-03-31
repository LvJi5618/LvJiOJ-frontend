import router from "@/router";
import store from "@/store";
import ACCESS_ENUM from "./ACCESS_ENUM";
import checkAccess from "./checkAccess";
/**
 * 全局权限管理
 */
router.beforeEach(async (to, from, next) => {
  const user = store.state.user;
  let currentUser = user.loginUser;
  console.log("登录用户信息", currentUser);
  // 先尝试获取用户登录信息
  if (!currentUser || !currentUser.userRole) {
    await store.dispatch("user/getLoginUser");
  }
  // 如果跳转的页面必须要先登录
  currentUser = user.loginUser;
  const needAccess = (to?.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // 没登录，跳转到登录页
    if (!currentUser || !currentUser.userRole) {
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    // 已登录，但当前用户没有访问页面的权限，跳转到‘无权限’页面
    if (!checkAccess(currentUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }
  next();
});
