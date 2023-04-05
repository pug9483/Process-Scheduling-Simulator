# 💻 Process Scheduling Simulator

### **멀티 코어 프로세스 스케줄링 시뮬레이터 구현**

> 2021 운영체제 팀 프로젝트 <br/>
**박예원, 박의균, 손지민, 우상범**

---

## ✔️ 구현 요소

- Basic five scheduling algorithms
    - FCFS(First Come First Service)
    - RR(Round Robin)
    - SPN(Shortest Process Next)
    - SRTN(Shortest Remaining Time Next)
    - HRRN(High Response Ratio Next)
- Our scheduling algorithm
    - **HRR(Half Round Robin)**
        - RR의 프로세스 종료 조건 부분에서 프로세스의 잔여 시간이 퀀텀 시간의 1.5배보다 작거나 같으면 실행되는 알고리즘
        - RR의 context switch overhead가 크다는 단점을 보완
- Multi-core Processor support
- Visualization

---


## 📌 프로젝트 결과물 

### 🔗 [Simulator URL](https://pug9483.github.io/Process-Scheduling-Simulator/)

![운체 중간 2](https://user-images.githubusercontent.com/52346113/229996921-7c4ff83b-57ba-4e34-b6d5-2b5efce51f8c.gif)

