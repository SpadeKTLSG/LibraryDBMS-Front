<template>
  <div class="app-container home">


    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>图书馆管理系统LDBMS</h2>
        <p>
          LDBMS, Library Database Management System, 图书馆数据库管理系统
          前端页面由@SpadeKTLSG负责开发和维护
          后端由@SpadeKTLSG负责若依框架环境搭建和代码生成
          数据库由@NullBing负责设计和维护, Redis暂时由@SpadeKTLSG本地代理
          业务功能@ABDWL负责设计和实现
        </p>
        <p>
          <b>Version </b> <span>v{{ version }}</span>
        </p>
        <p>


          <el-button
              type="primary"
              icon="Cloudy"
              plain
              @click="goTarget('https://github.com/SpadeKTLSG/LibraryDBMS-Front')"
          >前端
          </el-button>


          <el-button
              type="primary"
              icon="Cloudy"
              plain
              @click="goTarget('https://github.com/SpadeKTLSG/LibraryDBMS')"
          >后端
          </el-button>

          <el-button
              icon="HomeFilled"
              plain
              @click="goTarget('https://github.com/SpadeKTLSG')"
          >A
          </el-button>

          <el-button
              icon="HomeFilled"
              plain
              @click="goTarget('https://github.com/SpadeKTLSG')"
          >C
          </el-button>

          <el-button
              icon="HomeFilled"
              plain
              @click="goTarget('https://github.com/SpadeKTLSG')"
          >W
          </el-button>
        </p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>项目亮点</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>SpringBoot</li>
              <li>JWT</li>
              <li>MyBatis</li>
              <li>Druid</li>
              <li>Fastjson</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue</li>
              <li>Element-ui</li>
              <li>Axios</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>团队管理</h4>
            <ul>
              <li>奴隶契约制</li>
              <li>前后端分离</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>业务开发</h4>
            <ul>
              <li>敏捷开发</li>
              <li>...</li>

            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>


    <el-divider/>


    <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        介绍: 图书馆管理系统，基于Vue3.0+Element-Plus+SpringBoot+MyBatis-Plus开发的前后端分离的后台管理系统

        <hr/>
      </el-col>
    </el-row>


    <el-row :gutter="20">


      <el-col :xs="24" :sm="24" :md="12" :lg="8">

        <el-card class="update-log">

          <template v-slot:header>
            <div class="clearfix">
              <span>Links</span>
            </div>
          </template>

          <div class="body">
            <p>
              <i class="el-icon-s-promotion"></i> 项目地址
              <el-link
                  href="https://gitee.com/SpadeKTLSG/library-dbms-front"
                  target="_blank"
              >
                GO
              </el-link>
            </p>
            <p>
              <i class="el-icon-s-promotion"></i> 开发人员
              <el-link
                  href="https://github.com/SpadeKTLSG"
                  target="_blank"
              >
                GO
              </el-link>
            </p>

          </div>
        </el-card>

      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="8">

        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>Log</span>
            </div>
          </template>

          <el-collapse accordion>
            <el-collapse-item title="v0.6 - 2023-12-26">
              <ol>
                <li>前端基本完成</li>
                <li>前后端联调</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v0.5 - 2023-12-20">
              <ol>
                <li>前端逻辑</li>
                <li>后端建设</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v0.1 - 2023-12-09">
              <ol>
                <li>代码生成</li>
                <li>界面优化</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v0.0 - 2023-12-08">
              <ol>
                <li>项目初始化</li>

              </ol>
            </el-collapse-item>
          </el-collapse>

        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="8">

        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>README</span>
            </div>
          </template>
          <div class="body">
            <p>
              <i class="el-icon-s-promotion"></i> 前端项目
              <el-link
                  href="https://gitee.com/SpadeKTLSG/library-dbms-front"
                  target="_blank"
              >
                MORE
              </el-link>
            </p>
            <p>
              <i class="el-icon-s-promotion"></i> 前端成员
              <el-link
                  href="https://github.com/SpadeKtlsg"
                  target="_blank"
              >
                MORE
              </el-link>
            </p>
            <p>
              <i class="el-icon-s-promotion"></i> 后端项目
              <el-link
                  href="https://gitee.com/SpadeKTLSG/LibraryDBMS"
                  target="_blank"
              >
                MORE
              </el-link>
            </p>
            <p>
              <i class="el-icon-s-promotion"></i> 后端成员
              <el-link
                  href="https://github.com/SpadeKtlsg"
                  target="_blank"
              >
                MORE
              </el-link>
            </p>
            <p>
              <i class="el-icon-s-promotion"></i> 负责人
              <el-link
                  href="https://github.com/SpadeKtlsg"
                  target="_blank"
              >
                MORE
              </el-link>
            </p>
          </div>
        </el-card>
      </el-col>


    </el-row>

  </div>


</template>

<script setup name="Index">
const version = ref('1.0.0')

function goTarget(url) {
  window.open(url, '__blank')
}
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

