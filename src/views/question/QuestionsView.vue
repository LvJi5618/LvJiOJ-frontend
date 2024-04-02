<!-- 浏览题目页面 -->
<template>
  <div id="questionsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="名称" style="min-width: 240px">
        <a-input v-model="searchParams.title" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 240px">
        <a-input-tag v-model="searchParams.tags" placeholder="请输入标签" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSearch">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-divider :size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        current: searchParams.current,
        pageSize: searchParams.pageSize,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #tags="{ record }">
        <a-space>
          <a-tag
            v-for="(tagItem, index) of record.tags"
            :key="index"
            color="green"
            >{{ tagItem }}</a-tag
          >
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        {{
          `${record.submitNum ? record.submitNum / record.acceptedNum : "0"}%(${
            record.submitNum
          }/${record.acceptedNum})`
        }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY MM DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="toQuestionPage(record)"
            >做题</a-button
          >
        </a-space>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { Message } from "@arco-design/web-vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import { onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";

const columns = [
  {
    title: "题号",
    dataIndex: "id",
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    slotName: "optional",
  },
];

const tableRef = ref();
const dataList = ref([]);
const total = ref(0);
/**
 * 搜索请求参数
 */
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  pageSize: 1,
  current: 1,
});
/**
 * 向后端接口发送请求,获取数据
 */
const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    Message.error("加载题目列表失败," + res.message);
  }
};
/**
 * 页面加载时,请求后端数据
 */
onMounted(() => {
  loadData();
});
/**
 * 搜索事件
 */
const doSearch = () => {
  //得到搜索接口后,需要将页号重置至第一页
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
/**
 * 跳转到做题页
 */
const router = useRouter();
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};
/**
 * 分页事件
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};
/**
 * 监听 searchParams 变量,当变量改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});
</script>
<style scoped>
#questionsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
