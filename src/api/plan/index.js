import {axiosD, axiosG, axiosK, axiosM, axiosP} from "@/api";

/**
 * @description 工作计划
 * */
export const addWorkPlanApi = data => axiosK("workPlan/addWorkPlan", data); // 添加工作计划管理
export const delWorkPlanApi = data => axiosD("workPlan/delWorkPlan", data); // 删除工作计划管理
export const editWorkPlanApi = data => axiosP("workPlan/editWorkPlan", data); // 更改工作计划管理
export const getWorkPlanApi = data => axiosG("workPlan/getWorkPlan", data); // 获得工作计划管理详情
export const getWorkPlanScopeApi = data => axiosG("workPlan/getWorkPlanScope", data); // 获得工作计划发送范围
export const pageWorkPlanApi = data => axiosG("workPlan/pageWorkPlan", data); // 分页获得工作计划管理
export const pageReadConditionApi = data => axiosG("workPlan/pageReadCondition", data); // 分页获得阅读情况
export const editPublicUserApi = data => axiosM("workPlan/editPublicUser", data); // 更改开放成员

export const checkReadApi = data => axiosG("workPlan/checkRead", data); // 检测是否有工作计划未阅读
export const pageCurrentWorkPlanApi = data => axiosG("workPlan/pageCurrentWorkPlan", data); // 获得自己的工作计划
export const successReadApi = data => axiosP("workPlan/successRead", data); // 完成阅读
