<template>
  <section class="os-container">
    <section class="time">
      <h1>当前时间: 第{{modle.currentTime}}秒</h1>
      <mu-button color="primary" @click="open = !open">Console</mu-button>
    </section>

    <section class="out">
      <h2 style="display: inline-block; text-align: center;width: 100% "> 外存作业 {{modle.outPcb.length == 0 ? "无" : ""}}</h2>
      <div style=" margin-top: 12px">
        <span v-for="item in modle.outPcb" style="display: inline-block; text-align: center;width: 100% ">
          进程id:{{item.pid}}
          到时时间: {{item.arrive_time}}
        </span>
      </div>
    </section>

    <section class="in">
      <section class="in-container">
        <h2 style="margin-bottom: 0px;margin-left: 16px;">内存进程</h2>
        <section class="pcb-container">
          <mu-paper class="pcb-view" :z-depth="2" v-for="item in modle.innerPcb"
                    :style="{padding: '16px' ,background: item.status == 1 ? '#648cff' : '#eee' }">
            PID : {{item.pid}}<br>
            服务时间: {{item.serve_time}}<br>
            需要运行时间时间: {{item.length}}<br>
            状态: {{item.status == 1 ? "运行" :"等待" }}<br>
            所需空间{{item.sizeRequired}}<br>
          </mu-paper>
        </section>
      </section>

      <section class="in-container">
        <h2 style="margin-bottom: 0px;margin-left: 16px;">已完成进程</h2>
        <section class="pcb-container">
          <mu-paper class="pcb-view" :z-depth="2" v-for="item in modle.finishedPcb"
                    :style="{padding: '16px' ,background: item.status == 1 ? '#648cff' : '#eee' }">
            PID : {{item.pid}}<br>
            服务时间: {{item.serve_time}}<br>
            需要运行时间时间: {{item.length}}<br>
            状态: 已完成<br>
            所需空间{{item.sizeRequired}}<br>
          </mu-paper>
        </section>
      </section>

    </section>

    <div class="memory_container">
      <div v-for="item in modle.memory">
        <div class="memory"
             :style="{height:(item.size/(920/controller.getTotalSize()))+ 'px', backgroundColor: item.state===1 ? '#648cff': '#ff672c'}">
          <div>内存大小: {{item.size}}</div>
          <div>装入进程ID : {{item.pid || item.pid == 0?item.pid:'无'}}</div>
          <span
            style=" position: absolute; left: -24px; top: -6px; color: #000; font-size: 12px; ">{{item.address}}</span>
        </div>
      </div>
    </div>

    <mu-paper :z-depth="2" class="console" v-if="open">
      <mu-button v-on:click="add1()">随机添加一个进程到外存</mu-button>
      <mu-button v-on:click="addN(10)">随机添加⑩个进程到外存</mu-button>
      <mu-button v-on:click="speedUp">加速</mu-button>
      <mu-button v-on:click="speedDown">减速</mu-button>
    </mu-paper>

  </section>
</template>

<script>

  import OS_Modle from "@/components/OS_Modle";
  import PcbController from "@/components/PcbController"
  import Pcb from "@/components/Pcb"

  const controller = new PcbController();

  export default {

    name: 'HelloWorld',
    data() {
      return {
        modle: OS_Modle,
        controller,
        open: false,
        currentIndex: -1,
        currentSpeed: 1000,
        fileControl: false
      }
    },
    methods: {
      addN(N) {
        var i = 0;
        while (i < N) {
          OS_Modle.outPcb.push(new Pcb(++this.currentIndex, "Process" + this.currentIndex,
            Math.round(Math.random() * 25), Math.max(50, Math.round(Math.random() * 400))))
          i++;
        }
      },
      add1() {
        OS_Modle.outPcb.push(new Pcb(++this.currentIndex, "Process" + this.currentIndex,
          Math.round(Math.random() * 25), Math.max(50, Math.round(Math.random() * 400))))
      },
      speedUp() {
        clearInterval();
        this.currentSpeed -= 10;
        setInterval(function () {
          controller.next()
        }, this.currentSpeed)
      },
      speedDown() {
        clearInterval();
        this.currentSpeed += 10;
        setInterval(function () {
          controller.next()
        }, this.currentSpeed)
      }
    },
    created() {
      this.addN(10)
      setInterval(function () {
        controller.next()
      }, this.currentSpeed)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .console .mu-button {
    height: 120px;
  }

  .console {
    width: 600px;
    height: 300px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pcb-container {
    padding: 16px;
    display: flex;
    max-width: 1200px;
    flex-wrap: wrap
  }

  .pcb-view {
    min-width: 180px;
    width: 180px;
  }

  .paper {
    background-color: white;
    box-shadow: 1px 1px 4px #7a7a7a;
  }

  .time {
    z-index: 999;
    position: fixed;
    right: 16px;
    top: 16px;
    width: 240px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px solid #eee;
  }

  .memory {
    z-index: 999;
    position: relative;
    width: 240px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-bottom: 2px solid #eee;
  }

  .memory_container {
    right: 8px;
    bottom: 8px;
    position: fixed;
  }

  .os-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .in-container {
    margin-left: 16px;
  }

  .out {
    position: absolute;
    width: 150px;
    float: left;
    min-height: 100%;
  }

  .in {
    position: absolute;
    left: 140px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
