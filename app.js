var budgetController = (function () {
    
    var Expense = function(id, description, value) {
        
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value) {
        
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var caluclateTotal = function(type){
        var sum = 0;
        
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        
        data.totals[type] = sum;
    }
   var data = {
       allItems: {
           exp: [],
           inc: []
       },
       
       totals: {
           exp:0,
           inc:0
       },
       
       budget: 0,
       percentage: -1
   } 
   
   return {
       addItem: function(type, des, val){
           var newItem, ID;
           
           //create a new ID
           if ( data.allItems[type].length > 0 ){
               ID = data.allItems[type][data.allItems[type].length -1].id + 1 
           } else {
               ID = 0;
           }
           
           // create a new item based on 'inc' or 'Exp'
           
           if(type === 'exp'){
               newItem = new Expense(ID, des, val)
           }else if (type === 'inc') {
               newItem = new Income(ID,des, val)
           }
           
           //push to our Data structure
           
           data.allItems[type].push(newItem);
           
           // return the new Item 
           return newItem;
       },
       
       
       
       calculateBudget: function(){
       
           // calculate total income and expenses
           
           caluclateTotal('exp');
           caluclateTotal('inc');
           
           
           // calculate the Budget: income - expenses 
           
           data.budget = data.totals.inc - data.totals.exp;
           
           // calculate the percentage of income that  we spent
           if(data.totals.inc > 0){
            data.percentage = Math.round((data.totals.exp/ data.totals.inc) * 100);
           } else {
               data.percentage = -1;
           }
          
       },
       
       getBudget: function(){
           return {
               budget: data.budget,
               totalInc: data.totals.inc,
               totalExp: data.totals.exp,
               percentage: data.percentage
               
           }
       },
       
       testing: function(){
           console.log(data);
       }
   }
   
}());


var UIController = (function(){
    // some code here
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel: '.budget__value',
        incomeLable: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container:'.container'
        
    }

    return {
        
    getinput: function(){
        
        return {
        // get the value of the input + or - | inc or exp
        type: document.querySelector(DOMstrings.inputType).value,
        // get the value of the description 
        description: document.querySelector(DOMstrings.inputDescription).value,
        // get the value of the input Value
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
        }
    },
        
    
    addListItem: function(obj, type){
        var html, element, newHtml
            
        if(type === 'inc'){
            
            element = DOMstrings.incomeContainer;
            
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }else if ( type === 'exp'){

            element = DOMstrings.expensesContainer;

           html = '<div class="item clearfix" id="exp-%id%"><div class="item__description"> %description% </div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' 
        }
            
        // Replace place holder with some actual data 
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', obj.value);

        // insert the Html into the DOM
        
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)

        
    },
    
    clearFields: function(){
        var fields, fieldsArr;
        
        fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

        
        // some how the above filed is list and not arry and we need to change it to arr using this trick
        fieldsArr = Array.prototype.slice.call(fields);
        
        fieldsArr.forEach(function(current, index, array){
            current.value = "";
        });
        
        fieldsArr[0].focus();
        
    },
        
    displayBudget: function(obj){
        
        document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
        document.querySelector(DOMstrings.incomeLable).textContent = obj.totalInc;
        document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
        
        
        if(obj.percentage > 0){
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        }else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '--';
        }
    },
    
    getDOMstrings: function(){
        return DOMstrings;
    }
}
    
}())


var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){

         var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', addItem);
    
        document.addEventListener('keypress', function(event){
        
        if(event.keyCode === 13){
         addItem();
        }
    });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
        
};
    
   var updateBudget = function(){
       // 1. Calculate the budget
       
       budgetCtrl.calculateBudget();
       
       // Return the Budget
       var budget = budgetCtrl.getBudget();
       
       // Display the budget on the UI
       UICtrl.displayBudget(budget);       
   }
    
    var addItem = function (){
        
         // get the input data 

        input = UICtrl.getinput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
        // Add the item to the budget conttroller

        newItem = budgetCtrl.addItem(input.type, input.description, input.value)
        //Add the item the UI
        
        UICtrl.addListItem(newItem, input.type);
        
        // clear filed
        UICtrl.clearFields();
        //Calculate the budget

       updateBudget();
        
        //Display the budget on the UI
            
        }
                 
    };
    
    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;

       itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];
        }
    }
    
   return {
       init: function(){
           console.log('the application has started');
           UICtrl.displayBudget( {
               budget: 0,
               totalInc:0,
               totalExp: 0,
               percentage: -1
               
           });
               
           setupEventListeners();
       }
   } 
  
    
}(budgetController, UIController))


controller.init();