export { fcfs, rr, spn, sptn, hrrn, newalgorithm, test }; 

// 알고리즘 6개
function test(){
    console.log("SDfa");
}


function fcfs(){ 
    //큐
    const readyQueue = new Queue(); // 레디큐 생성
    let dequeProcess = new Array();
    let workIndex

    //시간
    let presentTime = -1; // 현재시간 -1으로 선언 및 초기화
    let totoalTime; // 시뮬레이터 총 실행시간

    //실행 여부
    let runningProcess = new Array(); // 실행중인 프로세스
    let exitCount = 0; // 종료된 프로세스 개수
    
    const cloneProcessData = processData; // processData 클론 생성
    
    while(checkRun == 1 && exitCount < numberOfProcess){ // run을 클릭했다면 && 모든 프로세스가 종료될때 까지 -> 시간시작
        presentTime++; // 현재시간 1추가   
        console.log("현재 시간: ",presentTime);
        console.log("현재 레디큐: ",readyQueue.toString());  // 레디큐 확인
        
        for(let i =0; i<numberOfProcessor;i++){ // 모든 프로세서를 검사      
            for(let j = 0; j< runningProcess.length; j++){ 
                //(프로세스 종료조건)시작시간 + 실행시간이 현재시간일 때
                if((Number(cloneProcessData[runningProcess[j][0]][2])+Number(cloneProcessData[runningProcess[j][0]][3]) == presentTime)&&
                processorState[i] == 1){                
                    console.log("================= P"+(runningProcess[j][0]+1),"종료 =======================");
                    processorData[runningProcess[j][1]] = -1;
                    runningProcess.shift(j);
                    exitCount++;
                    processorState[i] = -1; // 프로세서를 종료한다.
                }
            }
        }
        
        for(let i=0;i<numberOfProcess; i++){ // 현재시간 == 도착시간인 프로세스가 있으면 레디큐에 삽입
            if (presentTime == cloneProcessData[i][1]){
                readyQueue.enqueue(cloneProcessData[i]);
            }
        }

        //  레디큐에 프로세스가 있으면 && 작동 가능한 프로세서가 있다면
        while(readyQueue.empty() == false && processorState.indexOf(-1) >= 0){ 
            workIndex = processorState.indexOf(-1); // 꺼져있는 프로세서 중 가장 앞에 있는 프로세서의 인덱스를 반환
            processorState[workIndex] = 1; // 작업할 프로세서를 작동시킨다
            dequeProcess = readyQueue.dequeue();
            processorData[workIndex] = "P"+dequeProcess[0]; // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
            runningProcess.push([dequeProcess[0]-1,workIndex]); // 실행중인프로세스 목록에 [실행중인 프로세스, 어느 프로세서에서 실행중인지] 부여
            cloneProcessData[dequeProcess[0]-1][3] = presentTime; // 프로세스의 시작시간을 현재시간으로 설정
            cloneProcessData[dequeProcess[0]-1][6] = workIndex; // 프로세스에게 할당된 프로세서 번호 설정
        } 

        for(let i =0; i< numberOfProcessor; i++){ // 디버깅을 위해 넣어둔 콘솔로그.
            if(processorData[i] == -1){
                console.log("프로세서"+(i+1)+" 큐: Empty.");
            }
            else{
                console.log("프로세서"+(i+1)+" 큐: ",processorData[i]);
            }
        } 
    }
    totoalTime = presentTime; //전체실행시간을 저장.
    console.log("전체 실행 시간: ",totoalTime);
}

