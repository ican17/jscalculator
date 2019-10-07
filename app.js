// global variables
const digit = document.querySelectorAll(".digit");
const op = document.querySelectorAll(".operator");
const parenth = document.querySelectorAll(".parenth");
const eval = document.querySelector(".eval span");
const displayExpr = document.querySelector(".expression");
const displyEval = document.querySelector(".evaluation");
const reinitialize =  document.querySelector(".reinitialize");
const displayErrMsg = document.querySelector(".calculator-error-msg");
let completeExpr = "";
let expression = "";
let operand;
const operands =[];
const operators = [];
let precedTable = new Map([
    ['-', 1],
    ['+', 1],
    ['x', 2],
    ['/', 2],
    ['^', 3],
    [')', 0],
    ['(', 0],
  ]);
let previous =""; // to track the user input and check the validity of the expression

// listeners 
function eventListeners(){

    digit.forEach((item)=>{
        item.addEventListener("click", getOperand);
        item.addEventListener("click", changeStyle);
    });

    op.forEach((item)=>{
        item.addEventListener("click", getOperator);
        item.addEventListener("click", changeStyle);
    });

    parenth.forEach((item)=>{
        item.addEventListener("click", parenthClicked);
    });

    eval.addEventListener("click", evalCLicked);
    eval.addEventListener("click", changeStyle);
    reinitialize.addEventListener("click", reinitializeAll);
    
}

eventListeners();

// FUNCTIONS :

/** 1 : FOR THE CALCULATOR FUNCTIONS */
function reinitializeAll(e = null){
        previous ="";
        completeExpr = "";
        expression = "";
        operand;
        operands.length = 0;
        operators.length = 0;
        displayExpr.innerHTML = "";
        displyEval.innerHTML = "0";
    
}
function getOperand(e){
    if (e.target) {
        //check if the expression is valid?
        if(validExpression(e.target.textContent, "operand")){

             // do the concatination
            expression += e.target.textContent; 
            previous = "OPERAND";
            completeExpr += e.target.textContent;
            //update the display of the expression on the screen
            updateExpression(); 
        }else{
            // specify why? error or need to evaluate?
            displayErrorMsg("Invalide Expression");
        }
        
    }
}

function parenthClicked(e){
    if (e.target) {
        //check if the expression is valid?
        if(validExpression(e.target.textContent, "parenth")){
            completeExpr += e.target.textContent;
            if(expression != ""){// if it's an operand
                operands.push(Number(expression));
                // reintialize the expression variable to recieve a new operand
                expression = "";
            }

            if (e.target.textContent === "(") { // it's a left parenth
                previous= "OPENING PARENTH";
                operators.push(e.target.textContent);
            }else if(e.target.textContent === ")") { // it's a right parenth
                previous= "CLOSING PARENTH";
                while (operators[operators.length-1] !== "(") { // while the top item in the stack is not an opening parenth
                    
                    // Do Operation and Push it to the operands stack !
                    const rightOp = operands.pop();
                    const leftOp = operands.pop();
                    const op = operators.pop();
                
                    doEvaluation(op, leftOp, rightOp)
                }
                operators.pop(); // pop the left parenthesis

            }
            updateExpression(); 
        }else{
            // specify why? error or need to evaluate?
            displayErrorMsg("Invalide Expression");
        }
        
    }
}

function getOperator(e){
    if (e.target) {
        //check if the expression is valid?
        if(validExpression(e.target.textContent, "operator")){
            completeExpr += e.target.textContent;
            previous= "OPERATOR";
            // push the Operand
            if(expression != ""){// if it's an operand
                operands.push(Number(expression));
                // reintialize the expression variable to recieve a new operand
                expression = "";
            }

            // check for precedence of the operator , do the operations and push to the stack
            while ( operators.length != 0 && (precedTable.get(operators[operators.length-1]) >= precedTable.get(e.target.textContent))) {

                const rightOp = operands.pop();
                const leftOp = operands.pop();
                const op = operators.pop();

                doEvaluation(op, leftOp, rightOp)
            }

            operators.push(e.target.textContent);
            updateExpression();
        }else{
            // specify why? error or need to evaluate?
            displayErrorMsg("Invalide Expression");
        }
        
    }
    
    
}


