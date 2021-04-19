function debug(result){
    console.log(result);;
}
// 모듈 실패!
// import { fcfs, rr, spn, sptn, hrrn, newalgorithm, test } from './algorithm.js';


//-------------------태그 관리-------------------------
const inputTable = document.querySelector("#input-table");
const showTable = document.querySelector("#show-table");
const body = document.querySelector("body");
const addProcess = document.getElementById("addprocess");
const deleteProcess = document.getElementById("deleteprocess");
const runSimulator = document.getElementById("run");
//------------------태그 관리 끝-----------------------



//-------------------- 이벤트 처리 ---------------------
addProcess.addEventListener("click", addInputRow);  // "프로세스 추가" 클릭시
deleteProcess.addEventListener("click", deleteLastIndexOfInputRow); // "프로세스 제거" 클릭시
runSimulator.addEventListener("click", run); // "실행" 클릭시
//-------------------- 이벤트 처리 ----------------------





//------------------입력 처리-------------------
function addInputRow(){
    if(inputTable.rows.length < 15){
        let newRow = inputTable.insertRow(inputTable.rows.length);  
        let size = inputTable.rows.length;
        
        const cell0 = newRow.insertCell(0);
        cell0.innerText = "P" + size;
        
        //arrival time
        const arrival = newRow.insertCell(1);
        let arrivalText = document.createElement("input");
        arrivalText.setAttribute("value", "");
        arrival.appendChild(arrivalText);
        
        arrivalText.type="text";
        arrivalText.className = "arrivalTime";
        
        //burst time
        const burst = newRow.insertCell(2);
        let burstText = document.createElement("input");
        burstText.setAttribute("value", "");
        burst.appendChild(burstText);
        
        burstText.type="text";
        burstText.className = "burstTime";
    }
}

function deleteLastIndexOfInputRow(){
    // const table = document.querySelector("table");
    if(inputTable.rows.length >= 1){
        inputTable.deleteRow(-1);
        showTable.deleteRow(-1);
    }
}
//------------------입력 끝-----------------




//-------------------- 실행시 처리 ---------------------
function run(){
    //====================== 변수 선언 부 ====================
    
    let result;

    //입력값 정리
    const atInput = document.querySelectorAll(".arrivalTime");
    const btInput = document.querySelectorAll(".burstTime");
    const numberOfProcess = inputTable.rows.length;
    const numberOfProcessor = document.querySelector(".numofprocessors").value;
    const quantumTime = Number(document.querySelector(".quantumTime").value);
    
    //변수값 확인
    console.log("======================입력값 확인=====================");
    console.log("프로세서 수: ",numberOfProcessor);
    console.log("프로세스 수: ",numberOfProcess);
    console.log("퀀텀타임: ",quantumTime);
    console.log("=========================run=======================");
    
    result = chooseProcessAlgorithm(atInput, btInput, numberOfProcessor, numberOfProcess, quantumTime);


    // // 표 만들기 : 이름, Arrival Time, Buster Time, Wating Time, Turnaound Time, Nomarlized TT
    // createShowTable();

    debug(result);
    // //progress bar 함수 -> 큰 창과 그 내부 프로세스들의 상태바 만들기 위한 용도
    createProgressBar(result.resultData, result.max, numberOfProcessor); //배열, time
    showCoreName(numberOfProcessor); //코어 개수
    createBottomIndex(result.max);
    // //종류 가져오기

    // //실행 progress 보여주기
    showProgressBar(result.max);
}

//------------------BackEnd-------------------------
// 큐 클래스 선언
class Queue {
    constructor(){ // 생성자
        this.dataStore = []; 
    }

    //큐의 끝부분에 요소를 추가
    enqueue(element) {
        this.dataStore.push(element);
    }

    //큐의 앞부분에서 요소를 삭제
    dequeue() {
        return this.dataStore.shift();
    }

    dequeueAll() {
        let arr = []
        for(let i =0; i<this.dataStore.length;i++){
            arr[i] = this.dataStore[i];
        }
        return arr;
    }

    //큐의 앞부분에 저장된 요소 확인
    front() {
        return this.dataStore[0];
    }

    //큐의 끝부분에 저장된 요소 확인
    back() {
        return this.dataStore[this.dataStore.length-1];
    }

