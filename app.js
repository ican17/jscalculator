// global variables
const digit = document.querySelectorAll(".digit");
const op = document.querySelectorAll(".operator");
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
  ]);

// listeners 
function eventListeners(){

    digit.forEach((item)=>{
        item.addEventListener("click", getOperand);
    });

    op.forEach((item)=>{
        item.addEventListener("click", getOperator);
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
            //update the display of the expression on the screen
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
            
            //...... Implementation of the Shunting-yard algorithm...Step 1.....//
            operands.push(expression);
            // reintialize the expression variable to recieve a new operand
            expression = "";
            while (operands.length > 1 && operators.length != 0 && (precedTable.get(operators[operators.length-1]) >= precedTable.get(e.target.textContent))) {

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
        //...... Implementation of the Shunting-yard algorithm...Step 2.....//
        operands.push(expression);
        expression = "";
        console.log(operands);
        console.log(operators);
        //......
        while ( operators.length != 0 ) {
            const rightOp = operands.pop();
            const leftOp = operands.pop();
            const op = operators.pop();
            console.log(rightOp,leftOp,op);
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
            console.log(operands);
        }
        
    }
    
}

function updateExpression(){
    //console.log(operators, operands);
}

function validExpression(fraction, type){

    if (type === "operator") {
        if(expression !== ""){ // there's no operand before, it's then an invalid operator
            const regex = /^[\+\-x]$/;
            if(regex.test(fraction)){
                return true;
            }
        }
        return false;
       
    } else if(type === "operand") { 
        let expr = expression + fraction;
        const regex = /^([0-9]+)([\.][0-9]*){0,1}$/;
        if(regex.test(expr)){
            return true;
        }
        return false; 
    }
   
}