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
    
   var data = {
       allItems: {
           exp: [],
           inc: []
       },
       
       totals: {
           exp:0,
           inc:0
       }
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
        expensesContainer:'.expenses__list'
    }

    return {
        
    getinput: function(){
        
        return {
        // get the value of the input + or - | inc or exp
        type: document.querySelector(DOMstrings.inputType).value,
        // get the value of the description 
        description: document.querySelector(DOMstrings.inputDescription).value,
        // get the value of the input Value
        value: document.querySelector(DOMstrings.inputValue).value
        }
    },
        
    
    addListItem: function(obj, type){
        var html, element, newHtml
            
        if(type === 'inc'){
            
            element = DOMstrings.incomeContainer;
            
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }else if ( type === 'exp'){

            element = DOMstrings.expensesContainer;

           html = '<div class="item clearfix" id="expense-%id%"><div class="item__description"> %description% </div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' 
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
    })
        
}
    
   
    
    var addItem = function (){
        
         // get the input data 

        input = UICtrl.getinput();

        console.log(input);
                
        // Add the item to the budget conttroller

        newItem = budgetCtrl.addItem(input.type, input.description, input.value)

        console.log(newItem);

        // clear filed
        UICtrl.clearFields();
        //Add the item the UI
        
        UICtrl.addListItem(newItem, input.type);
        //Calculate the budget
        
        //Display the budget on the UI 
        
    }
    
   return {
       init: function(){
           console.log('the application has started');
           setupEventListeners();
       }
   } 
  
    
}(budgetController, UIController))


controller.init();