    //큐의 모든 요소를 출력
    
    toString() {
        let retStr = [];
        for (let i = 0; i < this.dataStore.length; ++i ){
            retStr[i] = (this.dataStore[i].id+1);
        }
        return retStr;
    }

    toString2() {
        let retStr = [];
        for (let i = 0; i < this.dataStore.length; ++i ){
            retStr[i] = (this.dataStore[i][0]);
        }
        return retStr;
    }

    toLength(){
        return this.dataStore.length;
    }

    //큐가 비어있는지 여부 확인
    empty() {
        if (this.dataStore.length == 0) {
            return true;
        } else {
            return false;
        }
    }

    search(e){
        return this.dataStore.includes(e)
    }

    spnSort(){  // 삽입 정렬
        this.n = this.dataStore.length;
        for(let i=1; i< this.n; i++){
            let key = this.dataStore[i];
            let j = i - 1;
            while (j >= 0 && this.dataStore[j][2] > key[2]){
                this.dataStore[j+1] = this.dataStore[j];
                j = j - 1
            }
            this.dataStore[j+1] = key;
        }
    }

    srtnSort(){

    }

    hrrnSort(){  // 삽입 정렬
        this.n = this.dataStore.length;
        for(let i=1; i< this.n; i++){
            let key = this.dataStore[i];
            let j = i - 1;
            while (j >= 0 && (((this.dataStore[j][5]+this.dataStore[j][2])/this.dataStore[j][2]) < ((key[5]+key[2])/key[2]))){
                this.dataStore[j+1] = this.dataStore[j];
                j = j - 1
            }
            this.dataStore[j+1] = key;
        }
    }

}


function showProcessorRunning(processorData , numberOfProcessor){
    for(let i =0; i< numberOfProcessor; i++){
            console.log("프로세서"+(i+1)+" 큐: ",processorData[i].toString2());
    } 
}

// function showContextSwit() {
//     for(let i= 0; i<contextSwitching.length;i++){
//         console.log("프로세서"+(i+1)+" context Switching: ",contextSwitching[i]-1);
//     }
// }