function evalCLicked(e){
    if(e.target){
        //check if the expression is valid?
        if(validExpression(e.target.textContent, "eval")){
            previous= "EVAL";
            // push the operand
            if (expression != "") {
                operands.push(Number(expression));
                expression = "";
            }
        
            // check if there's operations remaining and do the evaluation and push to the stack 
            while ( operators.length != 0 ) {
                const op = operators.pop();
                if(op !== "("){ // IN case the user forget to add the final closing parenthesis
                    const rightOp = operands.pop();
                    const leftOp = operands.pop();

                    doEvaluation(op, leftOp, rightOp)
                
                }
                
            }
            if(operands.length != 0 ){
                displayExpr.innerHTML = operands[operands.length-1];
                displyEval.innerHTML = operands[operands.length-1];
                completeExpr = operands[operands.length-1];
            }
            
            // console.log(operands); // display the final result
        }else{
            // specify why? error or need to evaluate?
            displayErrorMsg("Invalide Expression");
        }

        
    }
    
}

function updateExpression(){
    displayExpr.innerHTML = completeExpr;
    displyEval.innerHTML = expression;
}

function validExpression(fraction, type){

    if (type === "operator") {
        if(previous === "OPERAND" || previous === "CLOSING PARENTH" || previous === "EVAL"){ 
            const regex = /^[\+\-x/\^]$/;
            if(regex.test(fraction)){
                return true;
            }
        }
        return false;
       
    } else if(type === "operand") { 
        if(previous === "OPERATOR" || previous === "OPENING PARENTH" || previous === "" || previous === "OPERAND"){ 
            let expr = expression + fraction;
            const regex = /^([0-9]+)([\.][0-9]*){0,1}$/;
            if(regex.test(expr)){
                return true;
            }
        } 
        return false; 
    }else if (type === "parenth"){
        const regex = /^[(\(\))]$/;
        if(regex.test(fraction)){
            if(fraction.match(regex) == "("){
                if(previous === "OPERATOR" || previous === "OPENING PARENTH" || previous === ""){
                    return true;
                }

            }else{
                if(previous === "OPERAND" || previous === "CLOSING PARENTH" ){
                    return true;
                }
            }
        }
        return false;
    }else if(type == "eval"){
        if(previous === "OPERAND" || previous === "CLOSING PARENTH" ){
            const regex = /^=$/;
            if(regex.test(fraction)){
                return true;
            }
        }
        
        return false;
    }
   
}

function doEvaluation(op, leftOp, rightOp){
    switch (op) {
        case "+":
            operands.push(Number(leftOp) + Number(rightOp));                   
            break;
        case "-":
                operands.push(Number(leftOp) - Number(rightOp));                   
                break;
        case "/":
                if( Number(rightOp) != 0){
                    operands.push(Number(leftOp) / Number(rightOp));
                }else{
                    displayErrorMsg("Division by zero not allowed!");
                    reinitializeAll();
                }
                                   
                break;
        case "x":
                operands.push(Number(leftOp) * Number(rightOp));                   
                break;
        case "^":
                operands.push(Math.pow(Number(leftOp), Number(rightOp)));                   
                break;
        default:
            break;
    }
}

/** FOR THE CALCULATOR STYLE AND UX */
function changeStyle(e){
    if(e.target){
        const elm = e.target.parentElement;
        if(elm.classList.contains("digit")){
            changeStyleClass(elm, "digit", "digit-clicked");
        }else if(elm.classList.contains("operator")){
            changeStyleClass(elm, "operator", "operator-clicked");
        }else if(elm.classList.contains("eval")){
            changeStyleClass(elm, "eval", "eval-clicked");
        }
        
        
    }
}

function changeStyleClass(elm, initial, to){
    elm.classList.toggle(initial);
    elm.classList.add(to);
    setTimeout(() => {
        elm.classList.remove(to);
        elm.classList.toggle(initial);
    }, 300);
}

function displayErrorMsg(msg){

    displayErrMsg.classList.add("show");
    displayErrMsg.textContent = msg;
    setTimeout(() => {
        displayErrMsg.classList.remove("show");
        displayErrMsg.textContent = "";
    }, 1000);

}