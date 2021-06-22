<template>
  <card ref="Card">
    <div slot="header">
      <span class="title">审核列表</span>
      <el-input placeholder="输入关键字搜索" v-model="searchTitle" clearable class="w-200" @keyup.enter.native="searchData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="searchData">搜索</el-button>
    </div>
    <div class="exam">
      <el-tabs v-model="activename">
        <el-tab-pane label="待审核" >
          <expand-table :data="formData" name="first" :key="'first'">
            <el-table-column prop="uID" label="用户学号">
              <template slot-scope="scope">
                <span>{{scope.row.uID}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="uname" label="用户姓名">
              <template slot-scope="scope">
                <span>{{scope.row.uname}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fieldID" label="场地编号">
              <template slot-scope="scope">
                <span>{{scope.row.fieldID}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="场地名称">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间">
              <template slot-scope="scope">
                <span>{{scope.row.startTime | formatDateTime}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间">
              <template slot-scope="scope">
                <span>{{scope.row.endTime | formatDateTime}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="场地价格（元/小时）"/>
            <el-table-column prop="createTime" label="申请时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDateTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)" ></el-button>
                <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delRole'"/>
              </template>
            </el-table-column>
          </expand-table>
          <pagination ref="Pagination" @update="getData"/>
          <edit ref="Edit" @update="getData"/>
        </el-tab-pane>

        <el-tab-pane label="已审核">
          <expand-table :data="formData"  name="second" :key="'second'">
            <el-table-column prop="uID" label="用户学号">
              <template slot-scope="scope">
                <span>{{scope.row.uID}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="uname" label="用户姓名">
              <template slot-scope="scope">
                <span>{{scope.row.uname}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fieldID" label="场地编号">
              <template slot-scope="scope">
                <span>{{scope.row.fieldID}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="场地名称">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间">
              <template slot-scope="scope">
                <span>{{scope.row.startTime | formatDateTime}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间">
              <template slot-scope="scope">
                <span>{{scope.row.endTime | formatDateTime}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="场地价格（元/小时）"/>
            <el-table-column prop="createTime" label="申请时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDateTime}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fieldStatus" label="场地审批状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.fieldOrder===0" type="danger">未通过</el-tag>
                <el-tag v-if="scope.row.fieldOrder===1" type="warning">审核中</el-tag>
                <el-tag v-if="scope.row.fieldOrder===2" type="success">已通过</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)" ></el-button>
                <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delRole'"/>
              </template>
            </el-table-column>
          </expand-table>
          <pagination ref="Pagination" @update="getData"/>
          <edit ref="Edit" @update="getData"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </card>
</template>

<script>
export default {
  name: 'Exam',
  data() {
    return {
      activeName: "first",
    }
  }
}
</script>