// 알고리즘 6개
function fcfs(atInput, btInput, numberOfProcessor, numberOfProcess){ 
    // =======================선언부=======================
    const nop = numberOfProcess;  // 총 프로세스 수
    const nopr = numberOfProcessor;  // 프로세서 수
    let processData = new Array();  //processData  {프로세스번호(1부터), 도착시간, 실행시간, 시작시간, 종료시간, 대기시간, 할당된 프로세서 번호, 잔여시간}
    let processorData = new Array(); // 각 프로세서 별 실행중인 프로세스(디버깅용)
    let processorState = new Array(); // 프로세서 별 실행중인지 아닌지 확인하기 위한 변수(함수 안으로 옮겨야함)
    let dequeProcess; // 레디큐 -> 러닝프로세스배열로 옮기기위한 배열

    //큐
    const readyQueue = new Queue(); // 레디큐 생성
    let exitQuantumQueue = new Queue(); // 퀀텀시간이 지난 프로세스를 레디큐에 옮기기 위해 잠시 보관해두는 큐
    let exitProcessQueue = new Queue(); // 종료조건을 위해 종료프로세스들을 모아둠
    
    //시간
    
    let prRunTime = new Array();  // max 런타임 처리
    let presentTime; // 현재시간 0으로 초기화
    let totoalTime; // 알고리즘 실행시간
    let exitByQuantum // 퀀텀시간이 지났음을 비교할때 쓰는 변수
    
    //실행 여부
    let runningProcess = new Array(); // 실행중인 프로세스
    let workIndex // 현재 작업중인 프로세서 인덱스
    
    //최종 결과
    let result = new Object();  // 최종결과 객체 반환
    // 객체에 들어갈 키값 변수
    let resultData = new Array(new Array());
    let readyQLog = new Array();
    let max;
    
    // ================ 선언부 종료 ========================
    

    //==================== 초기화 ===========================
    
    presentTime = 0;  // 현재시간 0 초로 초기화

    for(let i =0; i<nopr; i++) {
        processorState[i] = -1;  // 프로세서 수 만큼 프로세서상태를 꺼진상태(-1)으로 초기화
        processorData[i] = new Queue();
    }

    for(let i=0; i <nop; i++){ 
        processData[i] = {id: -1, at: -1, bt: -1,st:-1,et: -1, wt: 0, pr: -1, rt: -1};  // 프로세스 정보를 넣을 길이가 8인 배열 생성
        processData[i].id = i;  // 프로세스 번호
        processData[i].at = Number(atInput[i].value);  // 프로세스 도착시간
        processData[i].bt = Number(btInput[i].value);  // 프로세스 실행시간
    }
    
    //=====================초기화 종료========================
    

    //======================================== 실행부 ===============================================
    
    while(1){ // 무한루프
        for(let i=0;i<nop; i++) // 프로세스가 도착하면 레디큐에 삽입
            if (presentTime == processData[i].at) readyQueue.enqueue(processData[i]);
        
        
        if(!exitQuantumQueue.empty()){
            temp = exitQuantumQueue.toLength(); // dequeue에 의해 큐의 길이가 계속 변하기 때문에, 먼저 temp에 길이를 복사
            for(let i =0; i<temp;i++) readyQueue.enqueue(exitQuantumQueue.dequeue()); // 퀀텀에 의해 종료된 큐를 이후에 레디큐에 삽입
        }



        //==================콘솔확인(디버깅)====================
        console.log("시간: ",presentTime);
        console.log("레디큐: ","P"+readyQueue.toString());
        //==================콘솔확인(디버깅)====================
        readyQLog.push([presentTime,("P"+readyQueue.toString())]);  // 레디큐 로그 업데이트


        
        while(readyQueue.empty() == false && processorState.indexOf(-1) >= 0){ 
            workIndex = processorState.indexOf(-1); // 꺼져있는 프로세서 중 가장 앞에 있는 프로세서의 인덱스를 반환
            processorState[workIndex] = 1; // 작업할 프로세서를 작동시킨다
            dequeProcess = readyQueue.dequeue(); // 레디큐에서 디큐한 프로세스를 dequeProcess에 임시 저장
            if((processData[dequeProcess.id].rt==-1)||(processData[dequeProcess.id].st==-1)){ // 처음실행하는 프로세스인경우(디큐 프로세스의 잔여시간이 없거나 시작시간이 없으면)
                processData[dequeProcess.id].rt = dequeProcess.bt; // 잔여시간은 총 실행시간
                processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간
            }
            processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간 매 초 업데이트
            processData[dequeProcess.id].pr = workIndex; // 프로세스에게 할당된 프로세서 번호 설정
            runningProcess.push(dequeProcess.id); // 실행중인프로세스 목록에 디큐된 프로세스 추가
        }

        
        //대기시간 측정
        for(let i = 0; i< nop; i++){
            if(readyQueue.search(processData[i])==true){
                processData[i].wt++;
            }
        }
        
        if(presentTime>100) break; // 무한 루프 방지
        
        presentTime++; //****************  현재시간 1추가 ******************  
        
        for(let i = 0; i < runningProcess.length; i++) {   // runningProcess안에 종료된 프로세스(-1)이 있다면 없앰(splice)
            if(runningProcess[i] == -1)  {
                runningProcess.splice(i, 1);
                i--;
            }
        }
        if(runningProcess.length != 0){ //하나라도 실행중인 프로세스가 있으면,
            for(let i=0; i<runningProcess.length;i++){ //실행중인 모든 프로세스의 잔여시간을 줄여라.
                processData[runningProcess[i]].rt--;
            }
        }
        
        // 종료조건
        if(runningProcess.length){ // 실행중인 프로세스가 있을때 실행
            for(let i =0; i<nopr;i++){  // 모든 프로세서를 검사      
                for(let j = 0; j< runningProcess.length; j++){
                    if(runningProcess[j] != -1){
                        exitByQuantum = processData[runningProcess[j]].st + qt; 
                        if(processData[runningProcess[j]].pr == i) {
                            
                            if((processData[runningProcess[j]].rt != 0) && (presentTime == exitByQuantum) && (processorState[i] == 1)){
                                // 잔여시간이 0이 아니고, 현재시간이 퀀텀에 의해 종료될 시간이며, 해당 프로세서가 켜져이싸면
                                processorData[processData[runningProcess[j]].pr].enqueue([("P"+(runningProcess[j]+1)),processData[runningProcess[j]].st,presentTime]); // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
                                processorState[i] = -1; // 프로세서를 종료한다.
                                console.log("****************** P"+(runningProcess[j]+1)+" 종료 By Quantum ******************")
                                exitQuantumQueue.enqueue(processData[(runningProcess[j])]); // 퀀텀시간이 지나 레디큐로 이동
                                runningProcess[j] = -1; // 프로세스를 종료한다.
                                break;
                            }else if(processData[runningProcess[j]].rt <= 0){
                                //(프로세스 종료조건) 잔여시간 = 0 && 해당 프로세서가 켜져있을 떄
                                processorData[processData[runningProcess[j]].pr].enqueue([("P"+(runningProcess[j]+1)),processData[runningProcess[j]].st,presentTime]); // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
                                processData[runningProcess[j]].et = presentTime;  // 종료시간 업데이트
                                processorState[i] = -1; // 프로세서를 종료한다.
                                console.log("********************** P"+(runningProcess[j]+1)+" 종료 **********************")
                                exitProcessQueue.enqueue(processData[(runningProcess[j])]); // 잔여시간이 다지나서 종료큐로 이동
                                runningProcess[j] = -1; //프로세스를 종료한다.
                            }
                        }
                    }
                }
            }
            showProcessorRunning(processorData , nopr)
        }
        if(exitProcessQueue.toLength() >= nop) break; // 모든 프로세스가 종료되면 반복문 종료
    }
    
    //============================================= 실행부 종료 ===========================================

    //======================== 결과, 리턴 처리 ==========================

    totoalTime = presentTime; //전체실행시간을 저장.
    console.log("=============결과=============== ");
    console.log("전체 실행 시간: ",totoalTime);
    // showContextSwit(); // 버그수정 필요
    
    //최종결과 처리
    for(let i =0; i < nopr;i++){  // 프로세서데이터 처리
        for(let j =0; j<processorData[i].toLength(); j++){
            resultData[i] = (processorData[i].dequeueAll())
        }
    }


    for(let i = 0;i<nopr;i++){  // 최대시간 처리
        let lastindex = resultData[i][resultData[i].length-1];
        prRunTime[i] = lastindex[lastindex.length-1];
    }

    max = Math.max.apply(null, prRunTime);  // 최대시간 프로세서 런터임

    //결과값 넣어줌
    result.readyQLog = readyQLog;
    result.max = max;
    result.resultData = resultData;
    
    return result;
    //======================== 결과, 리턴 처리 종료 ==========================
}
function rr(atInput, btInput, numberOfProcessor, numberOfProcess,quantumTime){ 
    // =======================선언부=======================
    let nop = numberOfProcess;  // 총 프로세스 수
    let nopr = numberOfProcessor;  // 프로세서 수
    let qt = quantumTime; // 퀀텀 타임
    let processData = new Array();  //processData  {프로세스번호(1부터), 도착시간, 실행시간, 시작시간, 종료시간, 대기시간, 할당된 프로세서 번호, 잔여시간}
    let processorData = new Array(); // 각 프로세서 별 실행중인 프로세스(디버깅용)
    let processorState = new Array(); // 프로세서 별 실행중인지 아닌지 확인하기 위한 변수(함수 안으로 옮겨야함)
    let dequeProcess; // 레디큐 -> 러닝프로세스배열로 옮기기위한 변수

    //큐
    let readyQueue = new Queue(); // 레디큐 생성
    let exitQuantumQueue = new Queue(); // 퀀텀시간이 지난 프로세스를 레디큐에 옮기기 위해 잠시 보관해두는 큐
    let exitProcessQueue = new Queue(); // 종료조건을 위해 종료프로세스들을 모아둠
    
    //시간
    let prRunTime = new Array();  // max 런타임 처리
    let presentTime; // 현재시간 0으로 초기화
    let totoalTime; // 알고리즘 실행시간
    let exitByQuantum // 퀀텀시간이 지났음을 비교할때 쓰는 변수
    
    //실행 여부
    let runningProcess = new Array(); // 실행중인 프로세스
    let workIndex // 현재 작업중인 프로세서 인덱스
    
    //최종 결과
    let result = new Object();  // 최종결과 객체 반환
    // 객체에 들어갈 키값 변수
    let resultData = new Array(new Array());
    let readyQLog = new Array();
    let max;
    
    // ================ 선언부 종료 ========================
    

    //==================== 초기화 ===========================
    
    presentTime = 0;  // 현재시간 0 초로 초기화

    for(let i =0; i<nopr; i++) {
        processorState[i] = -1;  // 프로세서 수 만큼 프로세서상태를 꺼진상태(-1)으로 초기화
        processorData[i] = new Queue();
    }

    for(let i=0; i <nop; i++){ 
        processData[i] = {id: -1, at: -1, bt: -1,st:-1,et: -1, wt: 0, pr: -1, rt: -1};  // 프로세스 정보를 넣을 길이가 8인 배열 생성
        processData[i].id = i;  // 프로세스 번호
        processData[i].at = Number(atInput[i].value);  // 프로세스 도착시간
        processData[i].bt = Number(btInput[i].value);  // 프로세스 실행시간
    }
    
    //=====================초기화 종료========================
    

    //======================================== 실행부 ===============================================
    
    while(1){ // 무한루프
        for(let i=0;i<nop; i++) // 프로세스가 도착하면 레디큐에 삽입
            if (presentTime == processData[i].at) readyQueue.enqueue(processData[i]);
        
        
        if(!exitQuantumQueue.empty()){
            temp = exitQuantumQueue.toLength(); // dequeue에 의해 큐의 길이가 계속 변하기 때문에, 먼저 temp에 길이를 복사
            for(let i =0; i<temp;i++) readyQueue.enqueue(exitQuantumQueue.dequeue()); // 퀀텀에 의해 종료된 큐를 이후에 레디큐에 삽입
        }



        //==================콘솔확인(디버깅)====================
        console.log("시간: ",presentTime);
        console.log("레디큐: ","P"+readyQueue.toString());
        //==================콘솔확인(디버깅)====================
        readyQLog.push([presentTime,("P"+readyQueue.toString())]);  // 레디큐 로그 업데이트


        
        while(readyQueue.empty() == false && processorState.indexOf(-1) >= 0){ 
            console.log("22Dd", processorState);
            workIndex = processorState.indexOf(-1); // 꺼져있는 프로세서 중 가장 앞에 있는 프로세서의 인덱스를 반환
            console.log("Dd", workIndex);
            processorState[workIndex] = 1; // 작업할 프로세서를 작동시킨다
            dequeProcess = readyQueue.dequeue(); // 레디큐에서 디큐한 프로세스를 dequeProcess에 임시 저장
            if((processData[dequeProcess.id].rt==-1)||(processData[dequeProcess.id].st==-1)){ // 처음실행하는 프로세스인경우(디큐 프로세스의 잔여시간이 없거나 시작시간이 없으면)
                processData[dequeProcess.id].rt = dequeProcess.bt; // 잔여시간은 총 실행시간
                processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간
            }
            processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간 매 초 업데이트
            processData[dequeProcess.id].pr = workIndex; // 프로세스에게 할당된 프로세서 번호 설정
            runningProcess.push(dequeProcess.id); // 실행중인프로세스 목록에 디큐된 프로세스 추가
        }

        
        //대기시간 측정
        for(let i = 0; i< nop; i++){
            if(readyQueue.search(processData[i])==true){
                processData[i].wt++;
            }
        }
        
        if(presentTime>100) break; // 무한 루프 방지
        
        presentTime++; //****************  현재시간 1추가 ******************  
        
        for(let i = 0; i < runningProcess.length; i++) {   // runningProcess안에 종료된 프로세스(-1)이 있다면 없앰(splice)
            if(runningProcess[i] == -1)  {
                runningProcess.splice(i, 1);
                i--;
            }
        }
        if(runningProcess.length != 0){ //하나라도 실행중인 프로세스가 있으면,
            for(let i=0; i<runningProcess.length;i++){ //실행중인 모든 프로세스의 잔여시간을 줄여라.
                processData[runningProcess[i]].rt--;
            }
        }
        
        // 종료조건
        if(runningProcess.length){ // 실행중인 프로세스가 있을때 실행
            for(let i =0; i<nopr;i++){  // 모든 프로세서를 검사      
                for(let j = 0; j< runningProcess.length; j++){
                    if(runningProcess[j] != -1){
                        exitByQuantum = processData[runningProcess[j]].st + qt; 
                        if(processData[runningProcess[j]].pr == i) {
                            
                            if((processData[runningProcess[j]].rt != 0) && (presentTime == exitByQuantum) && (processorState[i] == 1)){
                                // 잔여시간이 0이 아니고, 현재시간이 퀀텀에 의해 종료될 시간이며, 해당 프로세서가 켜져이싸면
                                processorData[processData[runningProcess[j]].pr].enqueue([("P"+(runningProcess[j]+1)),processData[runningProcess[j]].st,presentTime]); // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
                                processorState[i] = -1; // 프로세서를 종료한다.
                                console.log("****************** P"+(runningProcess[j]+1)+" 종료 By Quantum ******************")
                                exitQuantumQueue.enqueue(processData[(runningProcess[j])]); // 퀀텀시간이 지나 레디큐로 이동
                                runningProcess[j] = -1; // 프로세스를 종료한다.
                                break;
                            }else if(processData[runningProcess[j]].rt <= 0){
                                //(프로세스 종료조건) 잔여시간 = 0 && 해당 프로세서가 켜져있을 떄
                                processorData[processData[runningProcess[j]].pr].enqueue([("P"+(runningProcess[j]+1)),processData[runningProcess[j]].st,presentTime]); // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
                                processData[runningProcess[j]].et = presentTime;  // 종료시간 업데이트
                                processorState[i] = -1; // 프로세서를 종료한다.
                                console.log("********************** P"+(runningProcess[j]+1)+" 종료 **********************")
                                exitProcessQueue.enqueue(processData[(runningProcess[j])]); // 잔여시간이 다지나서 종료큐로 이동
                                runningProcess[j] = -1; //프로세스를 종료한다.
                            }
                        }
                    }
                }
            }
            showProcessorRunning(processorData , nopr)
        }
        if(exitProcessQueue.toLength() >= nop) break; // 모든 프로세스가 종료되면 반복문 종료
    }
    
    //============================================= 실행부 종료 ===========================================

    //======================== 결과, 리턴 처리 ==========================

    totoalTime = presentTime; //전체실행시간을 저장.
    console.log("=============결과=============== ");
    console.log("전체 실행 시간: ",totoalTime);
    // showContextSwit(); // 버그수정 필요
    
    //최종결과 처리
    for(let i =0; i < nopr;i++){  // 프로세서데이터 처리
        for(let j =0; j<processorData[i].toLength(); j++){
            resultData[i] = (processorData[i].dequeueAll())
        }
    }

    for(let i = 0;i<resultData.length;i++){  // 최대시간 처리
        let lastindex = resultData[i][resultData[i].length-1];
        prRunTime[i] = lastindex[lastindex.length-1];
    }

    max = Math.max.apply(null, prRunTime);  // 최대시간 프로세서 런터임

    //결과값 넣어줌
    result.readyQLog = readyQLog;
    result.max = max;
    result.resultData = resultData;
    
    return result;
    //======================== 결과, 리턴 처리 종료 ==========================
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
            readyQueue.spnSort(); // 레디큐 정렬(SPN,삽입정렬)
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
            console.log("정렬전 레디큐: ",readyQueue.toString());
            readyQueue.hrrnSort() // 레디큐 정렬(SPN,삽입정렬)
            console.log("정렬후 레디큐: ",readyQueue.toString());
            workIndex = processorState.indexOf(-1); // 꺼져있는 프로세서 중 가장 앞에 있는 프로세서의 인덱스를 반환
            processorState[workIndex] = 1; // 작업할 프로세서를 작동시킨다
            dequeProcess = readyQueue.dequeue();
            processorData[workIndex] = "P"+dequeProcess[0]; // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
            runningProcess.push([dequeProcess[0]-1,workIndex]); // 실행중인프로세스 목록에 [실행중인 프로세스, 어느 프로세서에서 실행중인지] 부여
            cloneProcessData[dequeProcess[0]-1][3] = presentTime; // 프로세스의 시작시간을 현재시간으로 설정
            cloneProcessData[dequeProcess[0]-1][6] = workIndex; // 프로세스에게 할당된 프로세서 번호 설정
        } 
        //대기시간 측정
        for(let i = 0; i< numberOfProcess; i++){
            if(readyQueue.search(processData[i])==true){
                processData[i][5]++;
            }
        }
    }
    totoalTime = presentTime; //전체실행시간을 저장.
    console.log("전체 실행 시간: ",totoalTime);
}
function newalgorithm(){
    
}


