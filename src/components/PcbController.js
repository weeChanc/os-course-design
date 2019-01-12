import MemoryControl from "@/components/MemoryControl";
import OS_Modle from '@/components/OS_Modle'
import Pcb from '@/components/Pcb'

let memoryControl = new MemoryControl(720);

class PcbController {
  // queue = []
  activedPcb = OS_Modle.activedPcb
  inPcbs = OS_Modle.innerPcb
  outPcbs = OS_Modle.outPcb
  finishedPcb = OS_Modle.finishedPcb
  currentTime = -1;

  add(added){
    memoryControl.totalMemorySize += added;
  }

  getTotalSize(){
    return memoryControl.totalMemorySize;
  }

  addToWait() {
    //首先对作业进行排序
    this.outPcbs.sort((a,b)=>{
      return a.arrive_time - b.arrive_time;
    })
    //根据当前时间与作业到达时间,尝试分配内存,如果分配成功则调入内存,否则不作处理
    for(let i = 0 ; i < this.outPcbs.length ; i++){
      const outPcb = this.outPcbs[i]
        if(this.currentTime >= outPcb.arrive_time && memoryControl.alloc(outPcb.pid,outPcb.sizeRequired)){
          this.outPcbs.splice(i, 1) //从原来中删除
          this.inPcbs.push(outPcb); //添加进去
        }
    }
  }

  /**
   * 结束进程
   * @param toFinished 需要结束的进程
   */
  finishProcess(toFinished) {
    for (let i = 0; i < this.inPcbs.length; i++) {
      if (toFinished.pid === this.inPcbs[i].pid) {
        const result = this.inPcbs.splice(i, 1)
        result.status = Pcb.FIN
        this.finishedPcb.push(Object.assign({}, result[0]))
        memoryControl.free(toFinished.pid)
        return
      }
    }
  }

  findNextPcb(currentPCB) {
    //对于RR轮转法,需要指定时间片大小
    if (this.inPcbs.length === 0) return null;

    if (currentPCB == null) {
      if (this.inPcbs.length !== 0) return this.inPcbs[0];
      return null;
    }

    if (currentPCB.execTime < 3) { //这里规定时间片大小为3
      return currentPCB;
    } else {
      const result = this.inPcbs.splice(0, 1)[0]
      result.status = 0
      result.execTime = 0;
      this.inPcbs.push(result);
      return this.inPcbs[0]
    }
  }

  next() {
    OS_Modle.currentTime++; //执行时间+1
    this.currentTime ++;
    var activedPCB = this.activedPcb;
    this.addToWait();//在该时刻到达的PCB,加入等待队列
    if (this.activedPcb) {
      //到了下一轮,给之前的PCB加上1的服务时间
      activedPCB.serve_time++;
      // 之前的PCB最终执行时间为当前时刻
      activedPCB.lastExecuteTime = this.currentTime;
      activedPCB.execTime++;
      if (activedPCB.serve_time >= activedPCB.length) {
        activedPCB.status = -1;
        this.finishProcess(activedPCB);
      }
    }

    activedPCB = this.activedPcb = this.findNextPcb(activedPCB);

    if (activedPCB === null) {
      return;
    }

    if (activedPCB.status !== Pcb.FIN) {
      activedPCB.status = Pcb.RUN;
    }
    return;
  }
}

export default PcbController;
