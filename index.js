const inputTable = document.querySelector("#input-table");
const showTable = document.querySelector("#show-table");
const body = document.querySelector("body");

//FCFS 실행되는지 보기 위해 만든 배열
var array = Array.from(Array(4), () => new Array(6));

//arrival time과 burst time을 저장하는 2차원 배열 만들기 
//-> array에 저장(addRow을 할때마다 값을 저장해준다.)

/*to do 
1. 실행을 눌렀을 때 배열이 만들어지며 계산을 실행한다.
2. 또한 설정값을 다르게 했을 때 다른 함수가 실행되도록 한다.*/

function chooseProcessAlgorithm(){
    const selectprocess = document.querySelector(".selectprocess");
    const processValue = selectprocess.value;
    //console.log(processValue);
    // if(processValue == "fcfs"){
    //     fcfs();
    // }
    // else if(processValue == "rr"){
    //     rr();
    // }
    // else if(processValue == "spn"){
    //     spn();
    // }
    // else if(processValue == "sptn"){
    //     sptn();
    // }
    // else if(processValue == "hrrn"){
    //     hrrn();
    // }
    // else if(processValue == "newalgorithm"){
    //     newalgorithm();
    // }
}

// 프로세스 입력 추가 테이블
function addInputRow(){
    if(inputTable.rows.length < 15){
        let newRow = inputTable.insertRow(inputTable.rows.length );
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

function createShowTable(){
    deleteAllOfShowTable();
    for(let i=0; i <inputTable.rows.length; i++){
        var getRow = showTable.insertRow(showTable.rows.length);
        const row0 = getRow.insertCell(0);
        row0.innerText = array[i][0];
        const row1 = getRow.insertCell(1);
        row1.innerText = array[i][1];
        const row2 = getRow.insertCell(2);
        row2.innerText = array[i][2];
    }
}

function deleteAllOfShowTable(){
    while(showTable.rows.length>0){
        showTable.deleteRow(0);
    }
}

function createProgressBar(){
    deleteAllOfProgressBar();
    for(let i=0; i < inputTable.rows.length; i++){
        var childProg = document.createElement("div");
        childProg.className = "progressBar";
        childProg.id ="progressBar";
        progressBars.appendChild(childProg);
    }
}

//20초를 100%로 잡고 시작 
//1초당 5%씩 올라감
function showProgressBar(){
    const progress = document.querySelectorAll(".progressBar");
    for(let i=0; i<progress.length; i++){
        var width = 0;
        var max = 100;
        var id = setInterval(frame, 500);
        var second = 1;
        function frame(){
            if(width >= max){
                clearInterval(id);
            }
            else{
                width += 5;
                progress[i].style.width = width+"%";
                progress[i].innerHTML = second++;
            }
        }
    }
}

function deleteAllOfProgressBar(){
    var del = document.getElementById("progressBars"); 
    while ( del.hasChildNodes() ) { 
        del.removeChild( del.firstChild ); 
    }
}

function run(){
    const ar = document.querySelectorAll(".arrivalTime");
    const br = document.querySelectorAll(".burstTime");

    //프로세서 수 console창에 띄우기
    console.log(document.querySelector(".numofprocessors").value);

    //Name, Arrival Time, Buster Time, Wating Time, Turnaound Time, Nomarlized TT 저장 배열
    for(let i=0; i <inputTable.rows.length; i++){
        array[i][0] = "P"+(i+1);
        array[i][1] = ar[i].value;
        array[i][2] = br[i].value;
    }
    console.log(array);
    // 표 만들기 : 이름, Arrival Time, Buster Time, Wating Time, Turnaound Time, Nomarlized TT
    createShowTable();

    //progress bar 함수 -> 큰 창과 그 내부 프로세스들의 상태바 만들기 위한 용도
    createProgressBar();

    //종류 가져오기
    chooseProcessAlgorithm();

    //실행 progress 보여주기
    showProgressBar();
}