// 알고리즘 선택 함수
function chooseProcessAlgorithm(atInput, btInput, numberOfProcessor, numberOfProcess, quantumTime){
    const selectprocess = document.querySelector(".selectprocess");
    const processValue = selectprocess.value;
    let result;

    console.log("선택된 알고리즘: ",processValue.toUpperCase());
    if(processValue == "fcfs"){
        resultAlgorithm = fcfs(atInput, btInput, numberOfProcessor, numberOfProcess);
    }
    else if(processValue == "rr"){
        result = rr(atInput, btInput, numberOfProcessor, numberOfProcess, quantumTime);
    }
    else if(processValue == "spn"){
        resultAlgorithm = spn(atInput, btInput, numberOfProcessor, numberOfProcess);
    }
    else if(processValue == "sptn"){
        resultAlgorithm = sptn(atInput, btInput, numberOfProcessor, numberOfProcess);
    }
    else if(processValue == "hrrn"){
        resultAlgorithm = hrrn(atInput, btInput, numberOfProcessor, numberOfProcess);
    }
    else if(processValue == "newalgorithm"){
        resultAlgorithm = newalgorithm(atInput, btInput, numberOfProcessor, numberOfProcess);
    }

    return result;
}
//------------------BackEnd-------------------------



// --------------------- FrontEnd -------------------
 

