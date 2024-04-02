<!-- 在线做题页面 -->
<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig?.timeLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ question.judgeConfig?.memoryLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ question.judgeConfig?.stackLimit ?? 0 }}
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question?.content" />
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="评论" disabled>
            todo 评论区
          </a-tab-pane>
          <a-tab-pane key="answer" title="答案"> 暂不可查看答案 </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item
            field="language"
            label="编程语言"
            style="min-width: 240px"
          >
            <a-select
              v-model="form.language"
              :style="{ width: '320px' }"
              placeholder="选择编程语言"
            >
              <a-option>java</a-option>
              <a-option>cpp</a-option>
              <a-option>go</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :value="form.code"
          :language="form.language"
          :handle-change="changCode"
        />
        <a-divider :size="0" />
        <a-button type="primary" style="min-width: 200px" @click="doSubmit">
          提交代码
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import { Message } from "@arco-design/web-vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import { onMounted, ref, withDefaults, defineProps } from "vue";
import MdViewer from "@/components/MdViewer.vue";
import CodeEditor from "@/components/CodeEditor.vue";

/**
 * 由父组件传入题目id
 */
interface Props {
  id: string;
}
const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});
/**
 * 向后端接口发送请求,获取数据
 */
const question = ref<QuestionVO>();
const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    Message.error("加载题目失败," + res.message);
  }
};
/**
 * 页面加载时,请求后端数据
 */
onMounted(() => {
  loadData();
});
/**
 * 提交题目所需请求参数
 */
const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});
/**
 * 监听代码编辑器内容变化
 * @param value
 */
const changCode = (value: string) => {
  form.value.code = value;
};
/**
 * 提交代码按钮事件
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    Message.success("提交成功");
  } else {
    Message.error("提交失败," + res.message);
  }
};
</script>
<style>
#viewQuestionView {
  max-width: 1400px;
  margin: 0 auto;
}
#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
