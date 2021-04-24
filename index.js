function debug(result){  // 디버그 함수
    console.log("결과값 디버그:  ", result);;
}



//-------------------태그 관리-------------------------
const inputTable = document.querySelector("#input-table");
const showTable = document.querySelector("#show-table");
const body = document.querySelector("body");
const addProcess = document.getElementById("addprocess");
const deleteProcess = document.getElementById("deleteprocess");
const runSimulator = document.getElementById("run");
const baram = document.querySelector(".baram");
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

function showProcess(){
    const width = 80;
    const height = 80;
    processNode.style.width = width + "px";
    processNode.style.height = height + "px";
}

function deleteLastIndexOfInputRow(){
    if(inputTable.rows.length >= 1){
        inputTable.deleteRow(-1);
        showTable.deleteRow(-1);
    }
}

function inputCheck(atInput, btInput, selectprocess){  // 빈 값 체크
    // 프로세스 칸을 추가하지 않고 바로 만들경우 에러 탐지 추가.
    if(atInput.length == 0 && btInput.length == 0) return false;
    
    for(var i = 0; i < atInput.length; i++){
        if(parseInt(atInput[i].value) <= -1 || atInput[i].value === "" || isNaN(atInput[i].value)) {
            return false;
        }        
    }
    
    //burstTime이 0초일 때 false 추가
    for(var i = 0; i < btInput.length; i++){
        if(parseInt(btInput[i].value) <= 0 || btInput[i].value === "" || isNaN(btInput[i].value)) {
            return false;
        }        
    }
    
    if(selectprocess.value === "rr" || selectprocess.value === "hrr"){
        const quantumTime = document.querySelector(".quantumTime").value;
        if(parseInt(quantumTime) <= 0 || quantumTime === "" || isNaN(quantumTime)) {
            return false;
        }  
    }
    
    return true;
}
//------------------입력 처리 끝-----------------



//-------------------- 실행시 처리 ---------------------
function run(){
    init(); // 초기화 함수
    baram.style.animationPlayState = "running";  // 바람개비 돌리기
    let result;
    
    //입력값 정리
    const atInput = document.querySelectorAll(".arrivalTime");
    const btInput = document.querySelectorAll(".burstTime");
    const numberOfProcess = inputTable.rows.length;
    const numberOfCore = document.querySelector(".numofcores").value;
    const selectprocess = document.querySelector(".selectprocess");
    
    //입력 체크
    if(!inputCheck(atInput,btInput,selectprocess)){
        alert("오류! 값을 다시 넣고 실행해주세요.\n(정수로 or RR(HRR)이라면 Time quantum을 넣어 주세요.)");
        init();
        // run();
        return;
    } 
    
    //변수값 확인
    console.log("======================입력값 확인=====================");
    console.log("프로세서 수: ",numberOfCore);
    console.log("프로세스 수: ",numberOfProcess);
    console.log("=========================run=======================");
    
    result = chooseProcessAlgorithm(atInput, btInput, numberOfCore, numberOfProcess);
    debug(result); // 디버깅 함수 호출
    
    // //progress bar 함수 -> 큰 창과 그 내부 프로세스들의 상태바 만들기 위한 용도
    createProgressBar(result.resultData, result.max, numberOfCore, numberOfProcess); //배열, time
    showCoreName(numberOfCore); //코어 개수
    createBottomIndex(result.max);
    
    // //실행 progress 보여주기
    showProgressBar(result.max);

    //2021-04-21 1:22 실제 데이터 삽입
    showReadyQueue(result.readyQLog);
  

    ///2021-04-21 2:04 표 만들기용 프로세스 데이터 필요
    // 표 만들기 : 이름, Arrival Time, Buster Time, Wating Time, Turnaound Time, Nomarlized TT
    createShowTable(result.resultTable, result.max);
}

// 알고리즘 선택 함수
function chooseProcessAlgorithm(atInput, btInput, numberOfCore, numberOfProcess){
    const selectprocess = document.querySelector(".selectprocess");
    const processValue = selectprocess.value;
    let result;

    console.log("선택된 알고리즘: ",processValue.toUpperCase());
    if(processValue == "fcfs"){
        result = fcfs(atInput, btInput, numberOfCore, numberOfProcess);
    }
    else if(processValue == "rr"){
        result = rr(atInput, btInput, numberOfCore, numberOfProcess);
    }
    else if(processValue == "spn"){
        result= spn(atInput, btInput, numberOfCore, numberOfProcess);
    }
    else if(processValue == "srtn"){
        result = srtn(atInput, btInput, numberOfCore, numberOfProcess);
    }
    else if(processValue == "hrrn"){
        result = hrrn(atInput, btInput, numberOfCore, numberOfProcess);
    }
    else if(processValue == "hrr"){
        result = hrr(atInput, btInput, numberOfCore, numberOfProcess);
    }

    return result;
}
//-------------------- 실행시 처리 끝 ---------------------



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

    //큐의 모든 요소 배열에 합쳐서 반환
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
            while (j >= 0 && this.dataStore[j].bt > key.bt){
                this.dataStore[j+1] = this.dataStore[j];
                j = j - 1
            }
            this.dataStore[j+1] = key;
        }
    }

    srtnSort(){ // 삽입 정렬
        this.n = this.dataStore.length;
        for(let i=1; i<this.n;i++){
            let key = this.dataStore[i];
            let j = i - 1;
            while(j>=0 && this.dataStore[j].rt > key.rt){
                this.dataStore[j+1] = this.dataStore[j];
                j = j - 1
            }
            this.dataStore[j+1] = key;
        }
    }


    hrrnSort(){  // 삽입 정렬
        this.n = this.dataStore.length;
        for(let i=1; i< this.n; i++){
            let key = this.dataStore[i];
            let j = i - 1;
            let ratioJ = (this.dataStore[j].wt+this.dataStore[j].bt)/this.dataStore[j].bt;
            let ratioKey = (key.wt+key.bt)/key.bt;
            while (j >= 0 && ratioJ < ratioKey){
                this.dataStore[j+1] = this.dataStore[j];
                j = j - 1
            }
            this.dataStore[j+1] = key;
        }
    }
}