function createShowTable(){
    deleteAllOfShowTable();
    for(let i=0; i <inputTable.rows.length; i++){
        var getRow = showTable.insertRow(showTable.rows.length);
        const row0 = getRow.insertCell(0);
        row0.innerText = "P"+processData[i][0];
        const row1 = getRow.insertCell(1);
        row1.innerText = "P"+processData[i][1];
        const row2 = getRow.insertCell(2);
        row2.innerText = "P"+processData[i][2];
    }
}

function deleteAllOfShowTable(){
    while(showTable.rows.length>0){
        showTable.deleteRow(0);
    }
}
/*
function createProgressBar(){
    deleteAllOfProgressBar();
    for(let i=0; i < numberOfProcessor; i++){
        var childProg = document.createElement("div");
        childProg.className = "progressBar";
        childProg.id ="progressBar";
        progressBars.appendChild(childProg);

        var white = document.createElement("div");
        white.className = "progressBar__time";
        white.id ="progressBar__time";
        progressBars.appendChild(white);

        for(let j=0; j<processData.length; j++){
            console.log(processData[j][0]);
            if(processData[j][0] !== undefined){
                var pro = document.createElement("div");
                pro.className = "progressBar__process";
                pro.id ="progressBar__process";
                pro.innerHTML = "p" + processData[j][0];
                pro.style.width = processData[j][2] * 10+"%";
                var tmp1 = "rgb("+(103+30*j)+", "+(230+30*j)+", " +(220+30*j)+")"; // 점점 연하게
                var tmp2 = "rgb("+(255-10*j)+", "+(204-10*j)+", " +(204-10*j)+")"; // 점점 진하게
                pro.style.backgroundColor = tmp2;
                progressBar.appendChild(pro);
            }
        }
    }
}
*/

