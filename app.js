// global variables
const digit = document.querySelectorAll(".digit");
const op = document.querySelectorAll(".operator");
const parenth = document.querySelectorAll(".parenth");
const eval = document.querySelector(".eval span");
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
    });

    op.forEach((item)=>{
        item.addEventListener("click", getOperator);
    });

    parenth.forEach((item)=>{
        item.addEventListener("click", parenthClicked);
    });

    eval.addEventListener("click", evalCLicked)
    
}

eventListeners();
// functions

function getOperand(e){
    if (e.target) {
        //check if the expression is valid?
        if(validExpression(e.target.textContent, "operand")){
             // do the concatination
            expression += e.target.textContent; 
            previous = "OPERAND";
            //update the display of the expression on the screen
            updateExpression(); 
        }else{
            // specify why? error or need to evaluate?
            console.log("Invalide Expression");
        }
        
    }
}

function parenthClicked(e){
    if (e.target) {
        //check if the expression is valid?
        if(validExpression(e.target.textContent, "parenth")){
            
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
                
                    switch (op) {
                        case "+":
                            operands.push(Number(leftOp) + Number(rightOp));                   
                            break;
                        case "-":
                                operands.push(Number(leftOp) - Number(rightOp));                   
                            break;
                        case "/":
                                operands.push(Number(leftOp) / Number(rightOp));                   
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
                operators.pop(); // pop the left parenthesis

            }
            updateExpression(); 
        }else{
            // specify why? error or need to evaluate?
            console.log("Invalide Expression");
        }
        
    }
}

function getOperator(e){
    if (e.target) {
        //check if the expression is valid?
        if(validExpression(e.target.textContent, "operator")){
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
                console.log(op);
                switch (op) {
                    case "+":
                        operands.push(Number(leftOp) + Number(rightOp));                   
                        break;
                    case "-":
                            operands.push(Number(leftOp) - Number(rightOp));                   
                        break;
                    case "/":
                            operands.push(Number(leftOp) / Number(rightOp));                   
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

            operators.push(e.target.textContent);
            updateExpression();
        }else{
            // specify why? error or need to evaluate?
            console.log("Invalide Expression");
        }
        
    }
    
    
}


function evalCLicked(e){
    if(e.target){
        //check if the expression is valid?
        if(validExpression(e.target.textContent, "eval")){
            previous= "";
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
                    
                    switch (op) {
                        case "+":
                            operands.push(Number(leftOp) + Number(rightOp));                   
                            break;
                        case "-":
                                operands.push(Number(leftOp) - Number(rightOp));                   
                                break;
                        case "/":
                                operands.push(Number(leftOp) / Number(rightOp));                   
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
                
            }
            console.log(operands); // display the final result
        }else{
            // specify why? error or need to evaluate?
            console.log("Invalide Expression");
        }

        
    }
    
}

function updateExpression(){
    //console.log(operators, operands);
}

function validExpression(fraction, type){

    if (type === "operator") {
        if(previous === "OPERAND" || previous === "CLOSING PARENTH"){ 
            console.log(previous);
            const regex = /^[\+\-x/\^]$/;
            if(regex.test(fraction)){
                return true;
            }
        }
        return false;
       
    } else if(type === "operand") { 
        if(previous === "OPERATOR" || previous === "OPENING PARENTH" || previous === ""){ 
            console.log(previous);
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
                    console.log(previous);
                    return true;
                }

            }else{
                if(previous === "OPERAND" || previous === "CLOSING PARENTH" ){
                    console.log(previous);
                    return true;
                }
            }
        }
        return false;
    }else if(type == "eval"){
        if(previous === "OPERAND" || previous === "CLOSING PARENTH" ||previous === ""){
            console.log(previous);
            const regex = /^=$/;
            if(regex.test(fraction)){
                return true;
            }
        }
        
        return false;
    }
   
}