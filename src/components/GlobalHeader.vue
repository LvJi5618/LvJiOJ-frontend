<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/oj-logo.svg" />
            <div class="title">律己 OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visiableRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div>
        {{ store.state.user?.loginUser?.userName ?? "未登录" }}
      </div>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { routes } from "../router/routes";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/ACCESS_ENUM";

const router = useRouter();
// 菜单栏默认显示主页,即"浏览题目"页
const selectedKeys = ref(["/"]);
// 点击菜单项执行该事件
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
// 路由跳转后，更新选中的菜单栏
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});
// store -> 用于获取全局共享变量
const store = useStore();
// 根据权限决定展示在菜单栏的中菜单项
const visiableRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item?.meta?.hideInMenu) {
      return false;
    }
    //通过权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});
// setTimeout(() => {
//   store.dispatch("user/getLoginUser", {
//     userName: "律己管理员",
//     userRole: ACCESS_ENUM.ADMIN,
//   });
// }, 3000);
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}
.logo {
  height: 48px;
}

.title {
  color: #444;
  margin-left: 16px;
}
</style>
