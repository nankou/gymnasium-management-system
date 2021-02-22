import {axiosD, axiosG, axiosK, axiosP} from "@/api";

/**
 * @module 部门
 * */
export const addDeptApi = data => axiosK("admin/dept/addDept", data); // 新增部门
export const deleteDeptApi = data => axiosD("admin/dept/delDept", data); // 删除部门
export const editDeptApi = data => axiosP("admin/dept/editDept", data); // 编辑部门
export const treeDeptApi = data => axiosG("admin/dept/treeDept", data); // 获得部门