// 알고리즘 6개
function fcfs(atInput, btInput, numberOfCore, numberOfProcess){
    // =======================선언부=======================
    const nop = numberOfProcess;  // 총 프로세스 수
    const nopr = numberOfCore;  // 프로세서 수
    const processData = new Array();  //processData  {프로세스번호(1부터), 도착시간, 실행시간, 시작시간, 종료시간, 대기시간, 할당된 프로세서 번호, 잔여시간}
    const coreData = new Array(); // 각 프로세서 별 실행중인 프로세스(디버깅용)
    const coreState = new Array(); // 프로세서 별 실행중인지 아닌지 확인하기 위한 변수(함수 안으로 옮겨야함)
    let dequeProcess; // 레디큐 -> 러닝프로세스배열로 옮기기위한 변수

    //큐
    let readyQueue = new Queue(); // 레디큐 생성
    let exitProcessQueue = new Queue(); // 종료조건을 위해 종료프로세스들을 모아둠
    
    //시간
    let prRunTime = new Array();  // max 런타임 처리
    let presentTime; // 현재시간 0으로 초기화
    let totoalTime; // 알고리즘 실행시간
    
    //실행 여부
    let runningProcess = new Array(); // 실행중인 프로세스
    let workIndex // 현재 작업중인 프로세서 인덱스
    
    //최종 결과
    let result = new Object();  // 최종결과 객체 반환
    // 객체에 들어갈 키값 변수
    let resultData = new Array(new Array());
    let readyQLog = new Array();
    let max;
    let resultTable = new Array();
    // ================ 선언부 종료 ========================
    

    //==================== 초기화 ===========================
    presentTime = 0;  // 현재시간 0 초로 초기화

    for(let i =0; i<nopr; i++) {
        coreState[i] = -1;  // 프로세서 수 만큼 프로세서상태를 꺼진상태(-1)으로 초기화
        coreData[i] = new Queue();
    }

    for(let i=0; i <nop; i++){ 
        processData[i] = {id: -1, at: -1, bt: -1,st:-1,et: -1, wt: 0, pr: -1, rt: -1, cs: 0};  // 프로세스 정보를 넣을 길이가 8인 배열 생성
        processData[i].id = i;  // 프로세스 번호
        processData[i].at = Number(atInput[i].value);  // 프로세스 도착시간
        processData[i].bt = Number(btInput[i].value);  // 프로세스 실행시간
    }
    //=====================초기화 종료========================

    //======================================== 실행부 ===============================================
    while(1){ // 무한루프
        for(let i=0;i<nop; i++) // 프로세스가 도착하면 레디큐에 삽입
            if (presentTime == processData[i].at) readyQueue.enqueue(processData[i]);

        //==================콘솔확인(디버깅)====================
        console.log("시간: ",presentTime);
        console.log("레디큐: ",readyQueue.toString());
        //==================콘솔확인(디버깅)====================
               
        while(readyQueue.empty() == false && coreState.indexOf(-1) >= 0){ 
            workIndex = coreState.indexOf(-1); // 꺼져있는 프로세서 중 가장 앞에 있는 프로세서의 인덱스를 반환
            coreState[workIndex] = 1; // 작업할 프로세서를 작동시킨다
            dequeProcess = readyQueue.dequeue(); // 레디큐에서 디큐한 프로세스를 dequeProcess에 임시 저장
            if((processData[dequeProcess.id].rt==-1)||(processData[dequeProcess.id].st==-1)){ // 처음실행하는 프로세스인경우(디큐 프로세스의 잔여시간이 없거나 시작시간이 없으면)
                processData[dequeProcess.id].rt = dequeProcess.bt; // 잔여시간은 총 실행시간
                processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간
            }
            processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간 매 초 업데이트
            processData[dequeProcess.id].pr = workIndex; // 프로세스에게 할당된 프로세서 번호 설정
            runningProcess.push(dequeProcess.id); // 실행중인프로세스 목록에 디큐된 프로세스 추가
        }
        
        readyQLog.push(readyQueue.toString());  // 레디큐 로그 업데이트
        
        //대기시간 측정
        for(let i = 0; i< nop; i++){
            if(readyQueue.search(processData[i])==true){
                processData[i].wt++;
            }
        }
        
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
                        if(processData[runningProcess[j]].pr == i) {
                            
                            if(processData[runningProcess[j]].rt <= 0){
                                //(프로세스 종료조건) 잔여시간 = 0 && 해당 프로세서가 켜져있을 떄
                                coreData[processData[runningProcess[j]].pr].enqueue([("P"+(runningProcess[j]+1)),processData[runningProcess[j]].st,presentTime]); // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
                                processData[runningProcess[j]].et = presentTime;  // 종료시간 업데이트
                                coreState[i] = -1; // 프로세서를 종료한다.
                                console.log("********************** P"+(runningProcess[j]+1)+" 종료 **********************")
                                exitProcessQueue.enqueue(processData[(runningProcess[j])]); // 잔여시간이 다지나서 종료큐로 이동
                                runningProcess[j] = -1; //프로세스를 종료한다.
                            }
                        }
                    }
                }
            }
        }
        if(exitProcessQueue.toLength() >= nop) break; // 모든 프로세스가 종료되면 반복문 종료
    }
    
    //============================================= 실행부 종료 ===========================================

    //======================== 결과, 리턴 처리 ==========================
    totoalTime = presentTime; //전체실행시간을 저장.
    console.log("=============결과=============== ");
    console.log("전체 실행 시간: ",totoalTime);
    // showContextSwit(); // 버그수정 필요
    
    //2021-04-21 17:47 결과표 배열
    for(let i =0;i<nop; i++) {
    let tt = (processData[i].et) - (processData[i].at);
    let wt = tt - processData[i].bt;
    resultTable[i] = [
        processData[i].id, 
        processData[i].at, 
        processData[i].bt,
        wt,
        tt, 
        Number((tt/processData[i].bt).toFixed(3)),
        processData[i].cs
        ];
    }

    //최종결과 처리
    for(let i =0; i < nopr;i++){  // 프로세서데이터 처리
        for(let j =0; j<coreData[i].toLength(); j++){
            resultData[i] = (coreData[i].dequeueAll())
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
    result.resultTable = resultTable;
    return result;
    //======================== 결과, 리턴 처리 종료 ==========================
}

function rr(atInput, btInput, numberOfCore, numberOfProcess){
    // =======================선언부=======================
    const nop = numberOfProcess;  // 총 프로세스 수
    const nopr = numberOfCore;  // 프로세서 수
    const qt =  Number(document.querySelector(".quantumTime").value); 
    const processData = new Array();  //processData  {프로세스번호(1부터), 도착시간, 실행시간, 시작시간, 종료시간, 대기시간, 할당된 프로세서 번호, 잔여시간}
    const coreData = new Array(); // 각 프로세서 별 실행중인 프로세스(디버깅용)
    const coreState = new Array(); // 프로세서 별 실행중인지 아닌지 확인하기 위한 변수(함수 안으로 옮겨야함)
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
    let resultTable = new Array();
    // ================ 선언부 종료 ========================

    //==================== 초기화 ===========================
    presentTime = 0;  // 현재시간 0 초로 초기화

    for(let i =0; i<nopr; i++) {
        coreState[i] = -1;  // 프로세서 수 만큼 프로세서상태를 꺼진상태(-1)으로 초기화
        coreData[i] = new Queue();
    }

    for(let i=0; i <nop; i++){ 
        processData[i] = {id: -1, at: -1, bt: -1,st:-1,et: -1, wt: 0, pr: -1, rt: -1, cs: 0};  // 프로세스 정보를 넣을 길이가 8인 배열 생성
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

        while(readyQueue.empty() == false && coreState.indexOf(-1) >= 0){ 
            workIndex = coreState.indexOf(-1); // 꺼져있는 프로세서 중 가장 앞에 있는 프로세서의 인덱스를 반환
            coreState[workIndex] = 1; // 작업할 프로세서를 작동시킨다
            dequeProcess = readyQueue.dequeue(); // 레디큐에서 디큐한 프로세스를 dequeProcess에 임시 저장
            if((processData[dequeProcess.id].rt==-1)||(processData[dequeProcess.id].st==-1)){ // 처음실행하는 프로세스인경우(디큐 프로세스의 잔여시간이 없거나 시작시간이 없으면)
                processData[dequeProcess.id].rt = dequeProcess.bt; // 잔여시간은 총 실행시간
                processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간
            }
            processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간 매 초 업데이트
            processData[dequeProcess.id].pr = workIndex; // 프로세스에게 할당된 프로세서 번호 설정
            runningProcess.push(dequeProcess.id); // 실행중인프로세스 목록에 디큐된 프로세스 추가
        }
        
        readyQLog.push(readyQueue.toString());  // 레디큐 로그 업데이트
        
        //대기시간 측정
        for(let i = 0; i< nop; i++){
            if(readyQueue.search(processData[i])==true){
                processData[i].wt++;
            }
        }
        
        
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
                            
                            if((processData[runningProcess[j]].rt != 0) && (presentTime == exitByQuantum) && (coreState[i] == 1)){
                                processData[runningProcess[j]].cs++;
                                // 잔여시간이 0이 아니고, 현재시간이 퀀텀에 의해 종료될 시간이며, 해당 프로세서가 켜져이싸면
                                coreData[processData[runningProcess[j]].pr].enqueue([("P"+(runningProcess[j]+1)),processData[runningProcess[j]].st,presentTime]); // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
                                coreState[i] = -1; // 프로세서를 종료한다.
                                console.log("****************** P"+(runningProcess[j]+1)+" 종료 By Quantum ******************")
                                exitQuantumQueue.enqueue(processData[(runningProcess[j])]); // 퀀텀시간이 지나 레디큐로 이동
                                runningProcess[j] = -1; // 프로세스를 종료한다.
                                break;
                            }else if(processData[runningProcess[j]].rt <= 0){
                                // processData[runningProcess[j]].cs++;  // 문맥전환 수 추가, 마지막 프로세스인 경우 밑에서 1차감
                                //(프로세스 종료조건) 잔여시간 = 0 && 해당 프로세서가 켜져있을 떄
                                coreData[processData[runningProcess[j]].pr].enqueue([("P"+(runningProcess[j]+1)),processData[runningProcess[j]].st,presentTime]); // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
                                processData[runningProcess[j]].et = presentTime;  // 종료시간 업데이트
                                coreState[i] = -1; // 프로세서를 종료한다.
                                console.log("********************** P"+(runningProcess[j]+1)+" 종료 **********************")
                                exitProcessQueue.enqueue(processData[(runningProcess[j])]); // 잔여시간이 다지나서 종료큐로 이동
                                runningProcess[j] = -1; //프로세스를 종료한다.
                            }
                        }
                    }
                }
            }
        }
        if(exitProcessQueue.toLength() >= nop) break; // 모든 프로세스가 종료되면 반복문 종료
    }
    //============================================= 실행부 종료 ===========================================

    //======================== 결과, 리턴 처리 ==========================
    totoalTime = presentTime; //전체실행시간을 저장.
    console.log("=============결과=============== ");
    console.log("전체 실행 시간: ",totoalTime);

    for(let i =0;i<nop; i++) {
        let tt = (processData[i].et) - (processData[i].at);
        let wt = tt - processData[i].bt;
        resultTable[i] = [
            processData[i].id, 
            processData[i].at, 
            processData[i].bt,
            wt,
            tt, 
            Number((tt/processData[i].bt).toFixed(3)),
            processData[i].cs
        ];
    }

    //최종결과 처리
    for(let i =0; i < nopr;i++){  // 프로세서데이터 처리
        for(let j =0; j<coreData[i].toLength(); j++){
            resultData[i] = (coreData[i].dequeueAll())
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
    result.resultTable = resultTable;
    return result;
    //======================== 결과, 리턴 처리 종료 ==========================
}

function spn(atInput, btInput, numberOfCore, numberOfProcess){ 
    // =======================선언부=======================
    const nop = numberOfProcess;  // 총 프로세스 수
    const nopr = numberOfCore;  // 프로세서 수
    let processData = new Array();  //processData  {프로세스번호(1부터), 도착시간, 실행시간, 시작시간, 종료시간, 대기시간, 할당된 프로세서 번호, 잔여시간}
    let coreData = new Array(); // 각 프로세서 별 실행중인 프로세스(디버깅용)
    let coreState = new Array(); // 프로세서 별 실행중인지 아닌지 확인하기 위한 변수(함수 안으로 옮겨야함)
    let dequeProcess; // 레디큐 -> 러닝프로세스배열로 옮기기위한 배열

    //큐
    const readyQueue = new Queue(); // 레디큐 생성
    let exitProcessQueue = new Queue(); // 종료조건을 위해 종료프로세스들을 모아둠
    
    //시간
    let prRunTime = new Array();  // max 런타임 처리
    let presentTime; // 현재시간 0으로 초기화
    let totoalTime; // 알고리즘 실행시간
    
    //실행 여부
    let runningProcess = new Array(); // 실행중인 프로세스
    let workIndex // 현재 작업중인 프로세서 인덱스
    
    //최종 결과
    let result = new Object();  // 최종결과 객체 반환
    // 객체에 들어갈 키값 변수
    let resultData = new Array(new Array());
    let readyQLog = new Array();
    let max;
    let resultTable = new Array();
    // ================ 선언부 종료 ========================   

    //==================== 초기화 ===========================
    presentTime = 0;  // 현재시간 0 초로 초기화

    for(let i =0; i<nopr; i++) {
        coreState[i] = -1;  // 프로세서 수 만큼 프로세서상태를 꺼진상태(-1)으로 초기화
        coreData[i] = new Queue();
    }

    for(let i=0; i <nop; i++){ 
        processData[i] = {id: -1, at: -1, bt: -1,st:-1,et: -1, wt: 0, pr: -1, rt: -1, cs: 0};  // 프로세스 정보를 넣을 길이가 8인 배열 생성
        processData[i].id = i;  // 프로세스 번호
        processData[i].at = Number(atInput[i].value);  // 프로세스 도착시간
        processData[i].bt = Number(btInput[i].value);  // 프로세스 실행시간
    }
    
    //=====================초기화 종료========================
    

    //======================================== 실행부 ===============================================
    while(1){ // 무한루프
        for(let i=0;i<nop; i++) // 프로세스가 도착하면 레디큐에 삽입
            if (presentTime == processData[i].at) readyQueue.enqueue(processData[i]);
        
        //==================콘솔확인(디버깅)====================
        console.log("시간: ",presentTime);
        console.log("레디큐: ","P"+readyQueue.toString());
        //==================콘솔확인(디버깅)====================
        
        while(readyQueue.empty() == false && coreState.indexOf(-1) >= 0){ 
            workIndex = coreState.indexOf(-1); // 꺼져있는 프로세서 중 가장 앞에 있는 프로세서의 인덱스를 반환
            coreState[workIndex] = 1; // 작업할 프로세서를 작동시킨다
            readyQueue.spnSort();
            dequeProcess = readyQueue.dequeue(); // 레디큐에서 디큐한 프로세스를 dequeProcess에 임시 저장
            if((processData[dequeProcess.id].rt==-1)||(processData[dequeProcess.id].st==-1)){ // 처음실행하는 프로세스인경우(디큐 프로세스의 잔여시간이 없거나 시작시간이 없으면)
                processData[dequeProcess.id].rt = dequeProcess.bt; // 잔여시간은 총 실행시간
                processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간
            }
            processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간 매 초 업데이트
            processData[dequeProcess.id].pr = workIndex; // 프로세스에게 할당된 프로세서 번호 설정
            runningProcess.push(dequeProcess.id); // 실행중인프로세스 목록에 디큐된 프로세스 추가
        }
        
        readyQLog.push(readyQueue.toString());  // 레디큐 로그 업데이트
        
        //대기시간 측정
        for(let i = 0; i< nop; i++){
            if(readyQueue.search(processData[i])==true){
                processData[i].wt++;
            }
        }
        
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
                        if(processData[runningProcess[j]].pr == i) {
                            
                            if((processData[runningProcess[j]].rt <= 0) && (coreState[i] == 1)){
                                //(프로세스 종료조건) 잔여시간 = 0 && 해당 프로세서가 켜져있을 떄
                                coreData[processData[runningProcess[j]].pr].enqueue([("P"+(runningProcess[j]+1)),processData[runningProcess[j]].st,presentTime]); // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
                                processData[runningProcess[j]].et = presentTime;  // 종료시간 업데이트
                                coreState[i] = -1; // 프로세서를 종료한다.
                                console.log("********************** P"+(runningProcess[j]+1)+" 종료 **********************")
                                exitProcessQueue.enqueue(processData[(runningProcess[j])]); // 잔여시간이 다지나서 종료큐로 이동
                                runningProcess[j] = -1; //프로세스를 종료한다.
                            }
                        }
                    }
                }
            }
        }

        if(exitProcessQueue.toLength() >= nop) break; // 모든 프로세스가 종료되면 반복문 종료
    }
    //============================================= 실행부 종료 ===========================================

    //======================== 결과, 리턴 처리 ==========================
    totoalTime = presentTime; //전체실행시간을 저장.
    console.log("=============결과=============== ");
    console.log("전체 실행 시간: ",totoalTime);
    // showContextSwit(); // 버그수정 필요
    //수정
    for(let i =0;i<nop; i++) {
        let tt = (processData[i].et) - (processData[i].at);
        let wt = tt - processData[i].bt;
        resultTable[i] = [
            processData[i].id, 
            processData[i].at, 
            processData[i].bt,
            wt,
            tt, 
            Number((tt/processData[i].bt).toFixed(3)),
            processData[i].cs
        ];
    }

    //최종결과 처리
    for(let i =0; i < nopr;i++){  // 프로세서데이터 처리
        for(let j =0; j<coreData[i].toLength(); j++){
            resultData[i] = (coreData[i].dequeueAll())
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
    result.resultTable = resultTable;
    return result;
    //======================== 결과, 리턴 처리 종료 ==========================
}

function srtn(atInput, btInput, numberOfCore, numberOfProcess){
    // =============선언부==============
    let nop = numberOfProcess;  // 총 프로세스 수
    let nopr = numberOfCore;  // 프로세서 수
    let processData = new Array(); //processData  {프로세스번호(1부터), 도착시간, 실행시간, 시작시간, 종료시간, 대기시간, 할당된 프로세서 번호, 잔여시간}
    let coreData = new Array(); // 각 프로세서 별 실행중인 프로세스(디버깅용)
    let coreState = new Array(); // 프로세서 별 실행중인지 아닌지 확인하기 위한 변수(함수 안으로 옮겨야함)
    let dequeProcess; // 레디큐 -> 러닝프로세스배열로 옮기기위한 변수
    
    //큐
    const readyQueue = new Queue(); // 레디큐 생성
    let exitQueue = new Array(); // Burst time이 길어진 프로세스를 레디큐에 옮기기 위해 잠시 보관해두는 큐
    let exitProcessQueue = new Queue(); // 종료조건을 위해 종료프로세스들을 모아둠

    // 시간
    let prRunTime = new Array();  // max 런타임 처리
    let presentTime; // 현재시간 0으로 초기화
    let totoalTime; // 알고리즘 실행시간
    
    //실행 여부
    let runningProcess = new Array(); // 실행중인 프로세스
    let workIndex // 현재 작업중인 프로세서 인덱스
    
    //최종 결과
    let result = new Object();  // 최종결과 객체 반환
    // 객체에 들어갈 키값 변수
    let resultData = new Array(new Array());
    let readyQLog = new Array();
    let max;
    let resultTable = new Array();
    // =============선언부 종료==================

    //-------------초기화------------------------
    presentTime = 0; // 현재시간 초기화

    for(let i =0; i<nopr; i++) {
        coreState[i] = -1;  // 프로세서 수 만큼 프로세서상태를 꺼진상태(-1)으로 초기화
        coreData[i] = new Queue();
    }

    for(let i=0; i <nop; i++){ 
        processData[i] = {id: -1, at: -1, bt: -1,st:-1,et: -1, wt: 0, pr: -1, rt: -1, cs: 0};  // 프로세스 정보를 넣을 길이가 8인 배열 생성
        processData[i].id = i;  // 프로세스 번호
        processData[i].at = Number(atInput[i].value);  // 프로세스 도착시간
        processData[i].bt = Number(btInput[i].value);  // 프로세스 실행시간
        processData[i].rt = Number(btInput[i].value); //프로세스 잔여 시간
    }
    //---------------초기화 종료-------------------------

    // ---------------------------------실행부---------------------------
    while(1){
        for(let i=0;i<nop; i++) // 프로세스가 도착하면 레디큐에 삽입
            if (presentTime == processData[i].at) readyQueue.enqueue(processData[i]);
        
        if(exitQueue.length != 0){
            temp = exitQueue.length; // dequeue에 의해 큐의 길이가 계속 변하기 때문에, 먼저 temp에 길이를 복사
            for(let i =0; i<temp;i++) readyQueue.enqueue(exitQueue.shift()); // 비교에 의해 종료된 큐를 이후에 레디큐에 삽입
        }
        
        readyQueue.srtnSort(); // 레디큐 rt 기준 오름차순 정렬
        
        //==================콘솔확인(디버깅)====================
        console.log("시간: ",presentTime);
        console.log("레디큐: ","P"+readyQueue.toString());
        //==================콘솔확인(디버깅)====================
        
        while ((readyQueue.empty() == false) && (coreState.indexOf(-1) == -1)){// 프로세서가 다 차있으면 레디큐 내 잔여 최솟값과 실행 프로세서 내 잔여 최댓값 비교 후 swap 필요
            let readyQMin = readyQueue.front().rt; // 레디큐 내 잔여 최솟값 (정렬돼있으므로 인덱스 0)
            let runningPsMax = -1; //러닝프로세스중 rt 최댓값 담을 변수
            let maxIndex = -1; //rt 최댓값인 러닝프로세스 인덱스 담을 변수
            for(let i = 0; i<runningProcess.length; i++){
                runningPsMax = Math.max(runningPsMax, processData[runningProcess[i]].rt) // rt 최댓값 찾기
                if(runningPsMax == processData[runningProcess[i]].rt) maxIndex = i; // 최댓값 rt 인덱스 찾기
            }
            if(readyQMin < runningPsMax){ // 레디큐 최솟값이 러닝프로세스 최댓값보다 작으면
                processData[runningProcess[maxIndex]].cs++;
                exitQueue.push(processData[runningProcess[maxIndex]]); // rt 러닝 프로세스 임시저장
                coreData[processData[runningProcess[maxIndex]].pr].enqueue(([("P"+(runningProcess[maxIndex]+1)),processData[runningProcess[maxIndex]].st,presentTime])); // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여)
                workIndex = processData[runningProcess[maxIndex]].pr;
                runningProcess.splice(maxIndex,1); // 최대 rt 러닝 프로세스 삭제
                dequeProcess = readyQueue.dequeue(); // 레디큐에서 디큐한 프로세스를 dequeProcess에 임시 저장
                if((processData[dequeProcess.id].st==-1)){ // 처음실행하는 프로세스인경우(디큐 프로세스의 시작시간이 없으면)
                    processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간
                }
                processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간 매 초 업데이트
                processData[dequeProcess.id].pr = workIndex; // 프로세스에게 할당된 프로세서 번호 설정
                runningProcess.splice(maxIndex,0,dequeProcess.id); // 실행중인프로세스 목록에 디큐된 프로세스 추가
            }
            else{// 더이상 레디큐 내 잔여시간이 실행 프로세스 잔여시간 보다 작은게 없다는 뜻
                break; // while 나감
            }
        }
        
        while((readyQueue.empty() == false) && (coreState.indexOf(-1) >= 0)){ // 빈 프로세서가 있는 경우
            workIndex = coreState.indexOf(-1); // 꺼져있는 프로세서 중 가장 앞에 있는 프로세서의 인덱스를 반환
            coreState[workIndex] = 1; // 작업할 프로세서를 작동시킨다
            dequeProcess = readyQueue.dequeue(); // 레디큐에서 디큐한 프로세스를 dequeProcess에 임시 저장
            if(processData[dequeProcess.id].st ==-1){ // 처음실행하는 프로세스인경우(디큐 프로세스의 시작시간이 없으면)
                processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간
            }
            processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간 매 초 업데이트
            processData[dequeProcess.id].pr = workIndex; // 프로세스에게 할당된 프로세서 번호 설정
            runningProcess.push(dequeProcess.id); // 실행중인프로세스 목록에 디큐된 프로세스 추가    
        }
        
        readyQLog.push(readyQueue.toString());  // 레디큐 로그 업데이트
        
        //대기시간 측정
        for(let i = 0; i< nop; i++){
            if(readyQueue.search(processData[i])==true){
                processData[i].wt++;
            }
        }
        
        presentTime++; //****************  현재시간 1추가 ******************  
        
        for(let i = 0; i < runningProcess.length; i++) {   // runningProcess안에 종료된 프로세스(-1)이 있다면 없앰(splice)
            if(runningProcess[i] == -1)  {
                runningProcess.splice(i, 1);
                i--;
            }
        }

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
                         
                        if(processData[runningProcess[j]].pr == i) {
                            
                            if((processData[runningProcess[j]].rt <= 0) && (coreState[i] == 1)){
                                //(프로세스 종료조건) 잔여시간 = 0 && 해당 프로세서가 켜져있을 때
                                coreData[processData[runningProcess[j]].pr].enqueue([("P"+(runningProcess[j]+1)),processData[runningProcess[j]].st,presentTime]); // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
                                processData[runningProcess[j]].et = presentTime;  // 종료시간 업데이트
                                coreState[i] = -1; // 프로세서를 종료한다.
                                console.log("********************** P"+(runningProcess[j]+1)+" 종료 **********************")
                                exitProcessQueue.enqueue(processData[(runningProcess[j])]); // 잔여시간이 다지나서 종료큐로 이동
                                runningProcess[j] = -1; //프로세스를 종료한다.
                            }
                        }
                    }
                }
            }
        }

        if(exitProcessQueue.toLength() >= nop) break; // 모든 프로세스가 종료되면 반복문 종료
    }
    
    //============================================= 실행부 종료 ===========================================

    //======================== 결과, 리턴 처리 ==========================

    totoalTime = presentTime; //전체실행시간을 저장.
    console.log("=============결과=============== ");
    console.log("전체 실행 시간: ",totoalTime);
    
    for(let i =0;i<nop; i++) {
        let tt = (processData[i].et) - (processData[i].at);
        let wt = tt - processData[i].bt;
        resultTable[i] = [
            processData[i].id, 
            processData[i].at, 
            processData[i].bt,
            wt,
            tt, 
            Number((tt/processData[i].bt).toFixed(3)),
            processData[i].cs
        ];
    }

    //최종결과 처리
    for(let i =0; i < nopr;i++){  // 프로세서데이터 처리
        for(let j =0; j<coreData[i].toLength(); j++){
            resultData[i] = (coreData[i].dequeueAll())
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
    result.resultTable = resultTable;
    return result;
    //======================== 결과, 리턴 처리 종료 ==========================
}

function hrrn(atInput, btInput, numberOfCore, numberOfProcess){ 
    // =======================선언부=======================
    const nop = numberOfProcess;  // 총 프로세스 수
    const nopr = numberOfCore;  // 프로세서 수
    let processData = new Array();  //processData  {프로세스번호(1부터), 도착시간, 실행시간, 시작시간, 종료시간, 대기시간, 할당된 프로세서 번호, 잔여시간}
    let coreData = new Array(); // 각 프로세서 별 실행중인 프로세스(디버깅용)
    let coreState = new Array(); // 프로세서 별 실행중인지 아닌지 확인하기 위한 변수(함수 안으로 옮겨야함)
    let dequeProcess; // 레디큐 -> 러닝프로세스배열로 옮기기위한 배열

    //큐
    const readyQueue = new Queue(); // 레디큐 생성
    let exitProcessQueue = new Queue(); // 종료조건을 위해 종료프로세스들을 모아둠
    
    //시간
    let prRunTime = new Array();  // max 런타임 처리
    let presentTime; // 현재시간 0으로 초기화
    let totoalTime; // 알고리즘 실행시간
    
    //실행 여부
    let runningProcess = new Array(); // 실행중인 프로세스
    let workIndex // 현재 작업중인 프로세서 인덱스
    
    //최종 결과
    let result = new Object();  // 최종결과 객체 반환
    // 객체에 들어갈 키값 변수
    let resultData = new Array(new Array());
    let readyQLog = new Array();
    let max;
    let resultTable = new Array();
    // ================ 선언부 종료 ========================

    //==================== 초기화 ===========================
    presentTime = 0;  // 현재시간 0 초로 초기화

    for(let i =0; i<nopr; i++) {
        coreState[i] = -1;  // 프로세서 수 만큼 프로세서상태를 꺼진상태(-1)으로 초기화
        coreData[i] = new Queue();
    }

    for(let i=0; i <nop; i++){ 
        processData[i] = {id: -1, at: -1, bt: -1,st:-1,et: -1, wt: 0, pr: -1, rt: -1, cs: 0};  // 프로세스 정보를 넣을 길이가 8인 배열 생성
        processData[i].id = i;  // 프로세스 번호
        processData[i].at = Number(atInput[i].value);  // 프로세스 도착시간
        processData[i].bt = Number(btInput[i].value);  // 프로세스 실행시간
    }
    //=====================초기화 종료========================

    //======================================== 실행부 ===============================================
    while(1){ // 무한루프
        for(let i=0;i<nop; i++) // 프로세스가 도착하면 레디큐에 삽입
            if (presentTime == processData[i].at) readyQueue.enqueue(processData[i]);




        //==================콘솔확인(디버깅)====================
        console.log("시간: ",presentTime);
        console.log("레디큐: ","P"+readyQueue.toString());
        //==================콘솔확인(디버깅)====================
        readyQueue.hrrnSort();
        
        
        
        while(readyQueue.empty() == false && coreState.indexOf(-1) >= 0){ 
            workIndex = coreState.indexOf(-1); // 꺼져있는 프로세서 중 가장 앞에 있는 프로세서의 인덱스를 반환
            coreState[workIndex] = 1; // 작업할 프로세서를 작동시킨다
            dequeProcess = readyQueue.dequeue(); // 레디큐에서 디큐한 프로세스를 dequeProcess에 임시 저장
            if((processData[dequeProcess.id].rt==-1)||(processData[dequeProcess.id].st==-1)){ // 처음실행하는 프로세스인경우(디큐 프로세스의 잔여시간이 없거나 시작시간이 없으면)
                processData[dequeProcess.id].rt = dequeProcess.bt; // 잔여시간은 총 실행시간
                processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간
            }
            processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간 매 초 업데이트
            processData[dequeProcess.id].pr = workIndex; // 프로세스에게 할당된 프로세서 번호 설정
            runningProcess.push(dequeProcess.id); // 실행중인프로세스 목록에 디큐된 프로세스 추가
        }
        
        readyQLog.push(readyQueue.toString());  // 레디큐 로그 업데이트
        
        //대기시간 측정
        for(let i = 0; i< nop; i++){
            if(readyQueue.search(processData[i])==true){
                processData[i].wt++;
            }
        }
        
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
                        if(processData[runningProcess[j]].pr == i) {
                            
                            if((processData[runningProcess[j]].rt <= 0) && (coreState[i] == 1)){
                                //(프로세스 종료조건) 잔여시간 = 0 && 해당 프로세서가 켜져있을 떄
                                coreData[processData[runningProcess[j]].pr].enqueue([("P"+(runningProcess[j]+1)),processData[runningProcess[j]].st,presentTime]); // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
                                processData[runningProcess[j]].et = presentTime;  // 종료시간 업데이트
                                coreState[i] = -1; // 프로세서를 종료한다.
                                console.log("********************** P"+(runningProcess[j]+1)+" 종료 **********************")
                                exitProcessQueue.enqueue(processData[(runningProcess[j])]); // 잔여시간이 다지나서 종료큐로 이동
                                runningProcess[j] = -1; //프로세스를 종료한다.
                            }
                        }
                    }
                }
            }
        }
        if(exitProcessQueue.toLength() >= nop) break; // 모든 프로세스가 종료되면 반복문 종료
    }
    
    //============================================= 실행부 종료 ===========================================

    //======================== 결과, 리턴 처리 ==========================

    totoalTime = presentTime; //전체실행시간을 저장.
    console.log("=============결과=============== ");
    console.log("전체 실행 시간: ",totoalTime);

    for(let i =0;i<nop; i++) {
        let tt = (processData[i].et) - (processData[i].at);
        let wt = tt - processData[i].bt;
        resultTable[i] = [
            processData[i].id, 
            processData[i].at, 
            processData[i].bt,
            wt,
            tt, 
            Number((tt/processData[i].bt).toFixed(3)),
            processData[i].cs
        ];
    }

    //최종결과 처리
    for(let i =0; i < nopr;i++){  // 프로세서데이터 처리
        for(let j =0; j<coreData[i].toLength(); j++){
            resultData[i] = (coreData[i].dequeueAll())
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
    result.resultTable = resultTable;
    return result;
    //======================== 결과, 리턴 처리 종료 ==========================
}

function hrr(atInput, btInput, numberOfCore, numberOfProcess){
    // =======================선언부=======================
    const nop = numberOfProcess;  // 총 프로세스 수
    const nopr = numberOfCore;  // 프로세서 수
    const qt =  Number(document.querySelector(".quantumTime").value); 
    const processData = new Array();  //processData  {프로세스번호(1부터), 도착시간, 실행시간, 시작시간, 종료시간, 대기시간, 할당된 프로세서 번호, 잔여시간}
    const coreData = new Array(); // 각 프로세서 별 실행중인 프로세스(디버깅용)
    const coreState = new Array(); // 프로세서 별 실행중인지 아닌지 확인하기 위한 변수(함수 안으로 옮겨야함)
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
    let resultTable = new Array();
    // ================ 선언부 종료 ========================

    //==================== 초기화 ===========================
    presentTime = 0;  // 현재시간 0 초로 초기화

    for(let i =0; i<nopr; i++) {
        coreState[i] = -1;  // 프로세서 수 만큼 프로세서상태를 꺼진상태(-1)으로 초기화
        coreData[i] = new Queue();
    }

    for(let i=0; i <nop; i++){ 
        processData[i] = {id: -1, at: -1, bt: -1,st:-1,et: -1, wt: 0, pr: -1, rt: -1, cs: 0};  // 프로세스 정보를 넣을 길이가 8인 배열 생성
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
        //==================콘솔확인(디버깅)=================== 
        while(readyQueue.empty() == false && coreState.indexOf(-1) >= 0){ 
            workIndex = coreState.indexOf(-1); // 꺼져있는 프로세서 중 가장 앞에 있는 프로세서의 인덱스를 반환
            coreState[workIndex] = 1; // 작업할 프로세서를 작동시킨다
            dequeProcess = readyQueue.dequeue(); // 레디큐에서 디큐한 프로세스를 dequeProcess에 임시 저장
            if((processData[dequeProcess.id].rt==-1)||(processData[dequeProcess.id].st==-1)){ // 처음실행하는 프로세스인경우(디큐 프로세스의 잔여시간이 없거나 시작시간이 없으면)
                processData[dequeProcess.id].rt = dequeProcess.bt; // 잔여시간은 총 실행시간
                processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간
            }
            processData[dequeProcess.id].st = presentTime; // 시작시간은 현재시간 매 초 업데이트
            processData[dequeProcess.id].pr = workIndex; // 프로세스에게 할당된 프로세서 번호 설정
            runningProcess.push(dequeProcess.id); // 실행중인프로세스 목록에 디큐된 프로세스 추가
        }
        
        readyQLog.push(readyQueue.toString());  // 레디큐 로그 업데이트
        
        //대기시간 측정
        for(let i = 0; i< nop; i++){
            if(readyQueue.search(processData[i])==true){
                processData[i].wt++;
            }
        }
        
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
                        let exitMyQantum = processData[runningProcess[j]].st + 1.5*qt;
                        if(processData[runningProcess[j]].pr == i) {
                            
                            if((processData[runningProcess[j]].rt != 0) && ((presentTime >= exitByQuantum)) && (coreState[i] == 1)){
                                console.log("dddddd",presentTime,exitByQuantum,exitMyQantum);
                                if((processData[runningProcess[j]].rt < 1.5*qt)){  // 남은시간이 1.5퀀텀이하면 그냥 나가
                                    break;
                                }
                                processData[runningProcess[j]].cs++;
                                // 잔여시간이 0이 아니고, 현재시간이 퀀텀에 의해 종료될 시간이며, 해당 프로세서가 켜져이싸면
                                coreData[processData[runningProcess[j]].pr].enqueue([("P"+(runningProcess[j]+1)),processData[runningProcess[j]].st,presentTime]); // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
                                coreState[i] = -1; // 프로세서를 종료한다.
                                console.log("****************** P"+(runningProcess[j]+1)+" 종료 By Quantum ******************")
                                exitQuantumQueue.enqueue(processData[(runningProcess[j])]); // 퀀텀시간이 지나 레디큐로 이동
                                runningProcess[j] = -1; // 프로세스를 종료한다.
                                break;
                            }else if(processData[runningProcess[j]].rt <= 0){
                                // processData[runningProcess[j]].cs++;  // 문맥전환 수 추가, 마지막 프로세스인 경우 밑에서 1차감
                                //(프로세스 종료조건) 잔여시간 = 0 && 해당 프로세서가 켜져있을 떄
                                coreData[processData[runningProcess[j]].pr].enqueue([("P"+(runningProcess[j]+1)),processData[runningProcess[j]].st,presentTime]); // 작업중인 프로세서에 어떤 프로세스가 들어갔는지 부여
                                processData[runningProcess[j]].et = presentTime;  // 종료시간 업데이트
                                coreState[i] = -1; // 프로세서를 종료한다.
                                console.log("********************** P"+(runningProcess[j]+1)+" 종료 **********************")
                                exitProcessQueue.enqueue(processData[(runningProcess[j])]); // 잔여시간이 다지나서 종료큐로 이동
                                runningProcess[j] = -1; //프로세스를 종료한다.
                            }
                        }
                    }
                }
            }
        }

        if(exitProcessQueue.toLength() >= nop) break; // 모든 프로세스가 종료되면 반복문 종료
    }
    //============================================= 실행부 종료 ===========================================

    //======================== 결과, 리턴 처리 ==========================
    totoalTime = presentTime; //전체실행시간을 저장.
    console.log("=============결과=============== ");
    console.log("전체 실행 시간: ",totoalTime);
    
    for(let i =0;i<nop; i++) {
        let tt = (processData[i].et) - (processData[i].at);
        let wt = tt - processData[i].bt;
        resultTable[i] = [
            processData[i].id, 
            processData[i].at, 
            processData[i].bt,
            wt,
            tt, 
            Number((tt/processData[i].bt).toFixed(3)),
            processData[i].cs
        ];
    }

    //최종결과 처리
    for(let i =0; i < nopr;i++){  // 프로세서데이터 처리
        for(let j =0; j<coreData[i].toLength(); j++){
            resultData[i] = (coreData[i].dequeueAll())
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
    result.resultTable = resultTable;
    return result;
    //======================== 결과, 리턴 처리 종료 ==========================
}
//------------------BackEnd-------------------------



// --------------------- FrontEnd -------------------
function init(){
    deleteBottomIndex();
    deleteProgressBar();
    deleteCoreName();
    deleteReadyQueue();
    deleteAllOfShowTable();
    deleteAllOfProgressBar();
    deleteColorList();
}

function createShowTable(resultTable, max){
    console.log("테이블 출력 부분");
    console.log(resultTable);
    let totalWt = 0;
    let totalCs = 0;
    //showTable
    for(let i=0; i <resultTable.length; i++){
        let newRow = showTable.insertRow(showTable.rows.length);  
        const cell0 = newRow.insertCell(0);
        cell0.innerText = "P"+ (resultTable[i][0]+1);
        
        const cell1 = newRow.insertCell(1);
        cell1.innerText = resultTable[i][1];
        
        const cell2 = newRow.insertCell(2);
        cell2.innerText = resultTable[i][2];
        
        const cell3 = newRow.insertCell(3);
        cell3.innerText = resultTable[i][3];
        totalWt += resultTable[i][3];

        const cell4 = newRow.insertCell(4);
        cell4.innerText = resultTable[i][4];
        
        const cell5 = newRow.insertCell(5);
        cell5.innerText = resultTable[i][5];
        
        const cell6 = newRow.insertCell(6);
        cell6.innerText = resultTable[i][6];
        totalCs += resultTable[i][6];
    }
    let totalLaw = showTable.insertRow(showTable.rows.length);  
        const cell0 = totalLaw.insertCell(0);
        cell0.innerText = "RESULT";
    
        const cell1 = totalLaw.insertCell(1);
        cell1.innerText = "RUNTIME:"+max;
    
        const cell2 = totalLaw.insertCell(2);
        cell2.innerText = "-";
    
        const cell3 = totalLaw.insertCell(3);
        cell3.innerText = "Total Wt: "+totalWt;
    
        const cell4 = totalLaw.insertCell(4);
        cell4.innerText = "-";
    
        const cell5 = totalLaw.insertCell(5);
        cell5.innerText = "-";
    
        const cell6 = totalLaw.insertCell(6);
        cell6.innerText = "Total Cs: "+totalCs;
    
}

function createProgressBar(resultData, maxTime, numberOfCore, nop){
    const colorListArray = ["#f08c8c","#bf82bf","#ff7f50","#8c8cbe","#f9ca24","#6fcc98", "#f6e58d","#badc58",
    "#c7ecee","#95afc0","#22a6b3","#7ed6df","#ff91dc","#6e9fed", "#a0a0ff","#a0a0a0",];  // 컬러 배열
    const progress = document.querySelector(".gantt_table__top-right");
    const progressBars = document.createElement("div");
    progressBars.className = "progressBars";
    progressBars.id = "progressBars";
    progress.appendChild(progressBars);

    let totalTime;
    let tmp;

    if(maxTime % 15 === 0){
        tmp = parseInt(maxTime / 15);
        totalTime = maxTime + tmp;
    }
    else{
        tmp = parseInt(maxTime / 15) + 1;
        totalTime = maxTime - (maxTime % tmp) + tmp;
    }
    console.log("totalTime" ,totalTime);
    //1초의 간격
    const widthInterval = 100 / totalTime;
    console.log("widthInterval", widthInterval);
    

    for(let i=0; i < numberOfCore; i++){
        //하나의 코어 만들기
        var childProg = document.createElement("div");
        childProg.className = "progressBar";
        childProg.id = "progressBar"+(i+1);
        progressBars.appendChild(childProg);

        if(resultData[i] === undefined) continue;

        for(let j=0; j<resultData[i].length; j++){
            const startIndex = j;
            while(j < resultData[i].length-1 && resultData[i][j][0] === resultData[i][j+1][0]) j++;

            const pro = document.createElement("div");
            pro.className = "progressBar__process";
            pro.id = "progressBar__process"+ resultData[i][startIndex][0];
         

            if(startIndex === 0) pro.style.marginLeft = (resultData[i][startIndex][1] * widthInterval) + "%";
            else pro.style.marginLeft = ((resultData[i][startIndex][1] - resultData[i][startIndex-1][2])*widthInterval)+ "%";
            let processWidth = (resultData[i][j][2] - resultData[i][startIndex][1]) * widthInterval;
            pro.style.width = processWidth + "%";
           
            console.log("processWidth",processWidth);
            if(processWidth > 3) pro.innerHTML = resultData[i][startIndex][0];
            else pro.innerHTML = "";


            if (matchMedia("screen and (min-width: 831px)").matches) {
                pro.addEventListener("mouseover", function(){
                    if((resultData[i][j][2] - resultData[i][startIndex][1]) * widthInterval < 12){
                        pro.style.width =  "15%";
                        pro.style.height = 40 + "px";
                    }
                    pro.innerHTML = resultData[i][startIndex][0] + "    [     " + resultData[i][startIndex][1] +" -> " + + resultData[i][j][2]+ "   ]   ";
                });
                pro.addEventListener("mouseout", function(){
                    if(pro.style.width === "15%"){
                        pro.style.width = (resultData[i][j][2] - resultData[i][startIndex][1]) * widthInterval + "%";
                        pro.style.height = 30 + "px";
                    }
                    if(processWidth > 3){
                        pro.innerHTML = resultData[i][startIndex][0];
                    }
                    else pro.innerHTML = "";
                });
              }


              
            childProg.appendChild(pro);
        }
    }
    for(let j=0; j<nop; j++){
        let colorList = document.querySelector(".color_list");

        // let colorListShow = document.createElement("div");
        // colorListShow.className = "color_list__show";
        // colorList.appendChild(colorListShow);

        let childColor = document.createElement("div");
        colorList.appendChild(childColor);
        childColor.className = "progressColor";
        childColor.id = "Color"+(j+1);
        childColor.innerHTML = "P"+(j+1);
        childColor.style.backgroundColor =colorListArray[j];
    }
}

function createBottomIndex(maxTime){
    const ganttTableBottom = document.querySelector(".gantt_table__bottom");
    let index = 0;
    let tmp;
    
    if(maxTime % 15 === 0){
        tmp = parseInt(maxTime / 15);
    }
    else{
        tmp = parseInt(maxTime / 15) + 1;
    }
    const plusWidth = 100 / (parseInt(maxTime/tmp) + 1);

    while(index <= maxTime){
        const time = document.createElement("div");
        time.innerText = index;
        time.style.width = plusWidth + "%";
        ganttTableBottom.appendChild(time);
        index += tmp;
    }
}

function showCoreName(numberOfCore){
    const ganttTableLeft = document.querySelector(".gantt_table__top-left");
    for(let i=0; i < numberOfCore; i++){
        var core = document.createElement("div");
        core.className = "CORE ";
        core.innerText = "CORE " + (i+1);
        ganttTableLeft.appendChild(core);
    }
}

function showProgressBar(maxTime){
    const progress = document.querySelector(".gantt_table__top-right");
    var white = document.createElement("div");
    white.className = "progressBar__time";
    white.id ="progressBar__time";  
    progress.appendChild(white);
    
    let totalTime;
    let tmp;
    
    if(maxTime % 15 === 0){
        tmp = parseInt(maxTime / 15);
        totalTime = maxTime + tmp;
    }
    else{
        tmp = parseInt(maxTime / 15) + 1;
        totalTime = maxTime - (maxTime % tmp) + tmp;
    }

    setTimeout(function(){
        white.style.animation = "leftmargin "+(totalTime/1.5)+"s linear 1 both";
    }, 1000);
    setTimeout(function(){
        baram.style.animationPlayState = "paused";
    }, totalTime*1000/1.5);

    var proTime = document.getElementById("progressBar__time");  // 클릭시 전체보기
    proTime.addEventListener('click',function () {
        proTime.parentElement.removeChild(proTime);
        baram.style.animationPlayState = "paused";
      });
}

function showReadyQueue(readyQueue){
    const readyqueue = document.querySelector(".ready_queue"); 
    var readyqueueShow = document.createElement("div");
    readyqueueShow.className = "ready_queue__show";
    readyqueue.appendChild(readyqueueShow);

    const time = readyQueue.length;
    let start = 0;

    const id = setInterval(show, 1000/1.5);
    function show(){
        
        //초기화
        while ( readyqueueShow.hasChildNodes() ) { 
            readyqueueShow.removeChild( readyqueueShow.firstChild ); 
        }

        if(start >= time){
            clearInterval(id);
        }
        else{
            //다음 생성
            for(let i = 0; i<readyQueue[start].length; i++){
                const node = document.createElement("div");
                node.className = "readyQueue__process";
                node.id = "P" + readyQueue[start][i];
                node.innerHTML = "P" +readyQueue[start][i];
                readyqueueShow.appendChild(node);
            }
            start++;
        }
    }
    var proTime = document.getElementById("progressBar__time");  // 클릭시 전체보기
    proTime.addEventListener('click',function () {
        readyqueueShow.style.display= "none";
    });
}

function deleteColorList(){
    let colorList = document.querySelector(".color_list");
    while(colorList !== null && colorList.hasChildNodes()){ 
        colorList.removeChild(colorList.firstChild);
    }
}

function deleteReadyQueue(){
    var del = document.querySelector(".ready_queue"); 
    if(del !== null && del.hasChildNodes() ) { 
        del.removeChild( del.lastChild ); 
    }
}

function deleteAllOfShowTable(){
    while(showTable.rows.length>0){
        showTable.deleteRow(0);
    }
}

function deleteBottomIndex(){
    var del = document.querySelector(".gantt_table__bottom"); 
    while ( del.hasChildNodes() ) { 
        del.removeChild( del.firstChild ); 
    }
}

function deleteCoreName(){
    var del = document.querySelector(".gantt_table__top-left"); 
    while ( del.hasChildNodes() ) { 
        del.removeChild( del.firstChild ); 
    }
}

function deleteProgressBar(){
    var del = document.querySelector(".gantt_table__top-right");
    while(del !== null && del.hasChildNodes()){ 
        del.removeChild(del.firstChild);
    }
}

function deleteColorList(){
    let colorList = document.querySelector(".color_list");
    while(colorList !== null && colorList.hasChildNodes()){ 
        colorList.removeChild(colorList.firstChild);
    }
}

function deleteAllOfProgressBar(){
    var del = document.getElementById("progressBars"); 
    while ( del !== null && del.hasChildNodes() ) { 
        del.removeChild( del.firstChild ); 
    }
}
//-------------------- FrontEnd 끝--------------------