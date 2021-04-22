# schoolproject

2021-1학기
## 운영체제 Process Scheduling Simulator
#### 박예원, 박의균, 손지민, 우상범

- FCFS
    FCFS는 선입선출 구조로 되어 있으므로 큐로 구현.
- RR
- SPN
- SRTN
- HRRN
- Your own scheduling algorithm


2021.04.12 우상범
js : 전역변수 / 큐클래스 선언 / 입력데이터처리 / backend / frontend / 실행 등을 주석으로 구분하였음.
각 블록 별로 줄바꿈 3회씩
css : 입력 / 로고 / 출력 으로 css파일 구분하였음.

2021.04.15 우상범
fcfs, rr, spn 구현 완료
그러나 fcfs 와 spn은 업데이트 및 변수정리가 필요
rr에서 contextSWtiching 계산하였으나 특정 경우에 대하여 버그 발생 -> 고쳐야함.

2021-04-21 박의균
-프로그레스바에 P1[시작,종료]로 넣었더니 칸 초과해서 노드 누르면 [시작, 종료] 보이는 이벤트 처리 생성 함수 필요
-if(check())문 다시 고쳐야함. -> return 말고 init()가능하게
-표 만들기용 프로세스 배열 데이터 필요.