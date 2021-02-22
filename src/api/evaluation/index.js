import {axiosD, axiosFs, axiosG, axiosK, axiosL, axiosM, axiosP} from "@/api";

/**
 * @module 测评项目管理
 * */
export const addEvaluateApi = data => axiosK("evaluate/addEvaluate", data); // 添加测评项目管理
export const delEvaluateApi = data => axiosD("evaluate/delEvaluate", data); // 删除测评项目管理
export const editEvaluateApi = data => axiosP("evaluate/editEvaluate", data); // 更改测评项目管理
export const getEvaluateApi = data => axiosG("evaluate/getEvaluate", data); // 获得测评项目管理详情
export const pageEvaluateApi = data => axiosG("evaluate/pageEvaluate", data); // 分页获得测评项目管理
export const editEvaluateStateApi = data => axiosP("evaluate/editEvaluateState", data); // 开启和关闭测评项目
export const getEvaluateStateApi = data => axiosG("evaluate/getEvaluateState", data); // 获得测评项目开关状态
export const importExcelApi = data => axiosFs("evaluate/importExcel", data); // Excel导入

/**
 * @module 题目
 * */
export const addTopicApi = data => axiosK("evaluate/addTopic", data); // 添加题目
export const delTopicApi = data => axiosD("evaluate/delTopic", data); // 删除题目
export const editTopicApi = data => axiosP("evaluate/editTopic", data); // 更改题目
export const getTopicApi = data => axiosG("evaluate/getTopic", data); // 获得题目详情
export const pageTopicApi = data => axiosG("evaluate/pageTopic", data); // 分页获得题目
export const addTestPapersApi = data => axiosK("evaluate/addTestPapers", data); // 添加测评项目答案

/**
 * @module 情况
 * */
export const pageConditionApi = data => axiosG("evaluate/pageCondition", data); // 获得测评情况

/**
 * @module 结果
 * */
export const exportResultApi = data => axiosL("evaluate/exportResult", data); // Excel导出结果
export const pageResultApi = data => axiosG("evaluate/pageResult", data); // 获得测评结果
export const pageResultDetailApi = data => axiosG("evaluate/pageResultDetail", data); // 获得测评结果详情

/**
 * @module 范围
 * */
export const editScopeApi = data => axiosM("evaluate/editScope", data); // 更改测试发送范围
export const getScopeApi = data => axiosG("evaluate/getScope", data); // 获得测试发送范围
export const getDeptAndNameApi = data => axiosG("evaluate/getDeptAndName", data); // 获得部门及其下级人员

/**
 * @module 其他
 * */
export const pageCurrentEvaluateApi = data => axiosG("evaluate/pageCurrentEvaluate", data); // 获得当前用户测评项目
