class Pcb {
  process_name; //进程名
  serve_time = 0; //已运行的时间 服务时间
  length; //估计的需要运行的时间
  status = 0; // 0就绪 1运行 -1 终止 -2阻塞
  lastExecuteTime = -1; //-1 表示未执行过 , 当status = -1 该值代表完成时间
  execTime = 0; //一次时间片中执行次数
  pid; // 进程在系统中的编号
  sizeRequired;
  arrive_time ;


  constructor(pid, process_name,length, sizeRequired) {
    this.process_name = process_name;
    this.length = length;
    this.pid = pid;
    this.sizeRequired = sizeRequired;
    this.arrive_time =  Math.round(Math.random() * 100);//随机生成到达时间
  }
}

Pcb.RUN = 1;
Pcb.FIN = -1;
Pcb.WAIT = 0;

export default Pcb;