// ProgressBar 수정 부분
function createProgressBar(resultData, maxTime, numberOfCore){
    deleteAllOfProgressBar();
    // let tmpResultData = [
    //     [["P1", 3, 5], ["P2", 7, 10]], // core 1
    //     [["P3", 0, 3], ["P4", 5, 6], ["P5", 12, 14]],
    //     [["P6", 0, 3]],
    //     [["P7", 0, 3]]
    // ];
    // let numberOfCore = tmpResultData.length;
    // console.log(tmpResultData);
    // console.log(numberOfCore); 
    // const maxTime = 15;
    
    for(let i=0; i < numberOfCore; i++){
        //하나의 코어 만들기
        var childProg = document.createElement("div");
        childProg.className = "progressBar";
        childProg.id = "progressBar"+(i+1);
        //childProg Flex로 만들어주기
        childProg.style.display = "flex";
        progressBars.appendChild(childProg);

        const plusWidth = 100 / (maxTime+1);
        //하나의 코어 안에 프로세스 노드들 만들어주기
        for(let j=0; j<resultData[i].length; j++){
            const pro = document.createElement("div");
            pro.className = "progressBar__process";
            pro.id = "progressBar__process"+(j+1);
            pro.innerHTML = resultData[i][j][0];
            if(j === 0) pro.style.marginLeft = (resultData[i][j][1] * plusWidth) + "%";
            if(j !== 0) pro.style.marginLeft = ((resultData[i][j][1] - resultData[i][j-1][2])*plusWidth)+ "%";
            pro.style.width = (resultData[i][j][2] - resultData[i][j][1]) * plusWidth + "%";
            var tmp2 = "rgb("+(255-10*j)+", "+(204-10*j)+", " +(204-10*j)+")"; 
            pro.style.backgroundColor = tmp2;
            // pro.style.textAlign = "center";
            childProg.appendChild(pro);
        }
    }
}