function rr(){ 
    //큐
    for(let i=0;i<numberOfProcess;i++) processData[i][5]=0; // 대기시간초기화
    const readyQueue = new Queue(); // 레디큐 생성
    let dequeProcess = new Array(); // 레디큐 -> 러닝프로세스배열로 옮기기위한 배열
    let exitQuantumQueue = new Queue(); // 퀀텀시간이 지난 프로세스를 레디큐에 옮기기 위해 잠시 보관해두는 큐
    let exitProcessQueue = new Queue(); // 종료조건을 위해 종료프로세스들을 모아둠
    
    
    //시간
    let presentTime = 0; // 현재시간 0으로 초기화
    let totoalTime; // 알고리즘 실행시간
    let exitByQuantum // 퀀텀시간이 지났음을 비교할때 쓰는 변수
    
    //실행 여부
    let runningProcess = new Array(); // 실행중인 프로세스
    let workIndex // 현재 작업중인 프로세서 인덱스
    
    
    while(checkRun == 1){ // run()이 작동하면 초기시간 = 0
        for(let i=0;i<numberOfProcess; i++) // 프로세스가 도착하면 레디큐에 삽입
            if (presentTime == processData[i][1]) readyQueue.enqueue(processData[i]);
        
        
        if(!exitQuantumQueue.empty()){
            temp = exitQuantumQueue.toLength(); // dequeue에 의해 큐의 길이가 계속 변하기 때문에, 먼저 temp에 길이를 복사
            for(let i =0; i<temp;i++) readyQueue.enqueue(exitQuantumQueue.dequeue()); // 퀀텀에 의해 종료된 큐를 이후에 레디큐에 삽입
        }



        //==================콘솔확인(디버깅)====================
        showProcessData();
        console.log("시간: ",presentTime);
        console.log("레디큐: ",readyQueue.toString());
        //==================콘솔확인(디버깅)====================


        
        while(readyQueue.empty() == false && processorState.indexOf(-1) >= 0){ 
            workIndex = processorState.indexOf(-1); // 꺼져있는 프로세서 중 가장 앞에 있는 프로세서의 인덱스를 반환
            processorState[workIndex] = 1; // 작업할 프로세서를 작동시킨다
            contextSwitching[workIndex]++; // 문맥전환 횟수 증가
            dequeProcess = readyQueue.dequeue(); // 레디큐에서 디큐한 프로세스를 dequeProcess에 임시 저장
            // *processorData는 디버깅용(확인용) 변수로, 실제 프로세스 연산은 runningProcess에서 진행합니다.
            processorData[workIndex] = "P"+dequeProcess[0]; // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
            if(!dequeProcess[7]||!dequeProcess[3]){ // 처음실행하는 프로세스인경우(디큐 프로세스의 잔여시간이 없거나 시작시간이 없으면)
                dequeProcess[7] = dequeProcess[2]; // 잔여시간은 총 실행시간
                dequeProcess[3] = presentTime; // 시작시간은 현재시간
            }
            dequeProcess[6] = workIndex; // 프로세스에게 할당된 프로세서 번호 설정
            runningProcess.push(dequeProcess); // 실행중인프로세스 목록에 디큐된 프로세서 추가
        }
        
        //대기시간 측정
        for(let i = 0; i< numberOfProcess; i++){
            if(readyQueue.search(processData[i])==true){
                processData[i][5]++;
            }
        }
        
        if(presentTime>100) break; // 무한 루프 방지
        presentTime++; // 현재시간 1추가   
        
        if(runningProcess.length != 0){ //하나라도 실행중인 프로세스가 있으면,
            for(let i=0; i<runningProcess.length;i++){ //실행중인 모든 프로세스의 잔여시간을 줄여라.
                runningProcess[i][7]--;
            }
        }
        showProcessorRunning();
        
        // 종료조건
        if(runningProcess.length){ // 실행중인 프로세스가 있을때 실행
            for(let i = 0; i < runningProcess.length; i++) {
                if(runningProcess[i] == -1)  {
                    runningProcess.splice(i, 1);
                    i--;
                }
            }
            for(let i =0; i<numberOfProcessor;i++){ // 모든 프로세서를 검사      
                for(let j = 0; j< runningProcess.length; j++){
                    if(runningProcess[j] != -1){
                        exitByQuantum = (Number(runningProcess[j][3]) + Number(quantumTime));

                        if(runningProcess[j][6] == i) {

                            if((runningProcess[j][7] != 0)&&(presentTime == exitByQuantum)&& (processorState[i] == 1)){ //퀀텀시간이 자났을 때(현재시간 = 시작시간+퀀텀시간)
                                processorData[runningProcess[j][6]] = -1; // 종료된 프로세스는 -1로 표시
                                processorState[i] = -1; // 프로세서를 종료한다.
                                exitQuantumQueue.enqueue(processData[(runningProcess[j][0]-1)]); // 퀀텀시간이 지나 레디큐로 이동
                                runningProcess[j] = -1; // 프로세스를 종료한다.
                                break;
                            }else if(runningProcess[j][7] <= 0){
                                //(프로세스 종료조건) 잔여시간 = 0 && 해당 프로세서가 켜져있을 떄
                                processorData[runningProcess[j][6]] = -1; // 종료된 프로세서는 -1로 표시
                                runningProcess[j][4] = presentTime;  // 종료시간 업데이트
                                processorState[i] = -1; // 프로세서를 종료한다.
                                exitProcessQueue.enqueue(processData[(runningProcess[j][0]-1)]); // 잔여시간이 다지나서 종료큐로 이동
                                runningProcess[j] = -1; //프로세스를 종료한다.
                            }
                        }
                    }
                }
            }
        }
        if(exitProcessQueue.toLength() >= numberOfProcess) break; // 모든 프로세스가 종료되면 반복문 종료
    }

    totoalTime = presentTime; //전체실행시간을 저장.
    console.log("=============결과=============== ");
    console.log("전체 실행 시간: ",totoalTime);
    showProcessData();    
    // showContextSwit(); // 버그수정 필요
}


function spn(){ 
    //큐
    const readyQueue = new Queue(); // 레디큐 생성
    let dequeProcess = new Array();
    let workIndex
    
    //시간
    let presentTime = -1; // 현재시간 -1으로 선언 및 초기화
    let totoalTime; // 시뮬레이터 총 실행시간
    
    //실행 여부
    let runningProcess = new Array(); // 실행중인 프로세스
    let exitCount = 0; // 종료된 프로세스 개수
    
    const cloneProcessData = processData; // processData 클론 생성
    
    while(checkRun == 1 && exitCount < numberOfProcess){ // run을 클릭했다면 && 모든 프로세스가 종료될때 까지 -> 시간시작
        presentTime++; // 현재시간 1추가   
        
        for(let i =0; i<numberOfProcessor;i++){ // 모든 프로세서를 검사      
            for(let j = 0; j< runningProcess.length; j++){ 
                //(프로세스 종료조건)시작시간 + 실행시간이 현재시간일 때
                if((Number(cloneProcessData[runningProcess[j][0]][2])+Number(cloneProcessData[runningProcess[j][0]][3]) == presentTime)&&
                processorState[i] == 1){                
                    console.log("================= P"+(runningProcess[j][0]+1),"종료 =======================");
                    processorData[runningProcess[j][1]] = -1;
                    runningProcess.shift(j);
                    exitCount++;
                    processorState[i] = -1; // 프로세서를 종료한다.
                }
            }
        }
        for(let i =0; i< numberOfProcessor; i++){ // 디버깅을 위해 넣어둔 콘솔로그.
            if(processorData[i] == -1){
                console.log("프로세서"+(i+1)+" 큐: Empty.");
            }
            else{
                console.log("프로세서"+(i+1)+" 큐: ",processorData[i]);
            }
        } 
        console.log("현재 시간: ",presentTime);
        console.log("이전 레디큐: ",readyQueue.toString());  // 레디큐 확인
        
        for(let i=0;i<numberOfProcess; i++){ // 현재시간 == 도착시간인 프로세스가 있으면 레디큐에 삽입
            if (presentTime == cloneProcessData[i][1]){
                readyQueue.enqueue(cloneProcessData[i]);
            }
        }
        console.log("현재 레디큐: ",readyQueue.toString());  // 레디큐 확인
        //  레디큐에 프로세스가 있으면 && 작동 가능한 프로세서가 있다면
        while(readyQueue.empty() == false && processorState.indexOf(-1) >= 0){ 
            readyQueue.spnSort() // 레디큐 정렬(SPN,삽입정렬)
            workIndex = processorState.indexOf(-1); // 꺼져있는 프로세서 중 가장 앞에 있는 프로세서의 인덱스를 반환
            processorState[workIndex] = 1; // 작업할 프로세서를 작동시킨다
            dequeProcess = readyQueue.dequeue();
            processorData[workIndex] = "P"+dequeProcess[0]; // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
            runningProcess.push([dequeProcess[0]-1,workIndex]); // 실행중인프로세스 목록에 [실행중인 프로세스, 어느 프로세서에서 실행중인지] 부여
            cloneProcessData[dequeProcess[0]-1][3] = presentTime; // 프로세스의 시작시간을 현재시간으로 설정
            cloneProcessData[dequeProcess[0]-1][6] = workIndex; // 프로세스에게 할당된 프로세서 번호 설정
        } 

    }
    totoalTime = presentTime; //전체실행시간을 저장.
    console.log("전체 실행 시간: ",totoalTime);
}

function sptn(){
    
}

function hrrn(){
    
}

function newalgorithm(){
    
}