function createBottomIndex(maxTime){
    deleteBottomIndex();
    // const maxTime = 15;
    const tmp = parseInt(maxTime / 16);
    const plusWidth = 100 / maxTime * (tmp+1);

    const ganttTableBottom = document.querySelector(".gantt_table__bottom");
    var time = document.createElement("div");
    for(let i=0; i<=maxTime; i++){
        var time = document.createElement("div");
        time.innerText = i;
        time.style.width = plusWidth + "%";
        ganttTableBottom.appendChild(time);
        i += tmp;
    }
}
function deleteBottomIndex(){
    var del = document.querySelector(".gantt_table__bottom"); 
    while ( del.hasChildNodes() ) { 
        del.removeChild( del.firstChild ); 
    }
}

function showCoreName(numberOfCore){
    deleteCoreName();
    const ganttTableLeft = document.querySelector(".gantt_table__top-left");

    // let tmpResultData = [
    //     [["P1", 3, 5], ["P2", 7, 10]], // core 1
    //     [["P3", 0, 3], ["P4", 5, 6], ["P5", 14, 15]],
    //     [["P6", 0, 3]],
    //     [["P7", 0, 3]]
    // ];
    // let numberOfCore = tmpResultData.length;

    for(let i=0; i < numberOfCore; i++){
        var core = document.createElement("div");
        core.className = "core";
        core.innerText = "core" + (i+1);
        ganttTableLeft.appendChild(core);
    }
}

function deleteCoreName(){
    var del = document.querySelector(".gantt_table__top-left"); 
    while ( del.hasChildNodes() ) { 
        del.removeChild( del.firstChild ); 
    }
}


function showProgressBar(maxTime){
    deleteProgressBar();
    const progress = document.querySelector(".gantt_table__top-right");
    var white = document.createElement("div");
    white.className = "progressBar__time";
    white.id ="progressBar__time";  
    progress.appendChild(white);
    
    const timeInterval = 100 / (maxTime+1); // 길이/초
    var id = setInterval(frame, 1000);
    var width = 100;
    var i =1;
    function frame(){
        width -= timeInterval;
        console.log(width);
        if(width < 0){
            white.style.width = 0;
            white.style.marginLeft = (timeInterval * i) + "%";
            clearInterval(id);
        }
        else{
            white.style.width = width + "%";
            white.style.marginLeft = (timeInterval * i) + "%";
            i++;
        }
        
    }
}
function deleteProgressBar(){
    var delParent = document.querySelector(".gantt_table__top-right"); 
    delParent.removeChild(delParent.lastChild);
}


function deleteAllOfProgressBar(){
    var del = document.getElementById("progressBars"); 
    while ( del.hasChildNodes() ) { 
        del.removeChild( del.firstChild ); 
    }
}
//-------------------- FrontEnd 끝--------------------




